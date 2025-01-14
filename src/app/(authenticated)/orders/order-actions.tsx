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
import { MoreHorizontal, Edit, Trash } from 'lucide-react'
import { Orders } from './page'
import { UpdateOrderDialog } from '@/components/Orders/UpdateOrderDialog'
import { useState } from 'react'
import axios from '@/lib/axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export function OrderActions({ order }: { order: Orders }) {
  const deleteOrder = async () => {
    try {
      const response = await supabase.from('orders').delete().eq('id', order.id)
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
          onClick={() => navigator.clipboard.writeText(order.id.toString())}>
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
          onClick={async () => await deleteOrderMutation()}>
          <Trash className="mr-2 h-4 w-4" />
          Delete order
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
