'use client'

import { useState, useEffect } from 'react'
import { formatDate, formatCurrency } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { OrderActions } from '../../app/(authenticated)/orders/order-actions'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChevronDown } from 'lucide-react'
import { Orders } from '../../app/(authenticated)/orders/page'
import { CreateOrderDialog } from '@/components/Orders/CreateOrderDialog'

// const orders: Order[] = [
//   {
//     id: '1234',
//     customer: 'John Doe',
//     email: 'john@example.com',
//     date: new Date('2023-04-01'),
//     status: 'Processing',
//     total: 125.99,
//     items: 3,
//   },
//   {
//     id: '5678',
//     customer: 'Jane Smith',
//     email: 'jane@example.com',
//     date: new Date('2023-04-02'),
//     status: 'Shipped',
//     total: 245.5,
//     items: 2,
//   },
//   {
//     id: '9012',
//     customer: 'Bob Johnson',
//     email: 'bob@example.com',
//     date: new Date('2023-04-03'),
//     status: 'Delivered',
//     total: 75.0,
//     items: 1,
//   },
//   {
//     id: '3456',
//     customer: 'Alice Brown',
//     email: 'alice@example.com',
//     date: new Date('2023-04-04'),
//     status: 'Cancelled',
//     total: 199.99,
//     items: 4,
//   },
// ]

export function OrdersTable({ orders }: { orders: Orders[] }) {
  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    full_name: true,
    email: true,
    created_at: true,
    order_status: true,
    total: true,
    items: true,
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredOrders, setFilteredOrders] = useState(orders)

  useEffect(() => {
    if (orders) {
      const lowercasedSearch = searchTerm.toLowerCase()
      const filtered = orders?.filter(
        order =>
          order.id.toString() === lowercasedSearch ||
          order.customers.first_name.toLowerCase().includes(lowercasedSearch) ||
          order.customers.last_name.toLowerCase().includes(lowercasedSearch) ||
          order.customers.email.toLowerCase().includes(lowercasedSearch) ||
          order.order_status.toLowerCase().includes(lowercasedSearch),
      )
      setFilteredOrders(filtered)
    }
  }, [searchTerm, orders])

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  return (
    <div>
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              {visibleColumns.full_name && <TableHead>Customer</TableHead>}
              {visibleColumns.email && <TableHead>Email</TableHead>}
              {visibleColumns.created_at && <TableHead>Date</TableHead>}
              {visibleColumns.order_status && <TableHead>Status</TableHead>}
              {visibleColumns.total && (
                <TableHead className="text-right">Total</TableHead>
              )}
              {visibleColumns.items && (
                <TableHead className="text-center">Items</TableHead>
              )}
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders &&
              filteredOrders.map(order => (
                <TableRow key={order.id}>
                  {visibleColumns.full_name && (
                    <TableCell>
                      {order.customers.first_name +
                        ' ' +
                        order.customers.last_name}
                    </TableCell>
                  )}
                  {visibleColumns.email && (
                    <TableCell>{order.customers.email}</TableCell>
                  )}
                  {visibleColumns.created_at && (
                    <TableCell>
                      {new Date(order.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </TableCell>
                  )}
                  {visibleColumns.order_status && (
                    <TableCell>
                      <OrderStatusBadge status={order.order_status} />
                    </TableCell>
                  )}
                  {visibleColumns.total && (
                    <TableCell className="text-right">
                      {formatCurrency(order.total)}
                    </TableCell>
                  )}
                  {visibleColumns.items && (
                    <TableCell className="text-center">{order.items}</TableCell>
                  )}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

function OrderStatusBadge({ status }: { status: string }) {
  let color
  switch (status.toLowerCase()) {
    case 'processing':
      color = 'bg-transparent text-black border-black-50 shadow-none'
      break
    case 'shipped':
      color = 'bg-green-500'
      break
    case 'delivered':
      color = 'bg-gray-400'
      break
    case 'cancelled':
      color = 'bg-red-400'
      break
  }
  return <Badge className={color}>{status}</Badge>
}
