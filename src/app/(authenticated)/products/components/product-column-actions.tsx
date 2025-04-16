import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ProductSalesRow } from '@/types/Product'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import React, { use } from 'react'
import ProductForm from './product-form'
import { useProductContext } from '../products-context'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { productActions } from '../product-actions'

export default function ProductColumnActions({
  product,
}: {
  product: ProductSalesRow
}) {
  const {
    setFormIsOpen,
    setArchiveIsOpen,
    setRecoverIsOpen,
    setSelectedProduct,
  } = useProductContext()

  return (
    <div className="flex">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0 mx-auto">
            <span className="sr-only">Open menu</span>
            <DotsHorizontalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              setFormIsOpen(true)
              setSelectedProduct(product)
            }}>
            Edit Product
          </DropdownMenuItem>
          {!product?.is_archived ? (
            <DropdownMenuItem
              onClick={() => {
                setArchiveIsOpen(true)
                setSelectedProduct(product)
              }}
              className="text-destructive-foreground bg-destructive">
              Archive Product
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              onClick={() => {
                setRecoverIsOpen(true)
                setSelectedProduct(product)
              }}
              className="text-destructive-foreground bg-destructive">
              Recover Product
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
