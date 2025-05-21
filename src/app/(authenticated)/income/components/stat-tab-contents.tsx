import React from 'react'
import IncomeStats from './income-stats'
import { IncomeChart } from './income-chart'
import { IncomeChartDataType, IncomeStatsType } from '@/types/Income'
import { useQuery } from '@tanstack/react-query'
import { incomeActions } from '../income-actions'
import { Skeleton } from '@/components/ui/skeleton'

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
      const data = await incomeActions.getChartData()
      return data
    },
  })

  return (
    <>
      {isStatsPending ? (
        <div className="space-y-3">
          <Skeleton className="h-[125px] w-full" />
        </div>
      ) : (
        <IncomeStats stats={incomeStats!} />
      )}

      {isChartDataPending ? (
        <Skeleton className="h-[350px] w-full" />
      ) : (
        <IncomeChart data={incomeChartData!} />
      )}
    </>
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
      const data = await incomeActions.getChartData()
      return data
    },
  })

  return (
    <div className="flex flex-col gap-4">
      {isStatsPending ? (
        <div className="space-y-3">
          <Skeleton className="h-[125px] w-full" />
        </div>
      ) : (
        <IncomeStats stats={incomeStats!} />
      )}

      {isChartDataPending ? (
        <Skeleton className="h-[350px] w-full" />
      ) : (
        <IncomeChart data={incomeChartData!} />
      )}
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
      const data = await incomeActions.getChartData()
      return data
    },
  })

  return (
    <div className="flex flex-col gap-4">
      {isStatsPending ? (
        <div className="space-y-3">
          <Skeleton className="h-[125px] w-full" />
        </div>
      ) : (
        <IncomeStats stats={incomeStats!} />
      )}

      {isChartDataPending ? (
        <Skeleton className="h-[350px] w-full" />
      ) : (
        <IncomeChart data={incomeChartData!} />
      )}
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
      const data = await incomeActions.getChartData()
      return data
    },
  })

  return (
    <div className="flex flex-col gap-4">
      {isStatsPending ? (
        <div className="space-y-3">
          <Skeleton className="h-[125px] w-full" />
        </div>
      ) : (
        <IncomeStats stats={incomeStats!} />
      )}

      {isChartDataPending ? (
        <Skeleton className="h-[350px] w-full" />
      ) : (
        <IncomeChart data={incomeChartData!} />
      )}
    </div>
  )
}
