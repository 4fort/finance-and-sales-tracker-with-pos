'use client'
import { OrdersTable } from './orders-table'
import { OrderSummary } from './order-summary'
import axios from '@/lib/axios'
import { Customer } from '../customers/page'
import { useAuth } from '@/hooks/auth'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
// import { Customer } from '../customers/page'

// export const metadata: Metadata = {
//   title: 'Orders | Admin Dashboard',
//   description: 'Manage and view all orders',
// }

export type Orders = {
  order_status: string
  id: number
  items: number
  total: number
  created_at: string
  customers: Omit<Customer, 'subscription_status'>
}
export default function OrdersPage() {
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

  const { data, error, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select(
            'id,total,order_status,items, created_at, customers!orders_customer_id_fkey (email, first_name, last_name, id)',
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

  return (
    <div className="flex flex-col space-y-4 p-8 pt-6">
      <OrderSummary data={data ? (data as Orders[]) : []} />
      <div className="my-6 space-y-4">
        <OrdersTable orders={data ? (data as Orders[]) : []} />
      </div>
    </div>
  )
}
