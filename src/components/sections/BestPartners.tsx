import { useEffect, useMemo, useRef } from 'react'
import { assetUrl } from '@/lib/assets'
import { useIsMobile } from '@/hooks/useIsMobile'
import {
  buildCoupling,
  cellAtPoint,
  createBody,
  createFieldConfig,
  graphDistance,
  stepField,
  type Body,
  type Point,
} from '@/lib/capsuleField'

const TRAIL_MAX = 12
const TRAIL_MIN_STEP = 5
const VELOCITY_DECAY = 0.88
const VELOCITY_SMOOTHING = 0.34

interface Capsule {
  name: string
  rotate: number
  zIndex: number
  offsetX: number
  offsetY: number
  scale: number
}

const logo = (name: string) => assetUrl(`home/logoIcon/${name}`)
const capsule = (name: string, rotate = 0, zIndex = 5, offsetX = 0, offsetY = 0, scale = 1): Capsule => ({
  name: logo(name),
  rotate,
  zIndex,
  offsetX,
  offsetY,
  scale,
})

/** 7 x 4 desktop layout; empty cells are null (source: BestPartners `o`). */
const desktopCells: (Capsule | null)[] = [
  null,
  null,
  null,
  null,
  capsule('binance', 8, 8),
  capsule('bybit', 6, 9),
  capsule('ripple', 4, 10),
  capsule('bittensor', 6, 4),
  null,
  null,
  null,
  capsule('okx', 6, 9),
  capsule('bitget-wallet', 3, 10, -0.06, 0),
  null,
  capsule('sonic', -4, 5),
  capsule('falcon', 2, 6),
  capsule('bitcoin-cash', -2, 11),
  capsule('tether', -5, 8),
  capsule('ton', -4, 8),
  capsule('bitget', -6, 9),
  capsule('stellar', 4, 10),
  capsule('wlfi', 4, 5),
  capsule('sahara-ai', -3, 6),
  capsule('bnb-chain', 7, 7),
  capsule('solana', 5, 7),
  capsule('polygon', 5, 11),
  capsule('okx-wallet', 2, 12),
  capsule('ondo', -4, 13),
]

const mobileRotations = [10, 20, -20, 20, -5, -8, 10, 5, 5, 15]
/** 3 x 7 mobile layout (source: BestPartners `c`). */
const mobileCells: (Capsule | null)[] = [
  ...[
    'bittensor',
    'sonic',
    'falcon',
    'wlfi',
    'sahara-ai',
    'bnb-chain',
    'tether',
    'solana',
    'binance',
    'okx',
    'ton',
    'polygon',
    'bybit',
    'bitget-wallet',
    'bitget',
    'okx-wallet',
    'ripple',
    'bitcoin-cash',
    'stellar',
    'ondo',
  ].map((name, i) => capsule(name, mobileRotations[i % mobileRotations.length], 3 + i)),
  null,
]

function capsuleTransform(c: Capsule, mx: number, my: number) {
  const parts: string[] = []
  if (c.offsetX !== 0 || c.offsetY !== 0) parts.push(`translate(${c.offsetX}rem, ${c.offsetY}rem)`)
  if (mx !== 0 || my !== 0) parts.push(`translate(${mx}px, ${my}px)`)
  if (c.rotate !== 0) parts.push(`rotate(${c.rotate}deg)`)
  if (c.scale !== 1) parts.push(`scale(${c.scale})`)
  return parts.length ? parts.join(' ') : 'none'
}

function CapsuleBlock({ item, innerRef }: { item: Capsule; innerRef: (el: HTMLDivElement | null) => void }) {
  return (
    <div
      ref={innerRef}
      className="capsule box-border bg-white lg:px-[0.28rem] px-[0.1rem] lg:py-[0.14rem] py-[0.05rem] lg:rounded-[0.28rem] rounded-[1.12rem] cursor-default"
      style={{ transform: capsuleTransform(item, 0, 0), zIndex: item.zIndex, position: 'relative' }}
    >
      <img className="w-auto lg:h-[0.24rem] h-[0.1rem] block" src={item.name} alt="" />
    </div>
  )
}

