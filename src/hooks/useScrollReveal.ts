import type { RefObject } from 'react'
import { ScrollTrigger, useGSAP } from '@/lib/gsap'

const REVEAL = {
  selector: '.scroll-reveal',
  start: 'top 88%',
  duration: '0.75s',
  animationClass: 'animate__fadeInUp',
  beforeClass: 'scroll-reveal--before',
}

/** Adds animate.css fadeInUp to every `.scroll-reveal` inside `root` the first time it enters (source: LD). */
export function useScrollReveal(root: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      root.current?.querySelectorAll<HTMLElement>(REVEAL.selector).forEach((el) => {
        const delay = el.dataset.revealDelay ?? '0s'
        ScrollTrigger.create({
          trigger: el,
          start: REVEAL.start,
          once: true,
          onEnter: () => {
            el.style.setProperty('--animate-duration', REVEAL.duration)
            el.style.setProperty('--animate-delay', delay)
            el.style.animationDelay = delay
            el.classList.remove(REVEAL.beforeClass)
            el.classList.add('animate__animated', REVEAL.animationClass)
          },
        })
      })
    },
    { scope: root },
  )
}
