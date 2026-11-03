import { createClient } from '@sanity/client'

// Sanity's CORS list only allows aeon.xyz, so the browser calls a same-origin proxy instead:
// the Vite server in dev/preview, a rewrite in vercel.json in production.
export const sanity = createClient({
  projectId: 'ii1qs0dx',
  dataset: 'production',
  apiVersion: '2025-01-01',
  useCdn: true,
  apiHost: `${window.location.origin}/sanity-api`,
  useProjectHostname: false,
})

export interface NewsItem {
  id: string
  title: string
  image: string
  publishedAt: string | null
  excerpt: string | null
}

const PAGE_SIZE = 9

const FIRST_PAGE_QUERY = `*[_type == "post"] | order(publishedAt desc, _id desc) [0...$fetchSize]{
  "id": _id,
  title,
  "image": image.asset->url,
  publishedAt,
  "excerpt": array::join(body[_type=="block"][0].children[].text, "")
}`

/** First page of posts, newest first (source: K6 first fetch). */
export async function fetchNewsFirstPage(): Promise<NewsItem[]> {
  try {
    const rows = await sanity.fetch<Partial<NewsItem>[]>(FIRST_PAGE_QUERY, { fetchSize: PAGE_SIZE + 1 })
    return rows
      .filter((row) => row.title && row.image)
      .slice(0, PAGE_SIZE)
      .map((row) => ({
        id: row.id!,
        title: row.title!,
        image: row.image!,
        publishedAt: row.publishedAt ?? null,
        excerpt: row.excerpt ?? null,
      }))
  } catch (error) {
    console.error('[NewsList] sanityFetch failed', error)
    return []
  }
}
