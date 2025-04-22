'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import { AlertCircle } from 'lucide-react'
import { ProductSalesRow } from '@/types/Product'

interface ProductGridProps {
  products: ProductSalesRow[]
  onProductSelect: (product: ProductSalesRow) => void
}

export function ProductGrid({ products, onProductSelect }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
        <AlertCircle className="h-12 w-12 mb-2" />
        <p className="text-lg">No products found</p>
        <p>Try adjusting your search or category filter</p>
      </div>
    )
  }

  return (
    <div
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 overflow-y-auto pb-4 mt-4"
      style={{ maxHeight: 'calc(100vh - 220px)' }}>
      {products.map(product => {
        const status = product.quantity_in_stock
          ? product.quantity_in_stock <= 5
            ? 'low-stock'
            : 'in-stock'
          : 'out-of-stock'

        return (
          <Card
            key={product.product_id}
            className={`cursor-pointer hover:border-primary transition-colors ${
              status === 'out-of-stock' ? 'opacity-60 pointer-events-none' : ''
            }`}
            onClick={() =>
              status !== 'out-of-stock' && onProductSelect(product)
            }>
            <CardContent className="p-3 flex flex-col items-center">
              {/* <div className="relative w-full aspect-square mb-2">
                <Image
                  src={product.image || '/placeholder.svg?height=100&width=100'}
                  alt={product.product_name}
                  fill
                  className="object-contain"
                />
              </div> */}
              {status === 'low-stock' && (
                <Badge
                  variant="outline"
                  className="absolute top-1 right-1 bg-yellow-100 text-yellow-800 border-yellow-300">
                  Low Stock: {product.quantity_in_stock}
                </Badge>
              )}
              {status === 'out-of-stock' && (
                <Badge variant="destructive" className="absolute top-1 right-1">
                  Out of Stock
                </Badge>
              )}
              <h3 className="font-medium text-center line-clamp-2 h-10">
                {product.product_name}
              </h3>
              <p className="font-bold text-base mt-1">
                {product.unit_price.toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'PHP',
                })}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
