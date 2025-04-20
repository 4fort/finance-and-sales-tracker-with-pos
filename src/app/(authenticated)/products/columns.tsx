'use client'

import { ColumnDef } from '@tanstack/react-table'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { ProductSalesRow } from '@/types/Product'
import { Progress } from '@/components/ui/progress'
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import ProductForm from './components/new-product-form'
import ProductColumnActions from './components/product-column-actions'

export const columns: ColumnDef<ProductSalesRow>[] = [
  {
    accessorKey: 'product_id',
    header: 'ID',
    size: 50,
  },
  {
    accessorKey: 'product_name',
    header: 'Product Name',
    size: 200,
  },
  {
    accessorKey: 'sku',
    header: 'SKU',
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
    accessorKey: 'cost_price',
    header: () => <div className="text-center">Cost Price</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('cost_price'))
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'PHP',
      }).format(amount)

      return <div className="text-right font-medium">{formatted}</div>
    },
    size: 200,
  },
  {
    accessorKey: 'quantity_in_stock',
    header: ({ column }) => (
      <Button
        onClick={() => column.toggleSorting()}
        variant="ghost"
        className="w-full">
        Stock
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
      const remainingStock = parseInt(row.getValue('quantity_in_stock'))
      const soldQuantity = parseInt(row.getValue('sold_quantity'))
      const initialStock = remainingStock + soldQuantity
      const stock = remainingStock > 0 ? remainingStock : 0
      const stockPercentage = (stock / initialStock) * 100

      return (
        <div className="px-4">
          {stock > 10 ? (
            <div className="text-center font-bold text-green-500">{stock}</div>
          ) : (
            <div className="text-center font-bold text-red-500">{stock}</div>
          )}
          <Progress value={stockPercentage} />
        </div>
      )
    },
    size: 100,
  },
  {
    accessorKey: 'sold_quantity',
    header: ({ column }) => (
      <Button
        onClick={() => column.toggleSorting()}
        variant="ghost"
        className="w-full">
        Sold
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
      return <div className="text-center">{row.getValue('sold_quantity')}</div>
    },
    size: 100,
  },
  {
    accessorKey: 'total_sales',
    header: ({ column }) => (
      <Button
        onClick={() => column.toggleSorting()}
        variant="ghost"
        className="w-full">
        Total Sales
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
      const amount = parseFloat(row.getValue('total_sales'))
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'PHP',
      }).format(amount)

      return <div className="text-right font-medium">{formatted}</div>
    },
    size: 200,
  },
  {
    accessorKey: 'total_cost',
    header: ({ column }) => (
      <Button
        onClick={() => column.toggleSorting()}
        variant="ghost"
        className="w-full">
        Total Cost
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
      const amount = parseFloat(row.getValue('total_cost'))
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'PHP',
      }).format(amount)

      return <div className="text-right font-medium">{formatted}</div>
    },
    size: 200,
  },
  {
    accessorKey: 'profit',
    header: ({ column }) => (
      <Button
        onClick={() => column.toggleSorting()}
        variant="ghost"
        className="w-full">
        Profit
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
      const amount = parseFloat(row.getValue('profit'))
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'PHP',
      }).format(amount)

      return (
        <div className="text-right text-green-500 font-medium">{formatted}</div>
      )
    },
    size: 200,
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const product = row.original

      return <ProductColumnActions product={product} />
    },
    size: 100,
  },
]
