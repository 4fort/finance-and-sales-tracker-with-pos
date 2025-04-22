'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import type { PaymentMethod } from '@/types/POS'
import { CreditCard, DollarSign, Smartphone } from 'lucide-react'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  orderTotal: number
  onProcessPayment: (paymentMethod: PaymentMethod, amountPaid: number) => void
  newIncomeSaleIsPending: boolean
}

export function PaymentModal({
  isOpen,
  onClose,
  orderTotal,
  onProcessPayment,
  newIncomeSaleIsPending,
}: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash')
  const [amountPaid, setAmountPaid] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  const handleAmountChange = (value: string) => {
    // Allow only numbers and decimal point
    if (/^\d*\.?\d{0,2}$/.test(value) || value === '') {
      setAmountPaid(value)
      setError(null)
    }
  }

  const handlePayment = () => {
    const amount = Number.parseFloat(amountPaid)

    if (isNaN(amount)) {
      setError('Please enter a valid amount')
      return
    }

    if (paymentMethod === 'cash' && amount < orderTotal) {
      setError('Amount paid must be at least the total amount')
      return
    }

    onProcessPayment(paymentMethod, amount)
    setAmountPaid('')
  }

  const calculateChange = () => {
    const amount = Number.parseFloat(amountPaid)
    if (isNaN(amount)) return 0
    return Math.max(0, amount - orderTotal)
  }

  const resetForm = () => {
    setPaymentMethod('cash')
    setAmountPaid('')
    setError(null)
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={open => {
        if (!open) {
          onClose()
          resetForm()
        }
      }}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Payment</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <div className="mb-6 text-center">
            <p className="text-muted-foreground">Total Amount</p>
            <p className="text-3xl font-bold">
              {orderTotal.toLocaleString('en-US', {
                style: 'currency',
                currency: 'PHP',
              })}
            </p>
          </div>

          <Tabs
            defaultValue="cash"
            onValueChange={value => setPaymentMethod(value as PaymentMethod)}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="cash" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Cash
              </TabsTrigger>
              <TabsTrigger value="card" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Card
              </TabsTrigger>
              <TabsTrigger value="gcash" className="flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                Digital
              </TabsTrigger>
            </TabsList>

            <TabsContent value="cash">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="amount-paid">Amount Received</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      ₱
                    </span>
                    <Input
                      id="amount-paid"
                      value={amountPaid}
                      onChange={e => handleAmountChange(e.target.value)}
                      className="pl-8"
                      placeholder="0.00"
                    />
                  </div>
                  {error && <p className="text-sm text-destructive">{error}</p>}
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span>Total</span>
                    <span>
                      {orderTotal.toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'PHP',
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span>Amount Received</span>
                    <span>
                      {Number.parseFloat(amountPaid || '0').toLocaleString(
                        'en-US',
                        {
                          style: 'currency',
                          currency: 'PHP',
                        },
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold mt-2 pt-2 border-t">
                    <span>Change</span>
                    <span>
                      {calculateChange().toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'PHP',
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="card">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="card-number">Card Number</Label>
                  <Input id="card-number" placeholder="**** **** **** ****" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input id="expiry" placeholder="MM/YY" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input id="cvv" placeholder="***" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="card-name">Cardholder Name</Label>
                  <Input id="card-name" placeholder="Name on card" />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="gcash">
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center"
                    disabled={newIncomeSaleIsPending}>
                    <Smartphone className="h-6 w-6 mb-1" />
                    GCash
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center"
                    disabled={newIncomeSaleIsPending}>
                    <Smartphone className="h-6 w-6 mb-1" />
                    GrabPay
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center"
                    disabled={newIncomeSaleIsPending}>
                    <Smartphone className="h-6 w-6 mb-1" />
                    PayMaya
                  </Button>
                </div>
                <div className="p-4 bg-muted rounded-lg text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    Show QR code to customer
                  </p>
                  <div className="bg-white p-4 rounded-lg mx-auto w-48 h-48 flex items-center justify-center">
                    <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center">
                      <span className="text-xs text-muted-foreground">
                        QR Code
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto"
            disabled={newIncomeSaleIsPending}>
            Cancel
          </Button>
          <Button
            onClick={handlePayment}
            className="w-full sm:w-auto"
            disabled={newIncomeSaleIsPending}>
            Complete Payment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
