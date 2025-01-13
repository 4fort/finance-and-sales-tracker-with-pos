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
import { UpdateOrderDialog } from '@/components/Orders/UpdateOrderDialog'
import { useState } from 'react'
import axios from '@/lib/axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function OrderActions({ order }: { order: Orders }) {
  const deleteOrder = async () => {
    try {
      const csrf = async () => {
        await axios.get('/sanctum/csrf-cookie')
      }
      const baseUrl = `/api/v1/orders/delete?order_id=${order.id}}`

      await csrf()
      const res = await axios.delete(baseUrl)
      console.log(res)
    } catch (error) {
      console.error(error)
    }
  }
  const queryClient = useQueryClient()
  const { mutateAsync: deleteOrderMutation } = useMutation({
    mutationFn: deleteOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })
  const [openDialog, setOpenDialog] = useState(false)
  return (
    <DropdownMenu>
      <UpdateOrderDialog
        order={order}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
      />
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
        <DropdownMenuItem onClick={() => setOpenDialog(true)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit order
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-600"
          onClick={deleteOrderMutation}>
          <Trash className="mr-2 h-4 w-4" />
          Delete order
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
