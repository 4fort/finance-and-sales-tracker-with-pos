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
import { Item } from '@/types/Income'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { ColumnDef } from '@tanstack/react-table'

export const itemsColumns: ColumnDef<Item>[] = [
  {
    accessorKey: 'sales_item_id',
    header: 'ID',
    size: 50,
  },
  {
    accessorKey: 'sales_id',
    header: 'Sales ID',
    size: 50,
  },
  {
    accessorKey: 'product_name',
    header: 'Product Name',
    size: 200,
  },
  {
    accessorKey: 'product_id',
    header: () => <div className="text-center">Product ID</div>,
    cell: ({ row }) => {
      const productId = row.getValue('product_id') as number
      return <div className="text-center">{productId}</div>
    },
    size: 100,
  },
  {
    accessorKey: 'product_sku',
    header: () => <div className="text-center">Product SKU</div>,
    cell: ({ row }) => {
      const sku = row.getValue('product_sku') as string
      return <div className="text-center">{sku}</div>
    },
    size: 100,
  },
  {
    accessorKey: 'quantity',
    header: () => <div className="text-center">Quantity</div>,
    cell: ({ row }) => {
      const quantity = row.getValue('quantity') as number
      return <div className="text-right font-medium">{quantity}</div>
    },
    size: 100,
  },
  {
    accessorKey: 'unit_price',
    header: () => <div className="text-center">Unit Price</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('unit_price'))
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'PHP',
      }).format(amount)

      return <div className="text-right font-medium">{formatted}</div>
    },
    size: 200,
  },
  {
    accessorKey: 'subtotal',
    header: () => <div className="text-center">Subtotal</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('subtotal'))
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'PHP',
      }).format(amount)

      return <div className="text-right font-medium">{formatted}</div>
    },
    size: 200,
  },
  {
    accessorKey: 'sales_created_at',
    header: 'Date',
    cell: ({ row }) => {
      const date = new Date(row.getValue('sales_created_at'))
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
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const item = row.original

      return (
        <div className="flex">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 mx-auto">
                <span className="sr-only">Open menu</span>
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  navigator.clipboard.writeText(item.sales_item_id.toString())
                }}>
                Copy ID
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  navigator.clipboard.writeText(item.sales_id.toString())
                }}>
                Copy Sales ID
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  navigator.clipboard.writeText(item.product_id.toString())
                }}>
                Copy Product ID
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  navigator.clipboard.writeText(item.product_sku.toString())
                }}>
                Copy Product SKU
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
    size: 100,
  },
]
