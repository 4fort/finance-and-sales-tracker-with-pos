'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Printer, Send, ShoppingBag } from 'lucide-react'
import type { Order } from '@/types/POS'
import { format } from 'date-fns'
import { useBusinessProfileContext } from '@/app/business-profile-context'
import { supabase } from '@/lib/supabase'
import { useQuery } from '@tanstack/react-query'

interface ReceiptModalProps {
  isOpen: boolean
  onClose: () => void
  order: Order | null
}

export function ReceiptModal({ isOpen, onClose, order }: ReceiptModalProps) {
  const { data: userData, isPending: userIsPending } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.auth.getUser()
        if (error) {
          console.error(error)
        }
        if (data) {
          console.log('data user', data)
          return data
        }
      } catch (error: any) {
        console.error(error)
      }
    },
  })

  const { selectedProfile } = useBusinessProfileContext()
  if (!order) return null

  const handlePrint = () => {
    window.print()
  }

  const handleEmail = () => {
    // Implement email functionality
    alert('Receipt email functionality would be implemented here')
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] print:h-full print:w-full print:max-w-full print:overflow-visible print:bg-white print:shadow-none print:border-none">
        <DialogHeader className="print:hidden">
          <DialogTitle className="text-center">Receipt</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <div className="text-center mb-4">
            <h3 className="font-bold text-xl">{selectedProfile?.shop_name}</h3>
            <p className="text-sm text-muted-foreground">
              {selectedProfile?.street}
            </p>
            <p className="text-sm text-muted-foreground">
              {selectedProfile?.city}, {selectedProfile?.state}{' '}
              {selectedProfile?.zip_code}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Served by <strong>{userData?.user?.user_metadata.name}</strong>
            </p>
          </div>

          <div className="flex justify-between text-sm mb-2">
            <span>Order #:</span>
            <span>{order.id}</span>
          </div>

          <div className="flex justify-between text-sm mb-4">
            <span>Date:</span>
            <span>{format(new Date(order.date), 'MMM dd, yyyy h:mm a')}</span>
          </div>

          <Separator className="my-2" />

          <ScrollArea className="h-[200px] my-4 print:h-auto print:max-h-none print:overflow-visible">
            <div className="space-y-2">
              {order.items.map(item => (
                <div
                  key={item.product.product_id}
                  className="flex justify-between text-sm">
                  <div>
                    <div>{item.product.product_name}</div>
                    <div className="text-xs text-muted-foreground">
                      {item.quantity} x{' '}
                      {item.product.unit_price.toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'PHP',
                      })}
                    </div>
                  </div>
                  <div className="font-medium">
                    {(item.quantity * item.product.unit_price).toLocaleString(
                      'en-US',
                      {
                        style: 'currency',
                        currency: 'PHP',
                      },
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <Separator className="my-2" />

          <div className="space-y-1 mt-4">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>
                {order.subtotal.toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'PHP',
                })}
              </span>
            </div>
            {/* <div className="flex justify-between text-sm">
              <span>Tax (12%)</span>
              <span>${order.tax.toFixed(2)}</span>
            </div> */}
            <Separator className="my-2" />
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>
                {order.total.toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'PHP',
                })}
              </span>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span>Payment Method</span>
              <span className="capitalize">{order.paymentMethod}</span>
            </div>
            {order.paymentMethod === 'cash' && (
              <>
                <div className="flex justify-between text-sm">
                  <span>Amount Paid</span>
                  <span>
                    {order.amountPaid.toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'PHP',
                    })}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Change</span>
                  <span>
                    {order.change.toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'PHP',
                    })}
                  </span>
                </div>
              </>
            )}
          </div>

          <div className="text-center mt-6 text-sm text-muted-foreground">
            <p>Thank you for your purchase!</p>
            <p>Please come again</p>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 print:hidden">
          <Button variant="outline" className="w-full" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          {/* <Button variant="outline" className="w-full" onClick={handleEmail}>
            <Send className="mr-2 h-4 w-4" />
            Email
          </Button> */}
          <Button className="w-full" onClick={onClose}>
            <ShoppingBag className="mr-2 h-4 w-4" />
            New Sale
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
