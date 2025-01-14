'use client'

import { Orders } from '@/app/(authenticated)/orders/page'
import { useAuth } from '@/hooks/auth'
import axios from '@/lib/axios'
import { supabase } from '@/lib/supabase'
import { useQuery } from '@tanstack/react-query'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import useSWR from 'swr'

export function Overview() {
  const {
    isPending,
    error: userError,
    data: user,
  } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.auth.getUser()
        if (error) {
          console.error(error)
        }
        if (data) {
          console.log('data user', data)
          return data
        }
      } catch (error: any) {
        console.error(error)
      }
    },
  })

  const {
    data: orderData,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select(
            'id,total,order_status,items, created_at, customers!orders_customer_id_fkey  (email, first_name, last_name)',
          )
          .eq('user_id', user?.user?.id)
        if (error) {
          console.error(error)
        }
        if (data) {
          console.log('order data', data)
          return data as any[]
        }
      } catch (error: any) {
        console.error(error)
      }
    },
    enabled: !!user?.user?.id, // Only run this query if the user ID is available
  })

  const orders = (orderData as Orders[]) || []

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
