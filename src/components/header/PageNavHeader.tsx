import { createPortal } from 'react-dom'
import { Link, useLocation } from 'react-router'
import { AssetImage } from '@/components/ui/AssetImage'
import { navItems, resolveHref, socialLinks, type NavChild } from '@/data/site'
import { NavDropdown } from './NavDropdown'

const hasNested = (children: NavChild[]) => children.some((c) => c.children && c.children.length > 0)

function ChildLink({ item, className, children }: { item: NavChild; className: string; children: React.ReactNode }) {
  const external = item.type === 'link'
  return (
    <a
      href={resolveHref(item.to)}
      target={external && item.toWay !== 'self' ? '_blank' : '_self'}
      rel="noopener noreferrer"
      className={className}
    >
      {children}
    </a>
  )
}

function MegaMenu({ items }: { items: NavChild[] }) {
  const flat = items.filter((c) => !c.children?.length)
  const group = items.find((c) => !!c.children?.length)
  return (
    <div className="pnh-mega">
      <div className="pnh-mega-l">
        {flat.map((m) => (
          <ChildLink key={m.label} item={m} className="pnh-mega-l-item">
            <span className="pnh-mega-l-title">{m.label}</span>
            {m.subTitle ? <span className="pnh-mega-l-sub">{m.subTitle}</span> : null}
          </ChildLink>
        ))}
      </div>
      {group ? (
        <div className="pnh-mega-r">
          <div className="pnh-mega-r-hd">
            <span className="pnh-mega-r-title">{group.label}</span>
            {group.subTitle ? <span className="pnh-mega-r-desc">{group.subTitle}</span> : null}
          </div>
          <div className="pnh-mega-grid">
            {group.children!.map((b) => (
              <ChildLink key={b.label} item={b} className="pnh-mega-card">
                <span className="pnh-mega-card-title">
                  <i className="pnh-mega-card-dot" /> {b.label}
                </span>
                {b.subTitle ? <span className="pnh-mega-card-sub">{b.subTitle}</span> : null}
              </ChildLink>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}

function SimpleMenu({ items }: { items: NavChild[] }) {
  return (
    <ul className="el-dropdown-menu" role="menu">
      {items.map((m) => (
        <li key={m.label} className="px-0! py-0! el-dropdown-menu__item" role="menuitem">
          <ChildLink item={m} className="pnh-simple">
            <span className="pnh-simple-title">{m.label}</span>
            {m.subTitle ? <span className="pnh-simple-sub">{m.subTitle}</span> : null}
          </ChildLink>
        </li>
      ))}
    </ul>
  )
}

/** Fixed desktop header, rendered into <body> (source: PageNavHeader, teleported). */
export function PageNavHeader() {
  const { pathname } = useLocation()

  return createPortal(
    <header className="header_container fixed inset-x-0 top-0 z-50 h-[1.26rem] w-full flex justify-center items-center">
      <div className="pnh-inner flex justify-center items-center gap-[.26rem] p-[1.2rem]">
        <Link to="/" aria-label="AEON" className="from-reveal magnet">
          <AssetImage className="w-[1.48rem]" path="header/aeon" alt="AEON" />
        </Link>
        <nav
          className="pnh-nav flex justify-center items-center gap-[.92rem] px-[.6rem] h-[.53rem] bg-black rounded-2xl"
          aria-label="Main navigation"
        >
          {navItems.map((item) => (
            <div
              key={item.label}
              className="pnh-link text-[.18rem] text-white font-pangea-bold opacity-50 [&:has(.router-link-active)]:opacity-100 cursor-pointer from-reveal magnet"
            >
              {item.children ? (
                <NavDropdown label={item.label} popperClass={hasNested(item.children) ? 'pnh-dd pnh-dd--mega' : 'pnh-dd pnh-dd--simple'}>
                  {hasNested(item.children) ? <MegaMenu items={item.children} /> : <SimpleMenu items={item.children} />}
                </NavDropdown>
              ) : item.to === '/' ? (
                <Link to="/" className={`${pathname === '/' ? 'router-link-active ' : ''}text-white`}>
                  <span>{item.label}</span>
                </Link>
              ) : (
                <a href={resolveHref(item.to)} className="text-white">
                  <span>{item.label}</span>
                </a>
              )}
            </div>
          ))}
        </nav>
        <div className="pnh-social flex justify-center items-center gap-[.24rem]" aria-label="Social media">
          {socialLinks.map((s) => (
            <a
              key={s.ariaLabel}
              href={s.href}
              className="pnh-social-link inline-flex cursor-pointer from-reveal magnet transition-transform duration-200 ease-out hover:scale-120"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.ariaLabel}
            >
              <AssetImage className="w-[.32rem]" path={s.path} alt="" />
            </a>
          ))}
        </div>
      </div>
    </header>,
    document.body,
  )
}
