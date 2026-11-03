import { useRef } from 'react'
import { MobileHeader } from '@/components/header/MobileHeader'
import { PageNavHeader } from '@/components/header/PageNavHeader'
import { AssetImage } from '@/components/ui/AssetImage'
import { heroRows } from '@/data/home'
import { useIsMobile } from '@/hooks/useIsMobile'
import { gsap, ScrollTrigger, SplitText, useGSAP } from '@/lib/gsap'
import { createHorizontalScroll } from '@/lib/horizontalScroll'

const ITEM_WIDTH_REM = 8.26
const INTRO_DURATION = 2
const INTRO_STAGGER = 0.2
const AUTO_SCROLL_DURATION = 1.25

/** Splits each element and adds a `from` tween per element to the timeline (source: ng). */
function addSplitFrom(tl: gsap.core.Timeline, elements: NodeListOf<Element>, type: string, unit: 'words' | 'chars', vars: gsap.TweenVars) {
  for (const el of elements) {
    const split = new SplitText(el, { aria: 'auto', type })
    tl.from(unit === 'words' ? split.words : split.chars, vars)
  }
}

/** Once the reveal is armed, glide the page to its start so it plays without user input (source: lP). */
function autoScrollTo(trigger: ScrollTrigger, duration: number) {
  requestAnimationFrame(() => {
    ScrollTrigger.refresh()
    requestAnimationFrame(() => {
      ScrollTrigger.refresh()
      const max = ScrollTrigger.maxScroll(window)
      const target = Math.min(max, trigger.start + 1)
      const current = trigger.scroll()
      if (current >= target - 0.5) return
      const proxy = { y: current }
      gsap.to(proxy, { y: target, duration, ease: 'power2.inOut', onUpdate: () => trigger.scroll(proxy.y) })
    })
  })
}

export function HomeFirstScreen({ onIntroComplete }: { onIntroComplete: () => void }) {
  const isMobile = useIsMobile()
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useGSAP(
    (_, contextSafe) => {
      const container = containerRef.current!
      const rows = gsap.utils.toArray<HTMLElement>(container.querySelectorAll('.row'))
      const count = rows.length
      const restX = (i: number) => `${(-ITEM_WIDTH_REM * (count - i)) / count}rem`

      const afterIntro = contextSafe!(() => {
        const track = trackRef.current
        if (!track) return onIntroComplete()
        createHorizontalScroll(container, track)
        const distance = track.scrollWidth - container.offsetWidth
        ScrollTrigger.refresh()

        const scrollTarget = container.querySelector('.scroll-trigger')
        const bar = container.querySelector('.text-bg-bar')
        const highlight = container.querySelector('.new-ai-economy')
        if (!scrollTarget || !bar || !highlight) return onIntroComplete()

        const tl = gsap.timeline({
          scrollTrigger: { trigger: scrollTarget, start: distance, once: true },
          onComplete: () => {
            onIntroComplete()
            requestAnimationFrame(() => ScrollTrigger.refresh())
          },
        })
        addSplitFrom(tl, container.querySelectorAll('.split-text-words'), 'words', 'words', {
          y: -100,
          opacity: 0,
          rotation: 'random(-80, 80)',
          duration: 0.7,
          ease: 'back',
          stagger: 0.15,
        })
        tl.from(bar, { xPercent: 30, opacity: 0, ease: 'power3.out' })
        tl.from(highlight, { yPercent: -200, opacity: 0, duration: 0.85, ease: 'bounce.out' }, '>')
        addSplitFrom(tl, container.querySelectorAll('.split-text-chars'), 'words,chars', 'chars', {
          x: 150,
          opacity: 0,
          duration: 0.7,
          ease: 'power4',
          stagger: 0.01,
        })
        ScrollTrigger.refresh()
        if (tl.scrollTrigger) autoScrollTo(tl.scrollTrigger, AUTO_SCROLL_DURATION)
      })

      gsap.set(rows, { x: '50vw', opacity: 0.3 })
      gsap.to(rows, {
        x: (i) => restX(i),
        duration: INTRO_DURATION,
        opacity: 1,
        ease: 'back.out',
        stagger: INTRO_STAGGER,
        onComplete: afterIntro,
      })
    },
    { scope: containerRef },
  )

  return (
    <div ref={containerRef} className="h-screen bg-linear-to-b from-[#58f287] to-[#58f28700] overflow-hidden relative">
      <div className="lg:hidden block">
        <MobileHeader />
      </div>
      <div className="lg:block hidden">{isMobile ? null : <PageNavHeader />}</div>
      <div ref={trackRef} className="flex w-fit h-full shrink-0">
        <div className="content h-full flex flex-col justify-center shrink-0 overflow-hidden relative lg:mt-[0.55rem] -mt-[0.85rem]">
          {heroRows.map((row, h) => (
            <div key={h} className="row flex w-fit">
              {row.map((variant, g) => (
                <div key={g} className="item flex justify-center items-center">
                  <AssetImage
                    className="lg:w-[8.26rem] lg:h-[2.21rem] shrink-0 w-[3.78rem] h-[1.01rem]"
                    path={`home/aeon${variant}`}
                    alt=""
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="lg:w-[12.46rem] w-[1.44rem] h-full shrink-0 relative">
          <div className="w-screen h-full absolute right-0 top-0 flex items-center justify-center lg:mt-0 -mt-[0.85rem] lg:overflow-hidden overflow-hidden">
            <div className="lg:w-[11.2rem] w-full px-[0.3rem] scroll-trigger">
              <div className="lg:text-[.64rem] text-[.24rem] font-normal leading-none lg:mb-[.25rem] mb-[.26rem] relative">
                <div className="text-black leading-none relative z-2 split-text-words"> The Settlement Layer </div>
                <div className="flex items-center text-white leading-none relative z-2">
                  <span className="text-black split-text-words"> Built For the </span>
                  <span className="lg:pl-[.24rem] pl-[.12rem] new-ai-economy"> AI Economy</span>
                </div>
                <div className="text-bg-bar absolute lg:bottom-[-0.08rem] bottom-[-0.04rem] lg:left-[3.32rem] left-[1.28rem] lg:h-[.72rem] h-[.28rem] w-screen bg-black rounded-full" />
              </div>
              <div className="text-sans opacity-[.6] lg:text-[.3rem] text-[.16rem] font-normal text-black split-text-chars">
                {' '}
                AEON is the settlement layer bridging autonomous AI agents with real-world economy. We equip every agent with a
                programmable, multi-currency agent account which seamlessly routing across stablecoins, global Visa rails, and
                emerging-market networks, to enable frictionless, autonomous value flows.{' '}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
