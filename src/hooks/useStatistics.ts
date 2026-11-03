import { useEffect, useState } from 'react'
import { defaultStatistics, STATISTICS_URL, type Statistic } from '@/data/home'

const sum = (values: number[]) => values.reduce((total, value) => total + value, 0)
const format = (value: number) => new Intl.NumberFormat('en-US').format(value)

/** Live totals from the analytics feed, falling back to the bundled figures (source: gF). */
export function useStatistics() {
  const [statistics, setStatistics] = useState<Statistic[]>(defaultStatistics)

  useEffect(() => {
    let alive = true
    fetch(STATISTICS_URL)
      .then((response) => response.json())
      .then((data) => {
        const amount = data?.amount?.data?.Total
        const orders = data?.orders?.data?.['Total Payment Transaction']
        const users = data?.users?.data?.['Total Users Served']
        if (!alive || !Array.isArray(amount) || !Array.isArray(orders) || !Array.isArray(users) || users.length === 0) return
        setStatistics([
          { title: 'TOTAL TRANSACTION AMOUNT', value: format(sum(amount)), subtext: 'Cumulative' },
          { title: 'TOTAL ORDERS', value: format(sum(orders)), subtext: 'Cumulative' },
          { title: 'TOTAL USERS SERVED', value: format(users[users.length - 1]), subtext: 'Cumulative' },
        ])
      })
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [])

  return statistics
}
