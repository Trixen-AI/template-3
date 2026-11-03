import { useRef } from 'react'
import { useGSAP } from '@/lib/gsap'
import { createHorizontalScroll } from '@/lib/horizontalScroll'
import { BestPartners } from './BestPartners'
import { ContactUS, MobileContactUS } from './ContactUS'
import { MobileNews, News } from './News'

/** Desktop: Partners, News and Contact sit side by side and pan left while the section is pinned. */
export function HorizontalScrollArea() {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      createHorizontalScroll(containerRef.current!, trackRef.current!, { start: 'top top', scrub: 1, pin: true, invalidateOnRefresh: true })
    },
    { scope: containerRef },
  )

  return (
    <>
      <div className="relative lg:block hidden">
        <div ref={containerRef} className="relative w-full overflow-hidden">
          <div ref={trackRef} className="flex w-[130vw] shrink-0 flex-nowrap">
            <div className="min-w-0 shrink-0 flex-[0_0_100vw] box-border lg:px-[2.4rem] px-0">
              <BestPartners />
            </div>
            <div className="min-w-0 shrink-0 flex-[0_0_80vw] box-border px-0">
              <News />
            </div>
            <div className="flex h-full min-h-0 min-w-0 shrink-0 flex-[0_0_30vw] flex-col box-border">
              <ContactUS />
            </div>
          </div>
        </div>
      </div>
      <div className="relative lg:hidden block">
        <div className="min-w-0 shrink-0 flex-[100_0_0%] box-border lg:px-[2.4rem] px-0">
          <BestPartners />
        </div>
        <div>
          <MobileNews />
        </div>
        <div>
          <MobileContactUS />
        </div>
      </div>
    </>
  )
}
