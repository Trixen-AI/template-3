import { useState } from 'react'
import { BackedBy } from '@/components/sections/BackedBy'
import { EconomicActor } from '@/components/sections/EconomicActor'
import { HomeFirstScreen } from '@/components/sections/HomeFirstScreen'
import { HorizontalScrollArea } from '@/components/sections/HorizontalScrollArea'
import { PaymentFlow } from '@/components/sections/PaymentFlow'

/**
 * The rest of the page mounts only after the hero intro finishes, and the horizontal
 * Partners/News/Contact pan only after the card stack has been scrolled through (desktop).
 */
export function HomeView() {
  const [introDone, setIntroDone] = useState(false)
  const [stackDone, setStackDone] = useState(() => window.innerWidth <= 1024)

  return (
    <div className="home bg-[#f4f4f4]">
      <HomeFirstScreen onIntroComplete={() => setIntroDone(true)} />
      {introDone ? (
        <>
          <BackedBy />
          <div className="lg:mx-[2.4rem] lg:mt-[0.84rem] mt-0 mb-0">
            <EconomicActor onStackComplete={() => setStackDone(true)} />
          </div>
          <div className="w-full 2xl:pt-[2.41rem] xl:pt-[1.21rem] md:pt-[0.6rem] pt-0">
            <PaymentFlow />
          </div>
          {stackDone ? <HorizontalScrollArea /> : <div className="w-full min-h-300vh h-300vh lg:block hidden" />}
        </>
      ) : null}
    </div>
  )
}
