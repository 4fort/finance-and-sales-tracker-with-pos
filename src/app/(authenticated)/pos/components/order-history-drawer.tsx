'use client'

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, ShoppingBag, Clock, ArrowUpDown } from 'lucide-react'
import type { Order } from '@/types/POS'
import { format } from 'date-fns'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'

interface OrderHistoryDrawerProps {
  isOpen: boolean
  onClose: () => void
  orders: Order[]
}

export function OrderHistoryDrawer({
  isOpen,
  onClose,
  orders,
}: OrderHistoryDrawerProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest')

  const filteredOrders = orders
    .filter(
      order =>
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.items.some(item =>
          item.product.product_name
            .toLowerCase()
            .includes(searchQuery.toLowerCase()),
        ),
    )
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB
    })

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader className="mb-4">
          <SheetTitle className="text-xl">Order History</SheetTitle>
          <SheetDescription>
            View and search your recent transactions
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {filteredOrders.length}{' '}
              {filteredOrders.length === 1 ? 'order' : 'orders'} found
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleSortOrder}
              className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>
                {sortOrder === 'newest' ? 'Newest first' : 'Oldest first'}
              </span>
              <ArrowUpDown className="h-3 w-3 ml-1" />
            </Button>
          </div>

          <ScrollArea className="h-[calc(100vh-220px)]">
            <div className="space-y-4">
              {filteredOrders.length > 0 ? (
                filteredOrders.map(order => (
                  <div key={order.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-medium">{order.id}</div>
                        <div className="text-sm text-muted-foreground">
                          {format(new Date(order.date), 'MMM dd, yyyy h:mm a')}
                        </div>
                      </div>
                      {/* <Badge
                        variant={
                          order.status === 'completed'
                            ? 'default'
                            : 'destructive'
                        }
                        className="capitalize">
                        {order.status}
                      </Badge> */}
                    </div>

                    <div className="space-y-1 my-3 text-sm">
                      {order.items.map(item => (
                        <div
                          key={item.product.product_id}
                          className="flex justify-between">
                          <span>
                            {item.quantity}x {item.product.product_name}
                          </span>
                          <span>
                            {(
                              item.quantity * item.product.unit_price
                            ).toLocaleString('en-US', {
                              style: 'currency',
                              currency: 'PHP',
                            })}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between font-medium pt-2 border-t">
                      <div className="flex items-center">
                        <span>Total</span>
                        <Badge variant="outline" className="ml-2 capitalize">
                          {order.paymentMethod}
                        </Badge>
                      </div>
                      <span>
                        {order.total.toLocaleString('en-US', {
                          style: 'currency',
                          currency: 'PHP',
                        })}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                  <ShoppingBag className="h-12 w-12 mb-2 opacity-20" />
                  <p>No orders found</p>
                  <p className="text-sm">Try adjusting your search</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        <div className="mt-6">
          <SheetClose asChild>
            <Button variant="outline" className="w-full">
              Close
            </Button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  )
}
