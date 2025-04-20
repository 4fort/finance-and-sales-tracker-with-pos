import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatItem } from '@/types/Income'
import { ProductStats } from '@/types/Product'
import {
  ArrowDownIcon,
  ArrowUpIcon,
  DollarSign,
  Package,
  ShoppingCart,
} from 'lucide-react'
import React from 'react'

export type DashboardStatsProps = {
  stats: {
    totalSales: StatItem
    totalProfit: StatItem
    totalProducts: ProductStats['totalProducts']
    lowStockItems: ProductStats['lowStockItems']
  }
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            $
            {stats.totalSales.value.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
          <p className="text-xs text-muted-foreground">
            {!stats.totalSales.change ? (
              <span className="block">-</span>
            ) : (
              <span
                className={`text-${
                  stats.totalSales.trend === 'up' ? 'green' : 'red'
                }-500 flex items-center`}>
                {stats.totalSales.trend === 'up' ? (
                  <ArrowUpIcon className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDownIcon className="h-4 w-4 mr-1" />
                )}
                {stats.totalSales.trend === 'up' ? '+' : '-'}
                {stats.totalSales.change}%
              </span>
            )}{' '}
            from last {stats.totalSales.period}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            $
            {stats.totalProfit.value.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
          <p className="text-xs text-muted-foreground">
            {!stats.totalProfit.change ? (
              <span className="block">-</span>
            ) : (
              <span
                className={`text-${
                  stats.totalProfit.trend === 'up' ? 'green' : 'red'
                }-500 flex items-center`}>
                {stats.totalProfit.trend === 'up' ? (
                  <ArrowUpIcon className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDownIcon className="h-4 w-4 mr-1" />
                )}
                {stats.totalProfit.trend === 'up' ? '+' : '-'}
                {stats.totalProfit.change}%
              </span>
            )}{' '}
            from last {stats.totalProfit.period}
          </p>
        </CardContent>
      </Card>

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
