export interface SocialLink {
  href: string
  ariaLabel: string
  path: string
}

export const socialLinks: SocialLink[] = [
  { href: 'https://x.com/AEON_Community', ariaLabel: 'X', path: 'header/x' },
  { href: 'https://t.me/aeon_xyz', ariaLabel: 'Telegram', path: 'header/tele' },
  { href: 'https://medium.com/@www_aeon_xyz', ariaLabel: 'Medium', path: 'header/medium' },
]

/** Pages outside the cloned home page open on the live site. */
export const LIVE_SITE = 'https://aeon.xyz'
export const WHITEPAPER_URL = 'https://web3-revolution.gitbook.io/aeon-whitepaper'
export const DOCS_URL = 'https://aeon-xyz.readme.io/docs/quick-start-1'
export const CONTACT_URL = 'https://share-eu1.hsforms.com/1AE8zMDy2RjmxVf0qP47MLAfre5e'

export interface NavChild {
  to: string
  type: 'route' | 'link' | 'dropdown'
  label: string
  subTitle?: string
  toWay?: 'self'
  children?: NavChild[]
}

export interface NavItem {
  to: string
  label: string
  type?: 'route' | 'link'
  toWay?: 'self'
  children?: NavChild[]
}

export const navItems: NavItem[] = [
  { to: '/', label: 'Home', type: 'route' },
  {
    to: '',
    label: 'Products',
    children: [
      { to: '/ai-card', type: 'route', label: 'AI Card', subTitle: 'Programmable cards for autonomous AI spending', toWay: 'self' },
      { to: '/ai-gateway', type: 'route', label: 'AI Gateway', subTitle: 'Pay-per-call API access for AI tools & services', toWay: 'self' },
      {
        to: '/agent-account',
        type: 'route',
        label: 'Agent Account',
        subTitle: 'Core APIs to manage agent financial identities and enforce controls',
        toWay: 'self',
      },
      {
        to: '',
        type: 'dropdown',
        label: 'Money Movement',
        subTitle: 'Global payment network empowering agents to route, collect, and settle funds',
        toWay: 'self',
        children: [
          { to: '/x402-facilitator', type: 'route', label: 'x402 Facilitator', subTitle: 'Automated high-frequency micro-payments for AI', toWay: 'self' },
          { to: '/agentic-checkout', type: 'route', label: 'Agent Checkout', subTitle: 'Seamless payments for e-commerce shopping', toWay: 'self' },
          { to: '/aeon-pay', type: 'route', label: 'AEON Pay', subTitle: 'Pay with crypto using QR codes or bank transfer instantly', toWay: 'self' },
          { to: '/collect-accept', type: 'route', label: 'Collect & Accept', subTitle: 'Effortless crypto acceptance for modern businesses', toWay: 'self' },
          { to: '/transactions', type: 'route', label: 'Transactions', subTitle: 'Automated payouts and disbursements', toWay: 'self' },
        ],
      },
    ],
  },
  {
    to: '',
    label: 'Documentation',
    children: [
      { to: DOCS_URL, label: 'Developer Docs', type: 'link' },
      { to: WHITEPAPER_URL, label: 'AEON Whitepaper', type: 'link' },
    ],
  },
  { to: '/about', label: 'About', type: 'route' },
]

/** Routes of the source that are not part of this clone resolve to the live site. */
export function resolveHref(to: string) {
  if (!to) return '#'
  return to.startsWith('/') && to !== '/' ? `${LIVE_SITE}${to}` : to
}
