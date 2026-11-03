import actorVideo from '@/assets/images/home/actor/actor.mp4'
import actor2Video from '@/assets/images/home/actor/actor2.mp4'
import actor3Video from '@/assets/images/home/actor/actor3.mp4'
import actor1Img from '@/assets/images/home/actor/actor1.png'
import actor2Img from '@/assets/images/home/actor/actor2.png'
import actor3Img from '@/assets/images/home/actor/actor3_1.png'
import flow1 from '@/assets/images/home/paymentFlow/1.png'
import flow2 from '@/assets/images/home/paymentFlow/2.png'
import flow3 from '@/assets/images/home/paymentFlow/3.png'
import flow4 from '@/assets/images/home/paymentFlow/4.png'
import flow5 from '@/assets/images/home/paymentFlow/5.png'
import { assetUrl } from '@/lib/assets'

/** Hero: which of the four AEON wordmark variants sits in each slot of the four rows. */
export const heroRows = [
  [2, 1, 4, 3],
  [1, 4, 3, 2],
  [4, 3, 2, 1],
  [3, 2, 1, 2],
]

export const backedBy = [
  { src: assetUrl('home/backedBy/1'), alt: 'Contribution Capital' },
  { src: assetUrl('home/backedBy/2'), alt: 'UpHonest Capital' },
  { src: assetUrl('home/backedBy/3'), alt: 'SevenX Ventures' },
  { src: assetUrl('home/backedBy/4'), alt: 'Blockchain Builders' },
  { src: assetUrl('home/backedBy/5'), alt: 'HashKey Capital' },
  { src: assetUrl('home/backedBy/6'), alt: 'YZi Labs' },
  { src: assetUrl('home/backedBy/7'), alt: 'IDG Capital' },
  { src: assetUrl('home/backedBy/8'), alt: 'Oak Grove Ventures' },
  { src: assetUrl('home/backedBy/9'), alt: 'Alchemy' },
  { src: assetUrl('home/backedBy/10'), alt: 'Draper Dragon' },
]

export interface EconomicActorItem {
  title: string
  title2: string
  desc: string
  tags: [string, string]
  bg1: string
  descPosition: 'left' | 'right'
  maskImg: string
}

export const economicActors: EconomicActorItem[] = [
  {
    title: 'AGENT ACCOUNT',
    title2: 'True Financial Autonomy for AI',
    desc: 'The agent account gives your agent a single, programmable multi-currency hub where stablecoins and fiat seamlessly coexist. Now, your AI can autonomously subscribe to data feeds, pay for compute, or hire other agents without human intervention.',
    tags: ['Multi Asset', 'Autonomous'],
    bg1: actor2Video,
    descPosition: 'left',
    maskImg: actor2Img,
  },
  {
    title: 'AI CARD',
    title2: 'Controlled Autonomous Spending for Agents',
    desc: 'Enable your AI assistants to navigate real-world checkouts. Backed by the liquidity of your unified account, these dedicated virtual cards come with hard-coded spending limits, ensuring your agents can complete everyday financial tasks without risking your main corporate treasury.',
    tags: ['Secure', 'Trust'],
    bg1: actor3Video,
    descPosition: 'right',
    maskImg: actor3Img,
  },
  {
    title: 'AI GATEWAY',
    title2: 'Pay-Per-Call Tooling Infrastructure',
    desc: "Equip your AI with an instant terminal connection to over 1,000 external APIs and services. Funded directly through the agent's unified account, this integration enables high-frequency micro-payments so your agents can independently rent compute, acquire web data, and trigger cross-platform actions on the fly.",
    tags: ['Zero-config', 'Plug & Play'],
    bg1: actorVideo,
    descPosition: 'left',
    maskImg: actor1Img,
  },
]

export const paymentFlow = [
  { title: 'Agent Account', img: flow1, info: 'One multi-currency account that holds funds and payment methods for your Agent.' },
  { title: 'Verified Identity', img: flow2, info: "Verify your Agent once and unlock instant access to AEON's global payment network." },
  { title: 'Smart Route', img: flow3, info: 'Every transaction takes the best payment channel automatically, no manual decisions.' },
  { title: 'Flexible Charge', img: flow4, info: 'Pay only for what you use—APIs, compute, and digital services on demand.' },
  { title: 'Clear Policy', img: flow5, info: "Set spending rules that keep your Agent's transactions safe and compliant." },
]

export interface Statistic {
  title: string
  value: string
  subtext: string
}

export const defaultStatistics: Statistic[] = [
  { title: 'TOTAL TRANSACTION AMOUNT', value: '645,630,485', subtext: 'Cumulative' },
  { title: 'TOTAL ORDERS', value: '15,469,803', subtext: 'Cumulative' },
  { title: 'TOTAL USERS SERVED', value: '2,574,898', subtext: 'Cumulative' },
]

export const STATISTICS_URL = 'https://analytics.aeon.xyz/data.json'
