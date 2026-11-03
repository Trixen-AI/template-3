import { useEffect, useState } from 'react'
import { fetchNewsFirstPage, type NewsItem } from '@/lib/sanity'

export function useNewsList() {
  const [newsList, setNewsList] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    fetchNewsFirstPage().then((items) => {
      if (!alive) return
      setNewsList(items)
      setLoading(false)
    })
    return () => {
      alive = false
    }
  }, [])

  return { newsList, loading }
}
