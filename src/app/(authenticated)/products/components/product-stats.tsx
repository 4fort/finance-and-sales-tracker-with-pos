import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ProductStats } from '@/types/Product'
import {
  ArrowDownIcon,
  ArrowUpIcon,
  Package,
  DollarSign,
  Percent,
  ShoppingCart,
} from 'lucide-react'

export function ProductsStats({ stats }: { stats: ProductStats }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Products</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalProducts.count}</div>
          <p className="text-xs text-muted-foreground">
            {!stats.totalProducts.change ? (
              <span className="block">-</span>
            ) : (
              <span
                className={`text-${
                  stats.totalProducts.trend === 'up' ? 'green' : 'red'
                }-500 flex items-center`}>
                {stats.totalProducts.trend === 'up' ? (
                  <ArrowUpIcon className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDownIcon className="h-4 w-4 mr-1" />
                )}
                {stats.totalProducts.trend === 'up' ? '+' : '-'}
                {stats.totalProducts.change}
              </span>
            )}{' '}
            since last {stats.totalProducts.period}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            $
            {stats.inventoryValue.value.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
          <p className="text-xs text-muted-foreground">
            {!stats.inventoryValue.change ? (
              <span className="block">-</span>
            ) : (
              <span
                className={`text-${
                  stats.inventoryValue.trend === 'up' ? 'green' : 'red'
                }-500 flex items-center`}>
                {stats.inventoryValue.trend === 'up' ? (
                  <ArrowUpIcon className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDownIcon className="h-4 w-4 mr-1" />
                )}
                {stats.inventoryValue.trend === 'up' ? '+₱' : '-₱'}
                {stats.inventoryValue.change.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            )}{' '}
            since last {stats.inventoryValue.period}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Avg. Profit Margin
          </CardTitle>
          <Percent className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.profitMargin.percentage.toFixed(2)}%
          </div>
          <p className="text-xs text-muted-foreground">
            {!stats.profitMargin.change ? (
              <span className="block">-</span>
            ) : (
              <span
                className={`text-${
                  stats.profitMargin.trend === 'up' ? 'green' : 'red'
                }-500 flex items-center`}>
                {stats.profitMargin.trend === 'up' ? (
                  <ArrowUpIcon className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDownIcon className="h-4 w-4 mr-1" />
                )}
                {stats.profitMargin.trend === 'up' ? '+' : '-'}
                {stats.profitMargin.change}%
              </span>
            )}{' '}
            since last {stats.profitMargin.period}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.lowStockItems.count}</div>
          <p className="text-xs text-muted-foreground">
            {!stats.lowStockItems.change ? (
              <span className="block">-</span>
            ) : (
              <span
                className={`text-${
                  stats.lowStockItems.trend === 'down' ? 'green' : 'red'
                }-500 flex items-center`}>
                {stats.lowStockItems.trend === 'up' ? (
                  <ArrowUpIcon className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDownIcon className="h-4 w-4 mr-1" />
                )}
                {stats.lowStockItems.trend === 'up' ? '+' : '-'}
                {stats.lowStockItems.change}
              </span>
            )}{' '}
            since last {stats.lowStockItems.period}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
