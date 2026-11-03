import { useEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router'
import { AssetImage } from '@/components/ui/AssetImage'
import { navItems, resolveHref, type NavChild } from '@/data/site'

const SLIDE_MS = 360

/** Full-screen slide-in panel that locks page scroll while open (source: MobileMenu). */
function MobileMenu({ open, onClose, children }: { open: boolean; onClose: () => void; children: ReactNode }) {
  const [mounted, setMounted] = useState(open)
  const [visible, setVisible] = useState(false)
  const scrollY = useRef(0)
  const locked = useRef(false)
  // Mount as soon as it opens; unmount only after the slide-out finishes.
  if (open && !mounted) setMounted(true)
  if (!open && visible) setVisible(false)

  useEffect(() => {
    const body = document.body
    if (open) {
      locked.current = true
      scrollY.current = window.scrollY
      Object.assign(body.style, { position: 'fixed', top: `-${scrollY.current}px`, left: '0', right: '0', width: '100%', overflow: 'hidden' })
      document.documentElement.style.overflow = 'hidden'
      const frame = requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)))
      return () => cancelAnimationFrame(frame)
    }
    if (!locked.current) return
    const t = window.setTimeout(() => {
      locked.current = false
      setMounted(false)
      Object.assign(body.style, { position: '', top: '', left: '', right: '', width: '', overflow: '' })
      document.documentElement.style.overflow = ''
      window.scrollTo(0, scrollY.current)
    }, SLIDE_MS)
    return () => window.clearTimeout(t)
  }, [open])

  if (!mounted) return null
  return createPortal(
    <div className="mobile-menu-root fixed inset-0 z-50">
      <div
        className={`mobile-menu-backdrop fixed inset-0 bg-black/55 mobile-menu-fade-enter-active${visible ? '' : ' mobile-menu-fade-enter-from'}`}
        aria-hidden="true"
        onClick={onClose}
      />
      <aside
        className={`mobile-menu-panel fixed top-0 h-full w-full max-w-none bg-white shadow-2xl flex flex-col outline-none right-0 mobile-menu-slide-right-enter-active${visible ? '' : ' mobile-menu-slide-right-enter-from'}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        tabIndex={-1}
      >
        {children}
      </aside>
    </div>,
    document.body,
  )
}

function ChildItem({ item, onNavigate }: { item: NavChild; onNavigate: () => void }) {
  return (
    <a
      href={resolveHref(item.to)}
      target={item.type === 'link' && item.toWay !== 'self' ? '_blank' : '_self'}
      rel="noopener noreferrer"
      className="mobile-nav__child-item"
      onClick={onNavigate}
    >
      <span className="mobile-nav__child-dot" />
      <span className="mobile-nav__child-title">{item.label}</span>
    </a>
  )
}

/** Header shown inside the hero below 1024px (source: MobileHeader). */
export function MobileHeader() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(navItems[0]?.label ?? '')
  const [group, setGroup] = useState('')
  const close = () => setOpen(false)

  const selectSection = (label: string) => {
    setActive(label)
    const nested = navItems.find((n) => n.label === label)?.children?.find((c) => c.children?.length)
    setGroup(nested?.label ?? '')
  }

  return (
    <>
      <div className="w-full flex justify-between items-center px-[0.2rem] py-[0.16rem] relative z-10">
        <Link to="/" aria-label="AEON" className="from-reveal magnet">
          <AssetImage className="w-auto h-[0.48rem]" path="header/aeon" alt="AEON" />
        </Link>
        <div className="">
          <AssetImage onClick={() => setOpen(true)} className="w-[0.24rem] h-[0.24rem]" path="header/menu" alt="AEON" />
        </div>
      </div>
      <MobileMenu open={open} onClose={close}>
        <div className="max-w-[calc(100% - 0.4rem)] w-full px-[0.2rem] mt-[0.16rem] flex-1 overflow-y-auto pb-[0.4rem]">
          <div className="flex justify-between items-center mb-[0.6rem]">
            <AssetImage className="w-auto h-[0.40rem]" path="header/aeon_logo" ext="png" alt="" />
            <AssetImage onClick={close} className="w-[0.24rem] h-[0.24rem]" path="header/close_icon" ext="png" alt="" />
          </div>
          <div className="mobile-nav">
            {navItems.map((item) => {
              const activeClass = `mobile-nav__top${active === item.label ? ' mobile-nav__top--active' : ''}`
              return (
                <div key={item.label} className="mobile-nav__section">
                  {item.children?.length ? (
                    <button className={activeClass} type="button" onClick={() => selectSection(item.label)}>
                      {item.label}
                    </button>
                  ) : item.to === '/' ? (
                    <Link
                      className={activeClass}
                      to="/"
                      onClick={() => {
                        setActive(item.label)
                        setGroup('')
                        close()
                      }}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <a className={activeClass} href={resolveHref(item.to)}>
                      {item.label}
                    </a>
                  )}
                  {item.children?.length && active === item.label ? (
                    <div className="mobile-nav__children">
                      {item.children.map((m) =>
                        m.children?.length ? (
                          <div key={m.label} className="contents">
                            <button
                              className={`mobile-nav__top mobile-nav__group${group === m.label ? ' mobile-nav__top--active' : ''}`}
                              type="button"
                              onClick={() => setGroup((g) => (g === m.label ? '' : m.label))}
                            >
                              {m.label}
                            </button>
                            {group === m.label ? (
                              <div className="mobile-nav__children mobile-nav__children--nested">
                                {m.children.map((b) => (
                                  <ChildItem key={b.label} item={b} onNavigate={close} />
                                ))}
                              </div>
                            ) : null}
                          </div>
                        ) : (
                          <ChildItem key={m.label} item={m} onNavigate={close} />
                        ),
                      )}
                    </div>
                  ) : null}
                </div>
              )
            })}
          </div>
        </div>
      </MobileMenu>
    </>
  )
}
