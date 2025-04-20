import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  ProductsTable,
  newProductFormSchema,
} from '../schema/new-product-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import RequiredFieldSymbol from '@/components/require-field-symbol'
import {
  QueryCache,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { productActions } from '../product-actions'
import { GetProductSalesSummaryResponse } from '@/types/Product'
import { useProductContext } from '../products-context'
import { CurrencyInput } from '@/components/ui/currency-input'

export default function ProductForm() {
  const queryClient = useQueryClient()
  const {
    formIsOpen: open,
    setFormIsOpen: setOpen,
    selectedProduct,
  } = useProductContext()

  const isUpdate = !!selectedProduct

  const form = useForm<ProductsTable>({
    resolver: zodResolver(newProductFormSchema),
    defaultValues: {
      name: '',
      sku: '',
      unit_price: '' as unknown as number,
      cost_price: '' as unknown as number,
      quantity: '' as unknown as number,
      category_id: '' as unknown as undefined,
    },
    values: {
      name: selectedProduct?.product_name ?? '',
      sku: selectedProduct?.sku ?? '',
      unit_price: selectedProduct?.unit_price ?? ('' as unknown as number),
      cost_price: selectedProduct?.cost_price ?? ('' as unknown as number),
      quantity: selectedProduct?.quantity_in_stock ?? ('' as unknown as number),
      category_id: '' as unknown as undefined,
    },
  })

  const { mutateAsync: newProductMutation, isPending: isNewProductSubmitting } =
    useMutation({
      mutationFn: async ({ productData }: { productData: ProductsTable }) => {
        const data = await productActions.add(productData)
        form.reset()
        return data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['products'] })
        setOpen(false)
      },
    })

  const {
    mutateAsync: updateProductMutation,
    isPending: isUpdateProductSubmitting,
  } = useMutation({
    mutationFn: async ({
      productData,
      productId,
    }: {
      productData: ProductsTable
      productId: number
    }) => {
      if (!selectedProduct) return
      const data = await productActions.update(
        productData,
        selectedProduct.product_id,
      )
      form.reset()
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      setOpen(false)
    },
  })

  async function onSubmit(values: ProductsTable) {
    if (isUpdate) {
      await updateProductMutation({
        productData: values,
        productId: selectedProduct.product_id,
      })
    } else {
      await newProductMutation({ productData: values })
    }
  }

  const { data: categories, isPending } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const data = await productActions.getCategories()
      return data
    },
  })

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>New Product</DialogTitle>
            <DialogDescription>
              Fields marked with (<RequiredFieldSymbol />) are required
            </DialogDescription>
          </DialogHeader>
          <div className="">
            {isPending ? (
              <div className="">Loading...</div>
            ) : (
              <>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Product Name <RequiredFieldSymbol />
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Product Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="sku"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SKU</FormLabel>
                          <FormControl>
                            <Input placeholder="SKU" {...field} />
                          </FormControl>
                          <FormDescription>
                            SKU is a unique identifier for the product.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="unit_price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Unit Price <RequiredFieldSymbol />
                          </FormLabel>
                          <FormControl>
                            <CurrencyInput
                              type="string"
                              placeholder="0.00"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Unit price is the selling price of the product.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="cost_price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Cost Price <RequiredFieldSymbol />
                          </FormLabel>
                          <FormControl>
                            <CurrencyInput
                              type="string"
                              placeholder="0.00"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Cost price is the purchase price of the product from
                            supplier.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Quantity in Stock <RequiredFieldSymbol />
                          </FormLabel>
                          <FormControl>
                            <Input type="string" placeholder="0" {...field} />
                          </FormControl>
                          <FormDescription>
                            Quantity in stock is the number of items available
                            for sale.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* <FormField
                      control={form.control}
                      name="category_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select
                            onValueChange={value =>
                              field.onChange(parseInt(value))
                            }
                            defaultValue={String(field.value)}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories?.map(category => (
                                <SelectItem
                                  key={category.id}
                                  value={String(category.id)}>
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    /> */}
                    <DialogFooter>
                      <Button
                        type="submit"
                        disabled={
                          isNewProductSubmitting || isUpdateProductSubmitting
                        }>
                        {isUpdate ? 'Update' : 'Create'} Product
                      </Button>
                      <Button
                        variant="outline"
                        type="button"
                        onClick={() => setOpen(false)}
                        disabled={
                          isNewProductSubmitting || isUpdateProductSubmitting
                        }>
                        Cancel
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
