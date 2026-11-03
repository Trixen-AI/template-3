import { assetUrl } from '@/lib/assets'
import { MarqueeScroll } from '@/components/ui/MarqueeScroll'
import { paymentFlow, type Statistic } from '@/data/home'
import { useStatistics } from '@/hooks/useStatistics'

const aeonOutline = { white: assetUrl('home/aeon_bg_white'), green: assetUrl('home/aeon_bg_green') }

/** Two oversized AEON wordmarks pinned to opposite corners behind a block (source: Aeon_Bg). */
function AeonBg({ variant = 'white' }: { variant?: 'white' | 'green' }) {
  const src = aeonOutline[variant]
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <img src={src} alt="" className="absolute top-2 -left-3 lg:h-[2.2rem] h-[1.1rem] object-contain select-none" />
      <img src={src} alt="" className="absolute bottom-2 -right-3 lg:h-[2.2rem] h-[1.1rem] object-contain select-none" />
    </div>
  )
}

function CardTotal({ item }: { item: Statistic }) {
  return (
    <div className="rounded-[0.15rem] lg:rounded-[0.3rem] bg-white/85 shadow-[0px_0px_44.5px_0px_#0000001A] backdrop-blur-[0.6px] lg:px-[0.4rem] lg:py-[0.32rem] px-[0.2rem] py-[0.18rem]">
      <p className="uppercase tracking-[20%] lg:text-[0.18rem] text-[0.1rem] text-black">{item.title}</p>
      <p className="font-bold text-black leading-none lg:text-[0.56rem] text-[0.32rem] lg:mt-[0.12rem] mt-[0.06rem]">{item.value}</p>
      <p className="text-[#000000A1] lg:text-[0.16rem] text-[0.1rem] lg:mt-[0.1rem] mt-[0.06rem]"> Cumulative </p>
    </div>
  )
}

function PaymentFlowItem({ item }: { item: (typeof paymentFlow)[number] }) {
  return (
    <div className="flex flex-col shrink-0 lg:w-[4.5rem] w-full">
      <div className="bg-[#E4E4E4] transition-colors duration-300 lg:rounded-[0.3rem] rounded-[0.2rem] hover:bg-[#58F287] lg:px-[0.35rem] lg:py-[0.3rem] px-[0.2rem] py-[0.15rem] cursor-pointer">
        <h3 className="lg:text-[0.36rem] text-[0.16rem] text-black leading-1 mb-[0.24rem]">{item.title}</h3>
        <img src={item.img} alt="" className="w-auto" />
        <p className="lg:text-[0.18rem] text-[0.11rem] text-black lg:mt-[0.1rem] mt-[0.24rem] leading-relaxed">{item.info}</p>
      </div>
    </div>
  )
}

export function PaymentFlow() {
  const statistics = useStatistics()
  return (
    <>
      <div className="w-full flex flex-col items-center justify-center">
        <h2 className="lg:max-w-[11.2rem] max-w-[3.38rem] text-center lg:text-[0.64rem] text-[.24rem] leading-none text-black"> The Agent Payment Flow </h2>
        <p className="lg:text-[0.2rem] text-[.12rem] text-black lg:max-w-[11.2rem] max-w-[90%] text-center lg:mt-[0.37rem] mt-[0.2rem] leading-1">
          {' '}
          We make it incredibly simple for AI developers to give their agents financial autonomy. Once integrated, AEON manages the entire payment
          lifecycle in five secure steps:{' '}
        </p>
      </div>
      <div className="hidden lg:block relative w-full lg:mt-[0.6rem] mt-[0.3rem]">
        <AeonBg variant="white" />
        <MarqueeScroll speed={50} gap={32} fadeWidth={80} pauseOnHover>
          {paymentFlow.map((item) => (
            <PaymentFlowItem key={item.title} item={item} />
          ))}
        </MarqueeScroll>
      </div>
      <div className="lg:hidden flex flex-col gap-[0.24rem] px-[0.4rem] w-full lg:mt-[0.6rem] mt-[0.3rem]">
        {paymentFlow.map((item) => (
          <PaymentFlowItem key={item.title} item={item} />
        ))}
      </div>
      <div className="relative w-full lg:mt-[1.6rem] mt-[0.4rem] lg:mb-0 mb-[0.4rem] lg:px-[2.4rem] px-[0.4rem] lg:py-[0.8rem] py-[0.4rem] lg:min-h-[4.6rem] flex justify-center items-center flex-col">
        <AeonBg variant="green" />
        <div className="relative z-10 grid lg:grid-cols-3 grid-cols-1 lg:gap-[0.51rem] gap-[0.24rem] lg:mt-[0.2rem]">
          {statistics.map((item) => (
            <CardTotal key={item.title} item={item} />
          ))}
        </div>
      </div>
    </>
  )
}
