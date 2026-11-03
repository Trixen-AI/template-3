import { useMemo } from 'react'
import { assetUrl } from '@/lib/assets'
import { MarqueeScroll } from '@/components/ui/MarqueeScroll'
import { LIVE_SITE } from '@/data/site'
import { useIsMobile } from '@/hooks/useIsMobile'
import { useNewsList } from '@/hooks/useNewsList'
import type { NewsItem } from '@/lib/sanity'

const circleArrow = assetUrl('home/circle_icon')
const viewMoreArrow = assetUrl('home/right_arrow')

const CARD_WIDTH_REM = 3.2
const CARD_GAP_REM = 0.36

export function NewCard({ item }: { item: NewsItem }) {
  return (
    <article
      className="news-card lg:p-[0.16rem] p-[0.16rem] lg:rounded-[0.24rem] rounded-[0.24rem]"
      onClick={() => window.location.assign(`${LIVE_SITE}/news/${item.id}`)}
    >
      <header className="relative flex items-start justify-between gap-[0.2rem]">
        <div className="min-w-0 flex-1 pr-[0.1rem]">
          <p className="line-clamp-3 text-left lg:text-[0.16rem] text-[0.16rem] font-semibold leading-snug text-black">{item.title}</p>
        </div>
        <img className="h-[0.32rem] w-[0.32rem]" src={circleArrow} alt="" />
      </header>
      <div className="news-card__media mt-[0.12rem] aspect-video w-full overflow-hidden lg:rounded-[0.12rem] rounded-[0.12rem]">
        <img className="h-full w-full object-cover" src={item.image} alt="" />
      </div>
    </article>
  )
}

export function ViewMore({ className }: { className: string }) {
  return (
    <a href={`${LIVE_SITE}/news`} className={className}>
      <span>View More</span>
      <img src={viewMoreArrow} alt="" />
    </a>
  )
}

function Skeleton() {
  return (
    <div className="flex w-full flex-col gap-y-[0.36rem]">
      {[0, 1].map((row) => (
        <div key={row} className="flex gap-x-[0.32rem] overflow-hidden">
          {[0, 1, 2, 3, 4].map((card) => (
            <div
              key={card}
              className="news-card-skeleton shrink-0 animate-pulse rounded-[0.24rem] bg-white p-[0.16rem] shadow-[0_0.06rem_0.24rem_rgba(0,0,0,0.06)]"
              style={{ width: '3.2rem' }}
            >
              <div className="flex items-start justify-between gap-[0.2rem]">
                <div className="flex flex-1 flex-col gap-y-[0.08rem] pr-[0.1rem]">
                  <div className="h-[0.14rem] w-full rounded bg-gray-200" />
                  <div className="h-[0.14rem] w-4/5 rounded bg-gray-200" />
                  <div className="h-[0.14rem] w-3/5 rounded bg-gray-200" />
                </div>
                <div className="h-[0.32rem] w-[0.32rem] shrink-0 rounded-full bg-gray-200" />
              </div>
              <div className="mt-[0.12rem] aspect-video w-full rounded-[0.12rem] bg-gray-200" />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

/** Splits posts into two rows and repeats each so a row spans ~2.5 viewports (source: News). */
function useNewsRows(list: NewsItem[]) {
  return useMemo(() => {
    const rootFont = Number.parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
    const even = list.filter((_, i) => i % 2 === 0)
    const odd = list.filter((_, i) => i % 2 === 1)
    const rowWidth = even.length * CARD_WIDTH_REM * rootFont + Math.max(0, even.length - 1) * CARD_GAP_REM * rootFont
    const repeat = rowWidth <= 0 ? 12 : Math.min(64, Math.max(8, Math.ceil((window.innerWidth * 2.5) / rowWidth)))
    const fill = (items: NewsItem[]) => Array.from({ length: repeat }, () => items).flat()
    return [fill(even), fill(odd)] as const
  }, [list])
}

export function News() {
  const isMobile = useIsMobile()
  const { newsList, loading } = useNewsList()
  const [top, bottom] = useNewsRows(newsList)

  return (
    <div className="news_container overflow-hidden lg:mt-[1.01rem] mt-[0.53rem]">
      <div className="text-sans lg:mb-[0.25rem] mb-[0.41rem] text-center lg:text-[0.64rem] text-[0.24rem] text-black"> AEON Latest News </div>
      {loading || newsList.length === 0 ? (
        <Skeleton />
      ) : (
        <div className="news_area flex w-full flex-col gap-y-[0.28rem] justify-center items-center">
          <MarqueeScroll direction="left" speed={60} pauseOnHover gap={isMobile ? 16 : 32} safeTop={16} safeBottom={16}>
            {top.map((item, i) => (
              <NewCard key={`top-${item.id}-${i}`} item={item} />
            ))}
          </MarqueeScroll>
          <MarqueeScroll direction="left" speed={80} pauseOnHover gap={isMobile ? 16 : 32} safeTop={16} safeBottom={16}>
            {bottom.map((item, i) => (
              <NewCard key={`top-${item.id}-${i}`} item={item} />
            ))}
          </MarqueeScroll>
          <ViewMore className="group flex items-center gap-[0.08rem] text-[0.14rem] font-medium text-black transition-opacity duration-200 hover:opacity-60 lg:text-[0.16rem]" />
        </div>
      )}
    </div>
  )
}

export function MobileNews() {
  const { newsList } = useNewsList()
  return (
    <div className="mt-[0.53rem] max-w-[calc(100% - 0.68rem)] flex flex-col justify-center items-center">
      <div className="text-sans lg:mb-[0.66rem] mb-[0.41rem] text-center lg:text-[0.64rem] text-[0.24rem] text-black"> AEON Latest News </div>
      {newsList.map((item) => (
        <div className="mb-[0.24rem]" key={item.id}>
          <NewCard item={item} />
        </div>
      ))}
      <ViewMore className="group flex items-center gap-[0.08rem] text-[0.14rem] font-medium text-black transition-opacity duration-200 hover:opacity-60 lg:text-[0.16rem] mt-[0.36rem] relative z-10" />
    </div>
  )
}
