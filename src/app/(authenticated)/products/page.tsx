'use client'

import { useQuery } from '@tanstack/react-query'
import { productActions } from './product-actions'
import { columns } from './columns'
import { DataTable } from './components/data-table'
import { ProductsStats } from './components/product-stats'
import { useProductContext } from './products-context'
import ProductsToolbar from './components/products-toolbar'

const ProductsPage = () => {
  const { data, isPending } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const data = await productActions.getAll()
      return data
    },
  })

  const { tab } = useProductContext()

  return (
    <div className="flex-1 space-y-4 p-8 pt-6 ">
      {!isPending && data && <ProductsStats stats={data?.stats} />}
      {isPending ? (
        <div className="flex items-center justify-center w-full h-full">
          <p className="text-lg font-semibold">Loading...</p>
        </div>
      ) : (
        <div>
          <ProductsToolbar />
          <DataTable
            columns={columns}
            data={
              data?.products?.filter(p =>
                tab === 'all' ? !p.is_archived : p.is_archived,
              ) ?? []
            }
          />
        </div>
      )}
    </div>
  )
}
export default ProductsPage
