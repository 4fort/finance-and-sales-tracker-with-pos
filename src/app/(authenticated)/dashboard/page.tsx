'use client'

import { Dashboard } from '@/components/screens/Dashboard/Dashboard'
import DashboardStats from './components/dashboard-stats'
import {
  IncomeChartDataType,
  IncomeSalesRowType,
  IncomeStatsType,
} from '@/types/Income'
import { incomeActions } from '../income/income-actions'
import { useQuery } from '@tanstack/react-query'
import { productActions } from '../products/product-actions'
import { IncomeChart } from '../income/components/income-chart'
import DashboardRecentSales from './components/dashboard-recent-sales'

const DashboardPage = () => {
  const { data: incomeStats, isPending: isStatsPending } =
    useQuery<IncomeStatsType>({
      queryKey: ['income_stats'],
      queryFn: async () => {
        const data = await incomeActions.getStats()
        return data
      },
    })

  const { data: incomeChartData, isPending: isChartDataPending } = useQuery<
    IncomeChartDataType[]
  >({
    queryKey: ['income_chart'],
    queryFn: async () => {
      const data = await incomeActions.getChartData()
      return data
    },
  })

  const { data: productData, isPending: isProductDataPending } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const data = await productActions.getAll()
      return data
    },
  })

  const { data: userSales, isPending: isUserSalesPending } = useQuery<
    IncomeSalesRowType[]
  >({
    queryKey: ['user_sales'],
    queryFn: async () => {
      const data = await incomeActions.getUserSales()
      return data
    },
  })
  return (
    <>
      <div className="flex-1 space-y-4 p-8 pt-6">
        {isChartDataPending ||
        isStatsPending ||
        isProductDataPending ||
        isUserSalesPending ? (
          <div className="flex items-center justify-center w-full h-full">
            <p className="text-lg font-semibold">Loading...</p>
          </div>
        ) : (
          <>
            <DashboardStats
              stats={{
                totalSales: incomeStats!.totalSales,
                totalProfit: incomeStats!.totalProfit,
                totalProducts: productData!.stats.totalProducts,
                lowStockItems: productData!.stats.lowStockItems,
              }}
            />
            <div className="grid grid-cols-12 gap-4">
              <IncomeChart
                data={incomeChartData!}
                className="col-span-7 bg-foreground text-background"
              />
              <DashboardRecentSales
                sales={userSales!.slice(0, 4) || []}
                className="col-span-5 bg-foreground text-background"
              />
            </div>
          </>
        )}
      </div>
      {/* <Dashboard /> */}
    </>
  )
}
export default DashboardPage
