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
import { OrderActions } from './order-actions'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChevronDown } from 'lucide-react'
import { Orders } from './page'
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
          order.id === lowercasedSearch ||
          order.relationship.customer.first_name
            .toLowerCase()
            .includes(lowercasedSearch) ||
          order.relationship.customer.last_name
            .toLowerCase()
            .includes(lowercasedSearch) ||
          order.relationship.customer.email
            .toLowerCase()
            .includes(lowercasedSearch) ||
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
      <div className="flex justify-between items-center py-4">
        <Input
          placeholder="Search orders..."
          value={searchTerm}
          onChange={handleSearch}
          className="max-w-sm bg-white mr-2"
        />
        <CreateOrderDialog />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {Object.entries(visibleColumns).map(([key, value]) => (
              <DropdownMenuCheckboxItem
                key={key}
                className="capitalize"
                checked={value}
                onCheckedChange={checked =>
                  setVisibleColumns(prev => ({ ...prev, [key]: checked }))
                }>
                {key}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              {visibleColumns.id && <TableHead>Order ID</TableHead>}
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
                  {visibleColumns.id && (
                    <TableCell className="font-medium">{order.id}</TableCell>
                  )}
                  {visibleColumns.full_name && (
                    <TableCell>
                      {order.relationship.customer.first_name +
                        ' ' +
                        order.relationship.customer.last_name}
                    </TableCell>
                  )}
                  {visibleColumns.email && (
                    <TableCell>{order.relationship.customer.email}</TableCell>
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
                  <TableCell>
                    <OrderActions order={order} />
                  </TableCell>
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
