import { Metadata } from 'next'
import { OrdersTable } from './orders-table'
import { OrderSearch } from './order-search'
import { OrderSummary } from './order-summary'

export const metadata: Metadata = {
  title: 'Orders | Admin Dashboard',
  description: 'Manage and view all orders',
}

export default function OrdersPage() {
  return (
    <div className="flex flex-col space-y-4 p-8 pt-6">
      <OrderSummary />
      <div className="my-6 space-y-4">
        <OrdersTable />
      </div>
    </div>
  )
}
