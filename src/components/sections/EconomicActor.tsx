import { useRef, useState, type ReactNode } from 'react'
import { assetUrl } from '@/lib/assets'
import { economicActors, type EconomicActorItem } from '@/data/home'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { gsap, useGSAP } from '@/lib/gsap'

const ACCENT = '#54f089'
const NEUTRAL = '#e4e4e4'
const STACK_OFFSET_REM = 1.5
const exploreArrow = assetUrl('home/right-arrow', 'png')

function RoundSvg({ color = NEUTRAL }: { color?: string }) {
  return (
    <div className="block lg:h-[0.4rem] h-[0.18rem] lg:w-[0.4rem] w-[0.18rem] bg-transparent lg:scale-105">
      <svg className="h-full w-full" viewBox="0 0 1 1" preserveAspectRatio="none" aria-hidden="true">
        <path className="tile__sector" fill={`var(--economic-actor-card-bg, ${color})`} d="M 1 1 L 1 0 A 1 1 0 0 1 0 1 Z" />
      </svg>
    </div>
  )
}

/** Description tab cut into the media with inverted rounded corners (source: RoundCard). */
function RoundCard({ position, children, bgColor = NEUTRAL }: { position: 'left' | 'right'; children: ReactNode; bgColor?: string }) {
  const radius = position === 'left' ? 'lg:rounded-bl-[0.4rem] rounded-bl-[0.16rem] ' : 'lg:rounded-br-[0.4rem] rounded-br-[0.16rem]'
  const first = position === 'left' ? 'rotate-[270deg] top-0 lg:-left-[0.4rem] -left-[0.16rem]' : 'rotate-[180deg] top-0 lg:-right-[0.4rem] -right-[0.16rem]'
  const second =
    position === 'left' ? 'rotate-[270deg] lg:-bottom-[0.4rem] -bottom-[0.16rem] right-0' : 'rotate-[180deg] lg:-bottom-[0.4rem] -bottom-[0.16rem] left-0'
  return (
    <div
      className={`relative round_card_content lg:p-[0.4rem] p-[0.12rem] pt-0 ${radius}`}
      style={{ backgroundColor: `var(--economic-actor-card-bg, ${bgColor})` }}
    >
      <div className={`round_svg1 absolute ${first}`}>
        <RoundSvg color={bgColor} />
      </div>
      {children}
      <div className={`round_svg2 absolute ${second}`}>
        <RoundSvg color={bgColor} />
      </div>
    </div>
  )
}

const tagClass =
  'rounded-full border border-black lg:px-[0.35rem] px-[0.06rem] lg:py-[0.09rem] py-[0.03rem] lg:text-[0.24rem] text-[0.06rem] font-medium uppercase lg:leading-[0.24rem] leading-[0.06rem] tracking-wider text-black font-sans'

function EconomicActorStackItem({ item, stackIndex }: { item: EconomicActorItem; stackIndex: number }) {
  const [videoReady, setVideoReady] = useState(false)
  const [videoFailed, setVideoFailed] = useState(false)
  const surface = stackIndex === 0 ? 'economic-actor-feature-surface--accent' : 'economic-actor-feature-surface--neutral'

  return (
    <div
      className={`flex flex-col lg:rounded-[0.6rem] rounded-[0.2rem] antialiased economic-actor-stack__feature lg:pt-[0.68rem] pt-[.24rem] lg:pb-[1.12rem] pb-[.23rem] lg:px-[1.17rem] px-[.24rem] ${surface}`}
    >
      <div className="flex items-start justify-between gap-[0.3rem]">
        <span className={tagClass}>{item.tags[0]}</span>
        <span className={tagClass}>{item.tags[1]}</span>
      </div>
      <div className="flex flex-col">
        <h3 className="lg:text-[1.56rem] text-[.32rem] uppercase lg:leading-[2.6rem] leading-[0.4rem] lg:tracking-tight tracking-[-5%] text-black font-sans lg:mt-0 mt-[0.05rem] whitespace-nowrap">
          {item.title}
        </h3>
        <p className="lg:text-[0.4rem] text-[.13rem] uppercase leading-none tracking-wide text-black font-sans lg:mt-0 mt-[0.05rem]">{item.title2}</p>
      </div>
      <div className="lg:mt-[0.54rem] mt-[0.26rem] relative">
        <div className="relative isolate transform-gpu overflow-hidden lg:rounded-[0.4rem] rounded-[0.15rem]">
          <div className="pointer-events-none opacity-0 lg:h-[5.84rem] h-[2.8rem] w-full shrink-0" aria-hidden="true" />
          <img
            src={item.maskImg}
            alt=""
            decoding="async"
            className={`economic-actor-video-mask absolute inset-0 z-0 block w-full h-full object-cover lg:scale-120 scale-100 transition-opacity duration-300${videoReady && !videoFailed ? ' opacity-0' : ''}`}
          />
          <video
            className={`absolute inset-0 z-10 block h-full w-full object-cover lg:scale-120 scale-100 transition-opacity duration-300${!videoReady || videoFailed ? ' opacity-0 pointer-events-none' : ''}`}
            autoPlay
            muted
            playsInline
            loop
            onLoadedData={() => !videoFailed && setVideoReady(true)}
            onError={() => {
              setVideoFailed(true)
              setVideoReady(false)
            }}
          >
            <source src={item.bg1} type="video/mp4" />
          </video>
        </div>
        <div className={`absolute top-0 ${item.descPosition === 'left' ? 'right-0' : 'left-0'}`}>
          <RoundCard position={item.descPosition}>
            <div className="flex flex-col items-end lg:max-w-[5.6rem] max-w-[1.13rem]">
              <p className="opacity-[0.6] lg:text-[0.22rem] text-[0.08rem] font-sans lg:leading-relaxed leading-[0.1rem] text-black">{item.desc}</p>
              <a
                href="https://aeon-xyz.readme.io/docs/quick-start-1"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-[0.08rem] lg:mt-[0.18rem] mt-[0.1rem] font-medium cursor-pointer lg:pr-[0.3rem] pr-0 transition-all opacity-100 hover:backdrop-opacity-75"
              >
                <span className="lg:text-[0.14rem] text-[0.08rem] font-sans text-black/60"> Explore More</span>
                <img className="w-auto lg:h-[0.20rem] h-[0.06rem]" src={exploreArrow} alt="" />
              </a>
            </div>
          </RoundCard>
        </div>
      </div>
    </div>
  )
}

