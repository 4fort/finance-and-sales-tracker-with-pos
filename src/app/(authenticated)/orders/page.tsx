'use client'
import { OrdersTable } from './orders-table'
import { OrderSummary } from './order-summary'
import axios from '@/lib/axios'
import { Customer } from '../customers/page'
import { useAuth } from '@/hooks/auth'
import { useQuery } from '@tanstack/react-query'
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
  relationship: { customer: Omit<Customer, 'subscription_status'> }
}
export default function OrdersPage() {
  const { user } = useAuth({ middleware: 'auth' })
  const baseUrl = `api/v1/orders?user_id=${user.id}`
  // const csrfToken = Cookies.get('XSRF-TOKEN')

  const { data, error, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      try {
        const res = await axios.get(baseUrl)
        console.log(res.data.data)
        return res.data.data as Orders[]
      } catch (error: any) {
        console.error(error)
      }
    },
  })

  return (
    <div className="flex flex-col space-y-4 p-8 pt-6">
      <OrderSummary data={data ? data : []} />
      <div className="my-6 space-y-4">
        <OrdersTable orders={data ? data : []} />
      </div>
    </div>
  )
}
