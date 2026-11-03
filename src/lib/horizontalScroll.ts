import { gsap } from './gsap'

export interface HorizontalScrollOptions {
  start?: string
  end?: string | ((distance: number) => string)
  scrub?: number | boolean
  pin?: boolean
  invalidateOnRefresh?: boolean
  skipIfNoOverflow?: boolean
}

/** Pins `container` and translates `track` left by its overflow while the page scrolls (source: b_). */
export function createHorizontalScroll(container: HTMLElement, track: HTMLElement, options: HorizontalScrollOptions = {}) {
  const { start = 'top top', end, scrub = 1, pin = true, invalidateOnRefresh = true, skipIfNoOverflow = true } = options
  const distance = track.scrollWidth - container.offsetWidth
  if (skipIfNoOverflow && distance <= 0) return null
  const endValue = typeof end === 'function' ? end(distance) : (end ?? `+=${distance}`)
  return gsap.to(track, {
    x: -distance,
    ease: 'none',
    scrollTrigger: { trigger: container, start, end: endValue, scrub, pin, invalidateOnRefresh },
  })
}
