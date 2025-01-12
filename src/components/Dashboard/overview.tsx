'use client'

import { Orders } from '@/app/(authenticated)/orders/page'
import { useAuth } from '@/hooks/auth'
import axios from '@/lib/axios'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import useSWR from 'swr'

export function Overview() {
  const { user } = useAuth({ middleware: 'auth' })
  const baseUrl = `api/v1/orders?user_id=${user.id}`
  // const csrfToken = Cookies.get('XSRF-TOKEN')

  const {
    data: orderData,
    error,
    mutate,
    isLoading,
  } = useSWR(baseUrl, async () => {
    try {
      const res = await axios.get(baseUrl)
      console.log(res.data.data)
      return res.data.data as Orders[]
    } catch (error: any) {
      console.error(error)
    }
  })

  const orders = orderData || [] // Fallback if `orderData` is undefined

  // Create a mapping from month names to their respective indices
  const months = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sep: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11,
  }

  const monthlyTotals = new Array(12).fill(0)

  orders.forEach(order => {
    const createdAt = new Date(order.created_at)
    const monthIndex = createdAt.getMonth() // 0-11 for Jan-Dec
    monthlyTotals[monthIndex] += order.total // Summing totals per month
  })

  // Update the `data` array with the filtered totals
  const data = Object.keys(months).map((month, index) => ({
    name: month,
    total: monthlyTotals[index],
  }))

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value: any) => `$${value}`}
        />
        <Bar
          dataKey="total"
          fill="currentColor"
          radius={[4, 4, 0, 0]}
          className="fill-primary"
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
