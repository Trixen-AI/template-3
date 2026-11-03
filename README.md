# AEON home page (React clone)

React + Vite + TypeScript rebuild of the aeon.xyz home page, mirroring the source stack: Tailwind CSS v4, GSAP 3.15
(ScrollTrigger, SplitText), animate.css and the Sanity news feed.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run lint
```

## Notes

- Sizes use the source's rem scale: `html { font-size: max(52px, 100vw / 1920 * 100) }` on desktop and
  `max(50px, 100vw / 375 * 100)` below 1024px, so all `[x.xxrem]` classes are design-pixel / 100.
- News comes from Sanity (project `ii1qs0dx`). Sanity's CORS list only allows the production origin, so the browser
  always calls the same-origin path `/sanity-api`: the Vite proxy serves it in dev and preview, and a rewrite in
  `vercel.json` serves it on Vercel. No Sanity CORS change is needed.

## Deploy on Vercel

Import the GitHub repo in Vercel; `vercel.json` sets everything (Vite preset, `npm ci`, `npm run build`, output
`dist`, the Sanity rewrite, SPA fallback to `index.html`, long-cache headers for hashed `/assets`). Node 22.12+ is
required (`engines` in `package.json`). No environment variables are needed.
- The statistics feed (`analytics.aeon.xyz/data.json`) also blocks other origins; the bundled figures are shown when
  it fails, exactly as on the live site.
- Only the home page is cloned. Other routes (products, about, news) link to https://aeon.xyz.
- Element Plus (Vue-only) was used only for the two nav dropdowns; they are rebuilt in
  `src/components/header/NavDropdown.tsx` with Element Plus's own CSS rules and timings.
