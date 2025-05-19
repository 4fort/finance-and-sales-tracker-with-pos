'use client'

import type { OrderItem } from '@/types/POS'
import { Button } from '@/components/ui/button'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

interface OrderSummaryProps {
  items: OrderItem[]
  onUpdateQuantity: (productId: number, quantity: number) => void
  onRemoveItem: (productId: number) => void
  totals: {
    subtotal: number
    total: number
  }
}

export function OrderSummary({
  items,
  onUpdateQuantity,
  onRemoveItem,
  totals,
}: OrderSummaryProps) {
  const { subtotal, total } = totals
  const isEmpty = items.length === 0

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold">Current Order</h2>
        <p className="text-muted-foreground text-sm">
          {isEmpty
            ? 'No items in cart'
            : `${items.length} item${items.length !== 1 ? 's' : ''}`}
        </p>
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center flex-1 p-4 text-muted-foreground">
          <p className="mb-2 text-lg">Your cart is empty</p>
          <p className="text-sm text-center">
            Add products from the catalog to start a new order
          </p>
        </div>
      ) : (
        <>
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {items.map(item => (
                <div
                  key={item.product.product_id}
                  className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium">{item.product.product_name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.product.unit_price.toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'PHP',
                      })}{' '}
                      each
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="flex items-center border rounded-md">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-none"
                        onClick={() => {
                          if (item.quantity <= 0) {
                            return
                          }
                          onUpdateQuantity(
                            item.product.product_id,
                            item.quantity - 1,
                          )
                        }}>
                        <Minus className="h-4 w-4" />
                      </Button>
                      {/* <span className="w-8 text-center">{item.quantity}</span> */}
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={e => {
                          if (e.target.value === '') {
                            return
                          }
                          if (
                            parseInt(e.target.value) >
                            item.product.quantity_in_stock
                          ) {
                            e.target.value = String(
                              item.product.quantity_in_stock,
                            )
                          }

                          onUpdateQuantity(
                            item.product.product_id,
                            Number(e.target.value),
                          )
                        }}
                        onBlur={e => {
                          if (e.target.value === '') {
                            onUpdateQuantity(item.product.product_id, 0)
                          }
                        }}
                        onFocus={e => {
                          e.target.select()
                        }}
                        className="text-center border-none focus:ring-0 focus-visible:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        min={1}
                        max={item.product.quantity_in_stock}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-none"
                        onClick={() => {
                          if (item.quantity >= item.product.quantity_in_stock) {
                            return
                          }
                          onUpdateQuantity(
                            item.product.product_id,
                            item.quantity + 1,
                          )
                        }}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => onRemoveItem(item.product.product_id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="p-4 border-t">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>
                  {subtotal.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'PHP',
                  })}
                </span>
              </div>
              {/* <div className="flex justify-between">
                <span>Tax (12%)</span>
                <span>${tax.toFixed(2)}</span>
              </div> */}
              <Separator className="my-2" />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>
                  {total.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'PHP',
                  })}
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
