import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { gsap } from '@/lib/gsap'

interface MarqueeScrollProps {
  children: ReactNode
  direction?: 'left' | 'right'
  /** px per second */
  speed?: number
  pauseOnHover?: boolean
  gap?: number | string
  fadeWidth?: number
  safeTop?: number
  safeBottom?: number
}

/** Endless GSAP marquee that clones its content until the row is covered (source: MarqueeScroll). */
export function MarqueeScroll({
  children,
  direction = 'left',
  speed = 60,
  pauseOnHover = true,
  gap = 16,
  fadeWidth = 80,
  safeTop = 0,
  safeBottom = 0,
}: MarqueeScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const firstCopyRef = useRef<HTMLDivElement>(null)
  const tweenRef = useRef<gsap.core.Tween | null>(null)
  const [copies, setCopies] = useState(2)

  useEffect(() => {
    const container = containerRef.current
    const track = trackRef.current
    const firstCopy = firstCopyRef.current
    if (!container || !track || !firstCopy) return
    let alive = true
    let frame = 0
    let lastCopy = 0
    let lastContainer = 0

    const build = (keepProgress: boolean) => {
      const copyWidth = firstCopy.offsetWidth
      if (copyWidth <= 0) return
      const prev = tweenRef.current
      const progress = keepProgress && prev ? prev.progress() : 0
      const paused = !!prev?.paused()
      prev?.kill()
      lastCopy = copyWidth
      lastContainer = container.offsetWidth
      const left = direction === 'left'
      const tween = gsap.fromTo(
        track,
        { x: left ? 0 : -copyWidth },
        { x: left ? -copyWidth : 0, duration: copyWidth / speed, ease: 'none', repeat: -1 },
      )
      if (keepProgress && progress > 0) tween.progress(progress)
      if (paused) tween.pause()
      tweenRef.current = tween
    }

    const fillCopies = () => {
      const copyWidth = firstCopy.offsetWidth
      const containerWidth = container.offsetWidth
      if (copyWidth > 0 && containerWidth > 0) setCopies(Math.max(2, Math.ceil(containerWidth / copyWidth) + 2))
    }

    const schedule = (force = false) => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const copyWidth = firstCopy.offsetWidth
        const containerWidth = container.offsetWidth
        if (copyWidth <= 0 || containerWidth <= 0) return
        if (!force && Math.abs(copyWidth - lastCopy) < 1 && Math.abs(containerWidth - lastContainer) < 1 && tweenRef.current) return
        fillCopies()
        frame = requestAnimationFrame(() => build(true))
      })
    }

    const images = Array.from(firstCopy.querySelectorAll('img'))
    Promise.all(images.map((img) => img.decode().catch(() => {}))).then(() => {
      if (!alive) return
      fillCopies()
      requestAnimationFrame(() => alive && build(false))
    })

    const observer = new ResizeObserver(() => schedule())
    observer.observe(container)
    observer.observe(firstCopy)

    return () => {
      alive = false
      cancelAnimationFrame(frame)
      observer.disconnect()
      tweenRef.current?.kill()
      tweenRef.current = null
    }
  }, [direction, speed, gap])

  const mask = fadeWidth
    ? `linear-gradient(to right, transparent 0px, black ${fadeWidth}px, black calc(100% - ${fadeWidth}px), transparent 100%)`
    : undefined
  const rootStyle: CSSProperties = {
    maskImage: mask,
    WebkitMaskImage: mask,
    paddingTop: safeTop ? `${safeTop}px` : undefined,
    paddingBottom: safeBottom ? `${safeBottom}px` : undefined,
  }
  const gapValue = typeof gap === 'number' ? `${gap}px` : gap
  const copyStyle: CSSProperties = { gap: gapValue, paddingRight: gapValue }

  return (
    <div
      ref={containerRef}
      className="marquee-root overflow-hidden w-full"
      style={rootStyle}
      onMouseEnter={pauseOnHover ? () => tweenRef.current?.pause() : undefined}
      onMouseLeave={pauseOnHover ? () => tweenRef.current?.resume() : undefined}
    >
      <div ref={trackRef} className="flex" style={{ willChange: 'transform' }}>
        {Array.from({ length: copies }, (_, i) => (
          <div
            key={i}
            ref={i === 0 ? firstCopyRef : undefined}
            className="flex shrink-0"
            style={copyStyle}
            aria-hidden={i > 0 ? 'true' : undefined}
          >
            {children}
          </div>
        ))}
      </div>
    </div>
  )
}
