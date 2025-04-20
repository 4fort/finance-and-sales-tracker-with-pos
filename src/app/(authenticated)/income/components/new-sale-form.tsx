'use client'

import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useIncomeContext } from '../income-context'
import { Button } from '@/components/ui/button'
import { Info } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import RequiredFieldSymbol from '@/components/require-field-symbol'
import { ControllerRenderProps, UseFormReturn, useForm } from 'react-hook-form'
import { AddSale, newSaleFormSchema } from '../schema/new-sale-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { CurrencyInput } from '@/components/ui/currency-input'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { productActions } from '../../products/product-actions'
import { cn } from '@/lib/utils'
import { ProductSalesRow } from '@/types/Product'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ScrollArea } from '@/components/ui/scroll-area'
import { AddSalePayload } from '@/types/Income'
import { incomeActions } from '../income-actions'

export default function NewSaleForm() {
  const queryClient = useQueryClient()

  const { newSaleFormOpen, setNewSaleFormOpen } = useIncomeContext()
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false)
  const [isConfirmedForNow, setIsConfirmedForNow] = useState(false)

  const form = useForm<AddSale>({
    resolver: zodResolver(newSaleFormSchema),
    defaultValues: {
      customer_name: '',
      total_amount: '' as unknown as number,
      paid_amount: '' as unknown as number,
      payment_method: '',
      items: [],
    },
  })

  const {
    mutateAsync: newIncomeSaleMutation,
    isPending: newIncomeSaleIsPending,
  } = useMutation({
    mutationFn: async (payload: Omit<AddSalePayload, 'user_id'>) => {
      const data = await incomeActions.addSale(payload)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['income_stats'],
      })
      queryClient.invalidateQueries({
        queryKey: ['income_chart'],
      })
      queryClient.invalidateQueries({
        queryKey: ['user_sales'],
      })
      queryClient.invalidateQueries({
        queryKey: ['products'],
      })
      setNewSaleFormOpen(false)
      form.reset()
    },
    onError: error => {
      console.error(error)
    },
  })

  const onSubmit = async (values: AddSale) => {
    const items = values.items.filter(item => item.product_id)
    const payload = {
      ...values,
      items: items.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
      })),
    }

    newIncomeSaleMutation(payload)
  }

  const items = form.getValues('items')
  const [totalAmountFomatted, setTotalAmountFomatted] = useState('')

  useEffect(() => {
    const totalAmount = items
      .map(item => item?.quantity * item?.unit_price)
      .reduce((acc, curr) => acc + (curr || 0), 0)

    const totalAmountFormatted = totalAmount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'PHP',
    })

    form.setValue('total_amount', totalAmount)

    setTotalAmountFomatted(totalAmountFormatted)
  }, [form.watch('items')])

  return (
    <Dialog open={newSaleFormOpen} onOpenChange={setNewSaleFormOpen}>
      <DialogContent
        className={cn(
          isConfirmedForNow &&
            isCheckboxChecked &&
            'max-w-7xl h-[80%] max-h-[80%] overflow-clip',
        )}>
        {isConfirmedForNow && isCheckboxChecked ? (
          <>
            <DialogHeader className="shrink">
              <DialogTitle>New Income Sale Record</DialogTitle>
              <DialogDescription>
                Fields marked with (<RequiredFieldSymbol />) are required
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col flex-grow overflow-hidden">
              <Form {...form}>
                <form
                  id="new-sale-form"
                  className="grid grid-cols-2 gap-4 h-full"
                  onSubmit={form.handleSubmit(onSubmit)}>
                  <div className="flex flex-col space-y-4">
                    <FormField
                      control={form.control}
                      name="customer_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Customer Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter customer name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="paid_amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Paid Amount <RequiredFieldSymbol />
                          </FormLabel>
                          <FormControl>
                            <CurrencyInput
                              type="string"
                              placeholder="0.00"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="payment_method"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Payment Method</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter payment method"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex flex-col flex-grow min-h-0">
                    <FormLabel>Items</FormLabel>
                    <div className="flex-grow h-full min-h-0">
                      <ItemsSelection form={form} />
                    </div>
                  </div>
                </form>
              </Form>
            </div>
            <DialogFooter className="shrink">
              <div className="w-96 grid grid-cols-2">
                <span>Total Amount</span>
                <span>{totalAmountFomatted}</span>
              </div>
              {isConfirmedForNow && isCheckboxChecked && (
                <Button
                  type="submit"
                  form="new-sale-form"
                  disabled={newIncomeSaleIsPending}>
                  Submit
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => {
                  setNewSaleFormOpen(false)
                  setIsConfirmedForNow(false)
                }}
                disabled={newIncomeSaleIsPending}>
                Cancel
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription className="flex items-center space-x-2 text-amber-700 bg-amber-100 border border-amber-400 p-2 rounded-md">
                <Info className="w-6 self-start" />
                <span>
                  This form is only used when you want to manually add a sale
                  record. You must proceed with caution.
                </span>
              </DialogDescription>
            </DialogHeader>
            <div className="">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="confirm-for-now"
                  checked={isCheckboxChecked}
                  onCheckedChange={checked => setIsCheckboxChecked(!!checked)}
                />
                <label
                  htmlFor="confirm-for-now"
                  className="text-sm text-muted-foreground select-none">
                  I understand the consequences of this action.
                </label>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="destructive"
                disabled={!isCheckboxChecked}
                onClick={() => {
                  setIsConfirmedForNow(true)
                }}>
                Confirm for now
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsConfirmedForNow(false)
                }}>
                Cancel
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

function ItemsSelection({ form }: { form: UseFormReturn<AddSale> }) {
  const { data, isPending } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const data = await productActions.getAll()
      return data
    },
  })
  const products = data?.products || ([] as ProductSalesRow[])

  return (
    <ScrollArea className="col-span-2 min-h-0 h-[inherit] max-h-full">
      {isPending ? (
        <p>Loading...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product Name</TableHead>
              <TableHead>Unit Price</TableHead>
              <TableHead>Stocks</TableHead>
              <TableHead>Quantity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <FormField
              control={form.control}
              name="items"
              render={() => (
                <>
                  {products.map(product => (
                    <FormField
                      key={product.product_id}
                      control={form.control}
                      name={'items'}
                      render={({ field }) => (
                        <Item field={field} product={product} />
                      )}
                    />
                  ))}
                </>
              )}
            />
          </TableBody>
        </Table>
      )}
    </ScrollArea>
  )
}