export function BestPartners() {
  const isMobile = useIsMobile()
  const grid = useMemo(() => (isMobile ? { cols: 3, rows: 7 } : { cols: 7, rows: 4 }), [isMobile])
  const cells = isMobile ? mobileCells : desktopCells
  const panelRef = useRef<HTMLDivElement>(null)
  const cellRefs = useRef<Record<number, HTMLDivElement | null>>({})
  const capsuleRefs = useRef<Record<number, HTMLDivElement | null>>({})

  useEffect(() => {
    const ids = cells.flatMap((c, i) => (c ? [i] : []))
    const config = createFieldConfig(grid)
    const coupling = buildCoupling(ids, config.coupleLength, grid)
    const bodies: Record<number, Body> = Object.fromEntries(ids.map((id) => [id, createBody()]))
    let inside = false
    let mouse: Point = { x: 0, y: 0 }
    let velocity: Point = { x: 0, y: 0 }
    let trail: Point[] = []
    let lastMove = 0
    let lastFrame = performance.now()
    let frame = 0

    const within = (x: number, y: number, r: DOMRect) => x >= r.left && x <= r.right && y >= r.top && y <= r.bottom

    const onMove = (e: PointerEvent) => {
      if (isMobile) return
      const panel = panelRef.current
      if (!panel) return
      const now = performance.now()
      inside = within(e.clientX, e.clientY, panel.getBoundingClientRect())
      if (lastMove > 0) {
        const dt = Math.max(0.001, now - lastMove)
        const vx = ((e.clientX - mouse.x) / dt) * (1000 / 60)
        const vy = ((e.clientY - mouse.y) / dt) * (1000 / 60)
        velocity = { x: velocity.x * (1 - VELOCITY_SMOOTHING) + vx * VELOCITY_SMOOTHING, y: velocity.y * (1 - VELOCITY_SMOOTHING) + vy * VELOCITY_SMOOTHING }
      }
      lastMove = now
      mouse = { x: e.clientX, y: e.clientY }
      if (inside) {
        const last = trail[trail.length - 1]
        const dx = last ? mouse.x - last.x : Infinity
        const dy = last ? mouse.y - last.y : Infinity
        if (!last || dx * dx + dy * dy >= TRAIL_MIN_STEP * TRAIL_MIN_STEP) {
          trail.push({ ...mouse })
          if (trail.length > TRAIL_MAX) trail = trail.slice(trail.length - TRAIL_MAX)
        }
      }
    }
    const onLeave = () => {
      if (isMobile) return
      inside = false
      velocity = { x: 0, y: 0 }
      trail = []
      lastMove = 0
    }

    const tick = () => {
      const now = performance.now()
      const frames = Math.min(32, now - lastFrame) / (1000 / 60)
      lastFrame = now
      if (now - lastMove > 48) {
        velocity.x *= VELOCITY_DECAY
        velocity.y *= VELOCITY_DECAY
        if (Math.abs(velocity.x) < 0.02) velocity.x = 0
        if (Math.abs(velocity.y) < 0.02) velocity.y = 0
      }
      const panel = panelRef.current
      let pointerInside = inside
      if (panel) pointerInside = within(mouse.x, mouse.y, panel.getBoundingClientRect())

      const centers = new Map<number, Point>()
      for (const id of ids) {
        const el = cellRefs.current[id]
        if (!el) continue
        const r = el.getBoundingClientRect()
        centers.set(id, { x: r.left + r.width * 0.5, y: r.top + r.height * 0.5 })
      }
      let distances: Map<number, number>
      if (panel && pointerInside) {
        const cell = cellAtPoint(mouse.x, mouse.y, panel.getBoundingClientRect(), grid)
        distances = new Map(ids.map((id) => [id, graphDistance(cell, id, grid)]))
      } else distances = new Map(ids.map((id) => [id, 0]))

      stepField(
        bodies,
        ids,
        { mouseClient: mouse, pointerVel: { ...velocity }, pointerInsidePanel: pointerInside, trailClient: trail, centersClient: centers, graphDistById: distances, config },
        coupling,
        frames,
      )

      for (const id of ids) {
        const el = capsuleRefs.current[id]
        const item = cells[id]
        if (el && item) el.style.transform = capsuleTransform(item, bodies[id].x, bodies[id].y)
      }
      frame = requestAnimationFrame(tick)
    }

    const panel = panelRef.current
    panel?.addEventListener('pointermove', onMove)
    panel?.addEventListener('pointerleave', onLeave)
    frame = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(frame)
      panel?.removeEventListener('pointermove', onMove)
      panel?.removeEventListener('pointerleave', onLeave)
    }
  }, [cells, grid, isMobile])

  return (
    <div className="lg:mt-[1.01rem] mt-0">
      <div className="lg:text-[0.64rem] text-[.24rem] lg:mb-[1.3rem] mb-[.32rem] text-center"> Joining Forces with the Best Partners </div>
      <div
        className="relative lg:w-full w-[calc(100% - 0.81rem)] lg:mx-0 mx-[0.4rem] flex flex-col lg:height-[6.5rem] bg-[#58F287] lg:rounded-[0.6rem] rounded-[0.2rem] lg:pl-[0.7rem] lg:pt-[0.53rem] lg:pr-[0.16rem] pb-[0.1rem] pt-[.21rem] pr-[.22rem] pl-[0.rem]"
        style={{ perspective: '650px', transformStyle: 'preserve-3d' }}
      >
        <div className="text-white font-sans lg:text-[0.2rem] text-[.12rem] lg:leading-1 leading-[0.15rem] max-w-[6.53rem] lg:mb-[0.48rem] mb-[0.6rem] lg:pl-0 pl-[0.29rem]">
          {' '}
          From leading AI teams, blockchains, exchanges &amp; wallets, to global payment networks, AEON works with ecosystem partners to build the
          financial infrastructure for the AI economy.{' '}
        </div>
        <div
          ref={panelRef}
          className="lg:w-full w-full grid overflow-visible lg:ml-0 ml-0 lg:mb-[0.4rem] mb-[0.12rem] lg:pr-[0.24rem] pr-0 lg:pl-0 pl-[0.1rem] lg:gap-x-[0.16rem] lg:gap-y-[0.1rem] gap-[0.06rem]"
          style={{
            gridTemplateColumns: `repeat(${grid.cols}, auto)`,
            gridTemplateRows: `repeat(${grid.rows}, auto)`,
            justifyContent: isMobile ? undefined : 'start',
          }}
        >
          {cells.map((item, i) => (
            <div
              key={i}
              className="relative min-h-0 min-w-0"
              ref={(el) => {
                cellRefs.current[i] = el
              }}
            >
              {item ? (
                <div className="relative w-fit h-fit">
                  <CapsuleBlock
                    item={item}
                    innerRef={(el) => {
                      capsuleRefs.current[i] = el
                    }}
                  />
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
