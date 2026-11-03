import { Link } from 'react-router'
import { AssetImage } from '@/components/ui/AssetImage'
import { assetUrl } from '@/lib/assets'
import { CONTACT_URL, socialLinks } from '@/data/site'

const sendIcon = assetUrl('home/send_icon', 'png')
const footerLogo = assetUrl('header/aeon_m')
const footerText = ' All Rights Reserved Privacy PolicyTerms & Conditions '

export function ContactButton({ className }: { className?: string }) {
  return (
    <a href={CONTACT_URL} target="_blank" rel="noopener noreferrer" className={`inline-flex${className ? ` ${className}` : ''}`}>
      <button
        type="button"
        className="flex justify-center items-center rounded-full bg-black lg:px-[0.32rem] px-[0.13rem] lg:py-[0.18rem] py-[0.08rem] cursor-pointer"
      >
        <img className="lg:w-[0.24rem] w-[0.09rem] lg:h-[0.24rem] h-[0.09rem] lg:mr-[0.08rem] mr-[0.04rem]" src={sendIcon} alt="" />
        <span className="font-pangea-bold lg:text-[0.18rem] text-[0.09rem] text-white">Contact Us</span>
      </button>
    </a>
  )
}

/** Last panel of the desktop horizontal pan: CTA plus footer (source: ContactUS). */
export function ContactUS() {
  return (
    <div className="contact_us_contaienr">
      <div className="mt-[30%] max-w-[3.83rem]">
        <h3 className="text-sans mb-[0.18rem] text-[0.48rem] text-black"> Unlock True Autonomy for Your Agents. </h3>
        <div className="text-sans mb-[0.71rem] text-[0.2rem] text-black/60">
          {' '}
          Create your first agent account today and connect your agents to the global economy.{' '}
        </div>
        <ContactButton />
      </div>
      <div className="flex flex-col items-end absolute bottom-[10%] right-[0.65rem]">
        <Link to="/" aria-label="AEON" className="from-reveal magnet">
          <AssetImage className="w-[1.48rem]" path="header/aeon" alt="AEON" />
        </Link>
        <p className="text-sans mb-[0.16rem] text-[0.16rem] text-black/60">{footerText}</p>
        <div className="page-nav-header__social flex justify-center items-center gap-[.24rem]" aria-label="Social media">
          {socialLinks.map((s) => (
            <a
              key={s.ariaLabel}
              href={s.href}
              className="page-nav-header__social-link inline-flex cursor-pointer from-reveal magnet"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.ariaLabel}
            >
              <AssetImage className="w-[.32rem]" path={s.path} alt="" />
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

/** Stacked CTA and black footer used below 1024px (source: MobileContactUS). */
export function MobileContactUS({ lgPt = '4.2rem' }: { lgPt?: string }) {
  return (
    <div className="mobile_contact_us relative z-1">
      <div
        className="top_area px-[0.4rem] py-[0.6rem] lg:px-[3.2rem] lg:pb-[.87rem]"
        style={{ '--top-area-lg-pt': lgPt } as React.CSSProperties}
      >
        <h3 className="text-sans mb-[0.12rem] text-[0.24rem] text-black relative z-10 lg:text-[.48rem] lg:mb-[.28rem]">
          {' '}
          Unlock True Autonomy for Your Agents.{' '}
        </h3>
        <p className="text-sans mb-[0.251rem] text-[0.12rem] text-black/60 relative z-10 lg:text-[.2rem] lg:mb-[.34rem]">
          {' '}
          Create your first agent account today and connect your agents to the global economy.{' '}
        </p>
        <ContactButton className="relative z-10 transition-transform duration-200 ease-out hover:-translate-y-[0.02rem] hover:scale-[1.02]" />
      </div>
      <div className="bg-black px-[0.4rem] py-[0.32rem] flex flex-col items-end lg:px-[3.2rem] lg:pb-[.67rem] lg:pt-[1.17rem] lg:block">
        <img className="h-[0.24rem] w-auto lg:h-[.4rem] lg:mb-[.16rem]" src={footerLogo} alt="AEON" />
        <div className="flex flex-col items-end lg:flex-row lg:justify-between lg:items-center">
          <p className="text-sans mt-[0.11rem] text-[0.12rem] text-white/60 lg:mt-0 lg:text-[0.16rem] lg:font-medium">{footerText}</p>
          <div className="flex items-center gap-[.22rem] mt-[0.2rem] lg:mt-0 lg:gap-[.32rem]" aria-label="Social media">
            {socialLinks.map((s) => (
              <a
                key={s.ariaLabel}
                href={s.href}
                className="inline-flex cursor-pointer from-reveal magnet transition-transform duration-200 ease-out hover:scale-110"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.ariaLabel}
              >
                <AssetImage className="w-[.16rem] lg:w-[.36rem]" path={`${s.path}_m`} alt="" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
