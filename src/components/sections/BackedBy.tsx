import { MarqueeScroll } from '@/components/ui/MarqueeScroll'
import { backedBy } from '@/data/home'
import { useIsMobile } from '@/hooks/useIsMobile'

export function BackedBy() {
  const isMobile = useIsMobile()
  return (
    <section className="backed-by w-full overflow-hidden lg:py-[0.8rem] py-[0.48rem]">
      <h2 className="text-center text-black font-medium lg:text-[0.64rem] text-[0.24rem] leading-none lg:mb-[0.64rem] mb-[0.32rem]">
        {' '}
        Backed By{' '}
      </h2>
      <MarqueeScroll direction="left" speed={40} gap={isMobile ? '0.24rem' : '0.64rem'} fadeWidth={0} pauseOnHover>
        {backedBy.map((logo) => (
          <img key={logo.alt} src={logo.src} alt={logo.alt} className="shrink-0 h-[0.24rem] lg:h-[0.4rem] w-auto object-contain" />
        ))}
      </MarqueeScroll>
    </section>
  )
}
