import React from 'react'
import IncomeStats from './income-stats'
import { IncomeChart } from './income-chart'
import { IncomeChartDataType, IncomeStatsType } from '@/types/Income'
import { useQuery } from '@tanstack/react-query'
import { incomeActions } from '../income-actions'
import { Skeleton } from '@/components/ui/skeleton'
import { PrintButton } from './print-button'

export function StatsToday() {
  const { data: incomeStats, isPending: isStatsPending } =
    useQuery<IncomeStatsType>({
      queryKey: ['income_stats', 'today'],
      queryFn: async () => {
        const data = await incomeActions.getStats('today')
        return data
      },
    })

  const { data: incomeChartData, isPending: isChartDataPending } = useQuery<
    IncomeChartDataType[]
  >({
    queryKey: ['income_chart', 'today'],
    queryFn: async () => {
      const data = await incomeActions.getChartData('today')
      return data
    },
  })

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold no-print">Today&apos;s Report</h2>
        <PrintButton reportTitle="Daily Income Report" />
      </div>

      <div className="print-section space-y-2">
        {isStatsPending ? (
          <div className="space-y-3 no-print">
            <Skeleton className="h-[125px] w-full" />
          </div>
        ) : (
          <IncomeStats stats={incomeStats!} />
        )}

        {isChartDataPending ? (
          <Skeleton className="h-[350px] w-full no-print" />
        ) : (
          <IncomeChart data={incomeChartData!} />
        )}
      </div>
    </div>
  )
}

export function StatsThisWeek() {
  const { data: incomeStats, isPending: isStatsPending } =
    useQuery<IncomeStatsType>({
      queryKey: ['income_stats', 'week'],
      queryFn: async () => {
        const data = await incomeActions.getStats('week')
        return data
      },
    })

  const { data: incomeChartData, isPending: isChartDataPending } = useQuery<
    IncomeChartDataType[]
  >({
    queryKey: ['income_chart', 'week'],
    queryFn: async () => {
      const data = await incomeActions.getChartData('week')
      return data
    },
  })

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold no-print">Weekly Report</h2>
        <PrintButton reportTitle="Weekly Income Report" />
      </div>

      <div className="print-section space-y-2">
        {isStatsPending ? (
          <div className="space-y-3 no-print">
            <Skeleton className="h-[125px] w-full" />
          </div>
        ) : (
          <IncomeStats stats={incomeStats!} />
        )}

        {isChartDataPending ? (
          <Skeleton className="h-[350px] w-full no-print" />
        ) : (
          <IncomeChart data={incomeChartData!} />
        )}
      </div>
    </div>
  )
}

export function StatsThisMonth() {
  const { data: incomeStats, isPending: isStatsPending } =
    useQuery<IncomeStatsType>({
      queryKey: ['income_stats', 'month'],
      queryFn: async () => {
        const data = await incomeActions.getStats('month')
        return data
      },
    })

  const { data: incomeChartData, isPending: isChartDataPending } = useQuery<
    IncomeChartDataType[]
  >({
    queryKey: ['income_chart', 'month'],
    queryFn: async () => {
      const data = await incomeActions.getChartData('month')
      return data
    },
  })

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold no-print">Monthly Report</h2>
        <PrintButton reportTitle="Monthly Income Report" />
      </div>

      <div className="print-section space-y-2">
        {isStatsPending ? (
          <div className="space-y-3 no-print">
            <Skeleton className="h-[125px] w-full" />
          </div>
        ) : (
          <IncomeStats stats={incomeStats!} />
        )}

        {isChartDataPending ? (
          <Skeleton className="h-[350px] w-full no-print" />
        ) : (
          <IncomeChart data={incomeChartData!} />
        )}
      </div>
    </div>
  )
}

export function StatsThisYear() {
  const { data: incomeStats, isPending: isStatsPending } =
    useQuery<IncomeStatsType>({
      queryKey: ['income_stats', 'year'],
      queryFn: async () => {
        const data = await incomeActions.getStats('year')
        return data
      },
    })

  const { data: incomeChartData, isPending: isChartDataPending } = useQuery<
    IncomeChartDataType[]
  >({
    queryKey: ['income_chart', 'year'],
    queryFn: async () => {
      const data = await incomeActions.getChartData('year')
      return data
    },
  })

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold no-print">Annual Report</h2>
        <PrintButton reportTitle="Annual Income Report" />
      </div>

      <div className="print-section space-y-2">
        {isStatsPending ? (
          <div className="space-y-3 no-print">
            <Skeleton className="h-[125px] w-full" />
          </div>
        ) : (
          <IncomeStats stats={incomeStats!} />
        )}

        {isChartDataPending ? (
          <Skeleton className="h-[350px] w-full no-print" />
        ) : (
          <IncomeChart data={incomeChartData!} />
        )}
      </div>
    </div>
  )
}
