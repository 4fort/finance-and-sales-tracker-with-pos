import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { IncomeStatsType, StatItem } from '@/types/Income'
import {
  ArrowDownIcon,
  ArrowUpIcon,
  TrendingUp,
  DollarSign,
  Percent,
  Package,
} from 'lucide-react'
import React from 'react'

interface IncomeStatsProps {
  stats: IncomeStatsType
}

export default function IncomeStats({ stats }: IncomeStatsProps) {
  console.log(stats)
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
          <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
          <Percent className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.profitMargin.value.toFixed(2)}%
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
            from last {stats.profitMargin.period}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Stocks Sold</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.stocksSold.value.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            {!stats.stocksSold.change ? (
              <span className="block">-</span>
            ) : (
              <span
                className={`text-${
                  stats.stocksSold.trend === 'up' ? 'green' : 'red'
                }-500 flex items-center`}>
                {stats.stocksSold.trend === 'up' ? (
                  <ArrowUpIcon className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDownIcon className="h-4 w-4 mr-1" />
                )}
                {stats.stocksSold.trend === 'up' ? '+' : '-'}
                {stats.stocksSold.change}%
              </span>
            )}{' '}
            from last {stats.stocksSold.period}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