function Item({
  field,
  product,
}: {
  field: ControllerRenderProps<AddSale, 'items'>
  product: ProductSalesRow
}) {
  //   const [isChecked, setIsChecked] = useState(false)
  const [quantity, setQuantity] = useState<string>('')

  const availableStocks = product.quantity_in_stock - product.sold_quantity
  const isAvailable = availableStocks > 0

  const isChecked = field.value.some(
    item => item.product_id === product.product_id,
  )

  return (
    <TableRow>
      <TableCell className="flex items-center">
        <FormItem key={product.product_id}>
          <FormControl>
            <Checkbox
              disabled={!isAvailable}
              checked={isChecked}
              onCheckedChange={checked => {
                setQuantity(checked ? '1' : '')
                return checked
                  ? field.onChange([
                      ...field.value,
                      {
                        product_id: product.product_id,
                        unit_price: product.unit_price,
                        quantity: 1,
                      },
                    ])
                  : field.onChange(
                      field.value.filter(
                        item => item.product_id !== product.product_id,
                      ),
                    )
              }}
            />
          </FormControl>
          <FormLabel className="ml-2 cursor-pointer text-sm font-medium select-none">
            {product.product_name}
          </FormLabel>
        </FormItem>
      </TableCell>
      <TableCell>
        {product.unit_price.toLocaleString('en-US', {
          style: 'currency',
          currency: 'PHP',
        })}
      </TableCell>
      <TableCell>
        <div>
          <span
            className={cn(
              'text-sm font-medium',
              isAvailable ? 'text-green-500' : 'text-red-500',
            )}>
            {availableStocks}
          </span>
          <span className="text-xs text-muted-foreground">
            {' '}
            / {product.quantity_in_stock}
          </span>
        </div>
        <span className="text-xs text-muted-foreground">
          {' '}
          {isAvailable ? 'Available' : 'Out of stock'}
        </span>
        <span className="text-xs text-muted-foreground">
          {' '}
          {product.sold_quantity > 0 ? `(${product.sold_quantity} sold)` : ''}
        </span>
      </TableCell>
      <TableCell>
        <Input
          type="string"
          placeholder="Quantity"
          disabled={!isChecked}
          value={quantity}
          className="w-20"
          onKeyDown={e => {
            if (e.key === '-' || e.key === 'e' || e.key === '.') {
              e.preventDefault()
            }
          }}
          onChange={e => {
            const value = e.target.value
            const quantity = parseInt(value)
            if (isNaN(quantity) || quantity < 1) {
              setQuantity('')
              return
            }
            if (quantity > availableStocks) {
              setQuantity(availableStocks.toString())
              field.onChange(
                field.value.map(item =>
                  item.product_id === product.product_id
                    ? { ...item, quantity: availableStocks }
                    : item,
                ),
              )
              return
            }
            if (quantity > 0) {
              setQuantity(quantity.toString())
              field.onChange(
                field.value.map(item =>
                  item.product_id === product.product_id
                    ? { ...item, quantity }
                    : item,
                ),
              )
              return
            }
          }}
          onBlur={e => {
            const value = e.target.value
            if (value === '') {
              setQuantity('')
              console.log(quantity)
              field.onChange(
                field.value.filter(
                  item => item.product_id !== product.product_id,
                ),
              )
              return
            }
          }}
        />
      </TableCell>
      <FormMessage />
    </TableRow>
  )
}
