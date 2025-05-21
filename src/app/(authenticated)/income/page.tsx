'use client'

import React, { useEffect, useState } from 'react'
import { IncomeChart } from './components/income-chart'
import IncomeStats from './components/income-stats'
import { useQuery } from '@tanstack/react-query'
import { incomeActions } from './income-actions'
import { salesColumns } from './sales-columns'
import IncomeToolbar from './components/income-toolbar'
import { DataTable } from './components/data-table'
import { useIncomeContext } from './income-context'
import {
  IncomeChartDataType,
  IncomeSalesRowType,
  type IncomeStatsType as IncomeStatsType,
} from '@/types/Income'
import { itemsColumns } from './items-columns'
import { DatePicker } from '@/components/date-picker'

export default function IncomePage() {
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

  const { data: userSales, isPending: isUserSalesPending } = useQuery<
    IncomeSalesRowType[]
  >({
    queryKey: ['user_sales'],
    queryFn: async () => {
      const data = await incomeActions.getUserSales()
      return data
    },
  })

  // const [monthSelected, setMonthSelected] = useState(new Date().getMonth() + 1)
  // const [filteredData, setfilteredData] = useState({
  //   _incomeStats: incomeStats,
  //   _incomeChartData: incomeChartData,
  //   _userSales: userSales,
  // })

  // useEffect(() => {
  //   const currentMonth = new Date().getMonth() + 1

  //   // const filteredStats = incomeStats?.
  // }, [monthSelected])

  const { viewSelection, tab } = useIncomeContext()

  const itemSales = userSales?.flatMap(sale => sale.items || [])

  const filteredUserSales = userSales?.filter(sale => {
    return (
      (tab === 'all' || sale.payment_method === tab) &&
      (viewSelection?.value === 'sales' ||
        (viewSelection?.value === 'items' && sale.items!.length > 0))
    )
  })

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  return (
    <div className="flex-1 space-y-4 p-8 pt-6 flex flex-col">
      {isStatsPending || isChartDataPending || isUserSalesPending ? (
        <div className="flex items-center justify-center w-full h-full">
          <p className="text-lg font-semibold">Loading...</p>
        </div>
      ) : (
        <>
          <DatePicker
            className="place-self-end"
            date={selectedDate}
            setDate={setSelectedDate}
          />
          <IncomeStats stats={incomeStats!} />
          <IncomeChart data={incomeChartData!} />
          <div>
            <IncomeToolbar />
            {viewSelection?.value === 'items' ? (
              <DataTable columns={itemsColumns} data={itemSales!} />
            ) : (
              <DataTable columns={salesColumns} data={filteredUserSales!} />
            )}
          </div>
        </>
      )}
    </div>
  )
}
