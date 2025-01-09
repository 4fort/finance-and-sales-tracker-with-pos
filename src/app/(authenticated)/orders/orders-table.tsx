'use client'

import { useState, useEffect } from 'react'
import { Order } from '@/types/User'
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

const orders: Order[] = [
  {
    id: '1234',
    customer: 'John Doe',
    email: 'john@example.com',
    date: new Date('2023-04-01'),
    status: 'Processing',
    total: 125.99,
    items: 3,
  },
  {
    id: '5678',
    customer: 'Jane Smith',
    email: 'jane@example.com',
    date: new Date('2023-04-02'),
    status: 'Shipped',
    total: 245.5,
    items: 2,
  },
  {
    id: '9012',
    customer: 'Bob Johnson',
    email: 'bob@example.com',
    date: new Date('2023-04-03'),
    status: 'Delivered',
    total: 75.0,
    items: 1,
  },
  {
    id: '3456',
    customer: 'Alice Brown',
    email: 'alice@example.com',
    date: new Date('2023-04-04'),
    status: 'Cancelled',
    total: 199.99,
    items: 4,
  },
]

export function OrdersTable() {
  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    customer: true,
    email: true,
    date: true,
    status: true,
    total: true,
    items: true,
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredOrders, setFilteredOrders] = useState(orders)

  useEffect(() => {
    const lowercasedSearch = searchTerm.toLowerCase()
    const filtered = orders.filter(
      order =>
        order.id.toLowerCase().includes(lowercasedSearch) ||
        order.customer.toLowerCase().includes(lowercasedSearch) ||
        order.email.toLowerCase().includes(lowercasedSearch) ||
        order.status.toLowerCase().includes(lowercasedSearch),
    )
    setFilteredOrders(filtered)
  }, [searchTerm])

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
          className="max-w-sm bg-white"
        />
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
              {visibleColumns.customer && <TableHead>Customer</TableHead>}
              {visibleColumns.email && <TableHead>Email</TableHead>}
              {visibleColumns.date && <TableHead>Date</TableHead>}
              {visibleColumns.status && <TableHead>Status</TableHead>}
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
            {filteredOrders.map(order => (
              <TableRow key={order.id}>
                {visibleColumns.id && (
                  <TableCell className="font-medium">{order.id}</TableCell>
                )}
                {visibleColumns.customer && (
                  <TableCell>{order.customer}</TableCell>
                )}
                {visibleColumns.email && <TableCell>{order.email}</TableCell>}
                {visibleColumns.date && (
                  <TableCell>{formatDate(order.date)}</TableCell>
                )}
                {visibleColumns.status && (
                  <TableCell>
                    <OrderStatusBadge status={order.status} />
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
  let color:
    | 'outline'
    | 'secondary'
    | 'destructive'
    | 'default'
    | null
    | undefined = 'default'
  switch (status.toLowerCase()) {
    case 'processing':
      color = 'outline'
      break
    case 'shipped':
      color = 'secondary'
      break
    case 'delivered':
      color = 'default'
      break
    case 'cancelled':
      color = 'destructive'
      break
  }
  return <Badge variant={color}>{status}</Badge>
}
