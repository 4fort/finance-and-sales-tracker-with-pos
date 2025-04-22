'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { IncomeSalesRowType } from '@/types/Income'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { ColumnDef } from '@tanstack/react-table'
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Banknote,
  CreditCard,
  SmartphoneNfc,
} from 'lucide-react'
import SalesColumnActions from './components/sales-column-actions'

export const salesColumns: ColumnDef<IncomeSalesRowType>[] = [
  {
    id: 'icon',
    cell: ({ row }) => {
      const paymentMethod = row.getValue('payment_method') as string
      const nonCashMethods = ['gcash', 'grabpay', 'paymaya', 'paypal']
      const cardMethods = [
        'credit_card',
        'debit_card',
        'card',
        'credit',
        'debit',
      ]
      return (
        <div className="flex items-center justify-center py-4">
          <span className="rounded-lg bg-neutral-700 text-white h-auto p-1.5 aspect-square">
            {nonCashMethods.includes(paymentMethod) ? (
              <SmartphoneNfc strokeWidth={1.5} className="h-8 w-8 m-auto" />
            ) : cardMethods.includes(paymentMethod) ? (
              <CreditCard strokeWidth={1.5} className="h-8 w-8 m-auto" />
            ) : (
              <Banknote strokeWidth={1.5} className="h-8 w-8 m-auto" />
            )}
          </span>
        </div>
      )
    },
    size: 50,
  },
  {
    accessorKey: 'id',
    header: 'ID',
    size: 50,
  },
  {
    accessorKey: 'payment_method',
    header: ({ column }) => (
      <Button
        onClick={() => column.toggleSorting()}
        variant="ghost"
        className="w-full">
        Payment Method
        {column.getIsSorted() === 'asc' ? (
          <ArrowDown className="ml-2 h-4 w-4" />
        ) : column.getIsSorted() === 'desc' ? (
          <ArrowUp className="ml-2 h-4 w-4" />
        ) : (
          <ArrowUpDown className="ml-2 h-4 w-4" />
        )}{' '}
      </Button>
    ),
    cell: ({ row }) => {
      const paymentMethod = row.getValue('payment_method') as string
      return <div className="capitalize">{paymentMethod}</div>
    },
  },
  {
    accessorKey: 'customer_name',
    header: 'Customer Name',
    cell: ({ row }) => {
      const customerName = row.getValue('customer_name') as string
      return <div>{customerName}</div>
    },
  },
  {
    accessorKey: 'total_amount',
    header: ({ column }) => (
      <Button
        onClick={() => column.toggleSorting()}
        variant="ghost"
        className="w-full">
        Total Amount
        {column.getIsSorted() === 'asc' ? (
          <ArrowDown className="ml-2 h-4 w-4" />
        ) : column.getIsSorted() === 'desc' ? (
          <ArrowUp className="ml-2 h-4 w-4" />
        ) : (
          <ArrowUpDown className="ml-2 h-4 w-4" />
        )}{' '}
      </Button>
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('total_amount'))
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'PHP',
      }).format(amount)
      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: 'paid_amount',
    header: ({ column }) => (
      <Button
        onClick={() => column.toggleSorting()}
        variant="ghost"
        className="w-full">
        Paid Amount
        {column.getIsSorted() === 'asc' ? (
          <ArrowDown className="ml-2 h-4 w-4" />
        ) : column.getIsSorted() === 'desc' ? (
          <ArrowUp className="ml-2 h-4 w-4" />
        ) : (
          <ArrowUpDown className="ml-2 h-4 w-4" />
        )}{' '}
      </Button>
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('paid_amount'))
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'PHP',
      }).format(amount)
      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: 'change',
    header: ({ column }) => <div className="w-full text-center">Change</div>,
    cell: ({ row }) => {
      const amount =
        parseFloat(row.getValue('paid_amount')) -
        parseFloat(row.getValue('total_amount'))
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'PHP',
      }).format(amount)
      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => (
      <Button
        onClick={() => column.toggleSorting()}
        variant="ghost"
        className="w-full">
        Date
        {column.getIsSorted() === 'asc' ? (
          <ArrowDown className="ml-2 h-4 w-4" />
        ) : column.getIsSorted() === 'desc' ? (
          <ArrowUp className="ml-2 h-4 w-4" />
        ) : (
          <ArrowUpDown className="ml-2 h-4 w-4" />
        )}{' '}
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue('created_at'))
      return (
        <div className="text-center">
          {date.toLocaleDateString()}
          {', '}
          {date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      )
    },
  },
  {
    accessorKey: 'items',
    header: () => <div className="text-center">Items</div>,
    cell: ({ row }) => {
      const _items = row.getValue('items') as any[]
      const items = _items.slice(0, 3)
      if (!items || items.length === 0) {
        return <div className="text-center">No items</div>
      }
      return (
        <div className="flex flex-col">
          {items.map(item => (
            <div key={item.product_id} className="flex justify-between">
              <span>
                {item.product_name} x {item.quantity}
              </span>
              <span>
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'PHP',
                }).format(item.subtotal)}
              </span>
            </div>
          ))}
          {_items.length > 3 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="link" className="justify-start">
                  {_items.length - 3} more
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuLabel>Items</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {_items.slice(3).map(item => (
                  <DropdownMenuItem key={item.product_id}>
                    <div className="flex flex-col">
                      {item.product_name} x {item.quantity}
                      <span className="text-xs text-muted-foreground">
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'PHP',
                        }).format(item.subtotal)}
                      </span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      )
    },
    size: 250,
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const sale = row.original

      return <SalesColumnActions sale={sale} />
    },
    size: 100,
  },
]