/** Product cards that slide up over each other in a pinned stack (source: EconomicActor). */
export function EconomicActor({ onStackComplete }: { onStackComplete: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const stackRef = useRef<HTMLDivElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)

  useScrollReveal(rootRef)

  useGSAP(
    () => {
      if (window.innerWidth < 1024) return
      const wrapper = wrapperRef.current!
      const pin = pinRef.current!
      const cards = gsap.utils.toArray<HTMLElement>(stackRef.current!.querySelectorAll('.economic-actor-stack__card'))
      if (cards.length < 2) {
        onStackComplete()
        return
      }

      cards.forEach((card, m) => {
        const top = `${m * STACK_OFFSET_REM}rem`
        gsap.set(card, { zIndex: m === 0 ? 1 : m + 1, top, left: 0, right: 0, yPercent: m === 0 ? 0 : 100 })
        const feature = card.querySelector('.economic-actor-stack__feature')
        const color = m === 0 ? ACCENT : NEUTRAL
        if (feature) gsap.set(feature, { '--economic-actor-card-bg': color, backgroundColor: color })
      })

      let completed = false
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapper,
          start: 'top top',
          end: () => `+=${(cards.length - 1) * window.innerHeight}`,
          pin,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onLeave: () => {
            if (completed) return
            completed = true
            onStackComplete()
          },
        },
      })

      for (let m = 1; m < cards.length; m++) {
        const at = m - 1
        const incoming = cards[m].querySelector('.economic-actor-stack__feature')
        const outgoing = cards[m - 1].querySelector('.economic-actor-stack__feature')
        tl.to(cards[m], { yPercent: 0, duration: 1, ease: 'none' }, at)
        if (outgoing)
          tl.fromTo(
            outgoing,
            { backgroundColor: ACCENT, '--economic-actor-card-bg': ACCENT },
            { backgroundColor: NEUTRAL, '--economic-actor-card-bg': NEUTRAL, duration: 1, ease: 'none', immediateRender: false },
            at,
          )
        if (incoming)
          tl.fromTo(
            incoming,
            { backgroundColor: NEUTRAL, '--economic-actor-card-bg': NEUTRAL },
            { backgroundColor: ACCENT, '--economic-actor-card-bg': ACCENT, duration: 1, ease: 'none', immediateRender: false },
            at,
          )
      }
    },
    { scope: rootRef },
  )

  return (
    <div ref={rootRef} className="">
      <div className="flex flex-col items-center justify-center">
        <h2
          className="scroll-reveal scroll-reveal--before lg:max-w-[11.2rem] max-w-[3.38rem] text-center lg:text-[0.64rem] text-[.24rem] leading-none text-black"
          data-reveal-delay="0.1s"
        >
          {' '}
          Built on the Native AI Settlement Layer{' '}
        </h2>
        <div
          className="scroll-reveal scroll-reveal--before lg:mb-[0.94rem] mb-[.24rem] lg:mt-[0.43rem] mt-[.17rem] lg:max-w-[11.2rem] max-w-[2.51rem] text-center"
          data-reveal-delay="0.25s"
        >
          <p className="lg:text-[0.2rem] text-[.12rem] leading-none lg:leading-[.25rem] text-black/50">
            {' '}
            Turn your AI’s logic into immediate economic action. AEON provides the foundational settlement layer for
            <br className="hidden lg:inline" /> the AI economy delivered through Agent Account. This gives your AI programmable, real-time access to
            <br className="hidden lg:inline" /> payment rails, all routed and settled in real time.{' '}
          </p>
        </div>
      </div>
      <div ref={wrapperRef} className="economic-actor-scroll-wrapper">
        <div ref={stackRef} className="economic-actor-stack">
          <div
            ref={pinRef}
            className="economic-actor-stack__pin"
            style={{ '--stack-extra': `${economicActors.length * STACK_OFFSET_REM}rem` } as React.CSSProperties}
          >
            {economicActors.map((item, g) => (
              <div key={g} className="economic-actor-stack__card lg:w-full w-[calc(100% - 0.81rem)] mr-[0.39rem] ml-[0.42rem] lg:mr-0 lg:ml-0">
                <EconomicActorStackItem item={item} stackIndex={g} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
