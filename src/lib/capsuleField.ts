/**
 * Pointer-reactive spring field for the partner capsules, ported 1:1 from the source
 * (functions _P, x_, yP, bP, wP, AP in the production bundle).
 */

export interface GridSize {
  cols: number
  rows: number
}

export interface Body {
  x: number
  y: number
  vx: number
  vy: number
  tx: number
  ty: number
}

export interface Point {
  x: number
  y: number
}

export type FieldConfig = ReturnType<typeof createFieldConfig>

export const createBody = (): Body => ({ x: 0, y: 0, vx: 0, vy: 0, tx: 0, ty: 0 })

export function createFieldConfig(grid?: GridSize) {
  return {
    sigmaRadialPx: 200,
    sigmaTrailPx: 260,
    wakeVsRadial: 0.38,
    velSatPxPerFrame: 2.8,
    strengthRadial: 14,
    strengthTrailRatio: 0.42,
    tauNearFrames: 2.8,
    tauFarFrames: 10,
    maxGraphDist: grid ? Math.max(8, Math.max(1, grid.cols - 1 + grid.rows - 1)) : 8,
    kField: 0.12,
    kRest: 0.075,
    damp: 0.98,
    couple: 0.028,
    coupleLength: 1.35,
    maxOffsetPx: 18,
  }
}

const gaussian = (d: number, sigma: number) => {
  if (sigma < 1e-6) return 0
  const n = d / sigma
  return Math.exp(-0.5 * n * n)
}
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v))
const cellOf = (id: number, cols: number) => ({ row: Math.floor(id / cols), col: id % cols })

/** Breadth-first grid distance between two cells. */
export function graphDistance(from: number, to: number, grid: GridSize) {
  const { cols, rows } = grid
  const queue = [from]
  const seen = new Map([[from, 0]])
  for (let i = 0; i < queue.length; i++) {
    const id = queue[i]
    const d = seen.get(id)!
    if (id === to) return d
    const { row, col } = cellOf(id, cols)
    for (const [r, c] of [
      [row - 1, col],
      [row + 1, col],
      [row, col - 1],
      [row, col + 1],
    ]) {
      if (r < 0 || r >= rows || c < 0 || c >= cols) continue
      const next = r * cols + c
      if (!seen.has(next)) {
        seen.set(next, d + 1)
        queue.push(next)
      }
    }
  }
  const a = cellOf(from, cols)
  const b = cellOf(to, cols)
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col)
}

export function cellAtPoint(x: number, y: number, rect: DOMRect, grid: GridSize) {
  const fx = (x - rect.left) / Math.max(1e-6, rect.width)
  const fy = (y - rect.top) / Math.max(1e-6, rect.height)
  const col = clamp(Math.floor(fx * grid.cols), 0, grid.cols - 1)
  return clamp(Math.floor(fy * grid.rows), 0, grid.rows - 1) * grid.cols + col
}

export function buildCoupling(ids: number[], length: number, grid: GridSize) {
  const out = new Map<number, Map<number, number>>()
  for (const a of ids) {
    const row = new Map<number, number>()
    for (const b of ids) if (a !== b) row.set(b, Math.exp(-graphDistance(a, b, grid) / length))
    out.set(a, row)
  }
  return out
}

interface StepInput {
  mouseClient: Point
  pointerVel: Point
  pointerInsidePanel: boolean
  trailClient: Point[]
  centersClient: Map<number, Point>
  graphDistById: Map<number, number>
  config: FieldConfig
}

/** Advances every body by `frames` (60fps frames) of simulated time. */
export function stepField(bodies: Record<number, Body>, ids: number[], input: StepInput, coupling: Map<number, Map<number, number>>, frames: number) {
  const { mouseClient, pointerVel, pointerInsidePanel, trailClient, centersClient, graphDistById, config: f } = input
  const h = Math.max(0.2, Math.min(1.05, frames))

  for (const id of ids) {
    const body = bodies[id]
    const center = centersClient.get(id)
    if (!body || !center) continue
    let fx = 0
    let fy = 0
    if (pointerInsidePanel) {
      const dx = center.x - mouseClient.x
      const dy = center.y - mouseClient.y
      const dist = Math.hypot(dx, dy)
      const dir = dist > 1e-5 ? { x: dx / dist, y: dy / dist } : { x: 0, y: 0 }
      const radial = f.strengthRadial * gaussian(dist, f.sigmaRadialPx)
      fx += dir.x * radial
      fy += dir.y * radial
      const trailStrength = f.strengthRadial * f.strengthTrailRatio
      for (const p of trailClient) {
        const tx = center.x - p.x
        const ty = center.y - p.y
        const td = Math.hypot(tx, ty)
        const tdir = td > 1e-5 ? { x: tx / td, y: ty / td } : { x: 0, y: 0 }
        const w = gaussian(td, f.sigmaTrailPx)
        fx += tdir.x * w * trailStrength
        fy += tdir.y * w * trailStrength
      }
      const speed = Math.hypot(pointerVel.x, pointerVel.y)
      if (speed > 1e-4) {
        const ux = pointerVel.x / speed
        const uy = pointerVel.y / speed
        const wake = gaussian(dist, f.sigmaRadialPx * 1.05) * f.wakeVsRadial * (speed / (speed + f.velSatPxPerFrame))
        fx -= ux * f.strengthRadial * wake
        fy -= uy * f.strengthRadial * wake
      }
    }
    const far = Math.min(graphDistById.get(id) ?? f.maxGraphDist, f.maxGraphDist) / Math.max(1e-6, f.maxGraphDist)
    const tau = f.tauNearFrames + far * (f.tauFarFrames - f.tauNearFrames)
    const blend = 1 - Math.exp(-h / Math.max(0.5, tau))
    body.tx += (fx - body.tx) * blend
    body.ty += (fy - body.ty) * blend
    const len = Math.hypot(body.tx, body.ty)
    if (len > f.maxOffsetPx && len > 1e-6) {
      const s = f.maxOffsetPx / len
      body.tx *= s
      body.ty *= s
    }
  }

  const ax: Record<number, number> = {}
  const ay: Record<number, number> = {}
  for (const id of ids) {
    const body = bodies[id]
    if (!body) continue
    const row = coupling.get(id)
    let cx = 0
    let cy = 0
    let total = 0
    if (row)
      for (const [other, w] of row) {
        if (w < 1e-8) continue
        const ob = bodies[other]
        if (!ob) continue
        cx += w * (ob.x - body.x)
        cy += w * (ob.y - body.y)
        total += w
      }
    if (total > 1e-6) {
      cx /= total
      cy /= total
    }
    ax[id] = f.kField * (body.tx - body.x) + f.couple * cx - f.kRest * body.x - f.damp * body.vx
    ay[id] = f.kField * (body.ty - body.y) + f.couple * cy - f.kRest * body.y - f.damp * body.vy
  }

  const friction = Math.exp(-0.14 * h)
  for (const id of ids) {
    const body = bodies[id]
    if (!body || ax[id] === undefined || ay[id] === undefined) continue
    body.vx += ax[id] * h
    body.vy += ay[id] * h
    body.vx *= friction
    body.vy *= friction
    body.x += body.vx * h
    body.y += body.vy * h
  }

  if (!pointerInsidePanel)
    for (const id of ids) {
      const body = bodies[id]
      if (!body) continue
      const relax = 1 - Math.exp(-h * 0.35)
      body.tx += (0 - body.tx) * relax
      body.ty += (0 - body.ty) * relax
    }
}
