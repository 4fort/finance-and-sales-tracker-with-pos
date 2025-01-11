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
import { Order } from '@/types/User'
import { MoreHorizontal, Eye, Edit, Trash, Send } from 'lucide-react'
import { Orders } from './page'

export function OrderActions({ order }: { order: Orders }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(order.id)}>
          Copy Order ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Eye className="mr-2 h-4 w-4" />
          View details
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Edit className="mr-2 h-4 w-4" />
          Edit order
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Send className="mr-2 h-4 w-4" />
          Send invoice
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-600">
          <Trash className="mr-2 h-4 w-4" />
          Delete order
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
