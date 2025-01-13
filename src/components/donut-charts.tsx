'use client'

import * as React from 'react'
import { TrendingUp } from 'lucide-react'
import { Label, Pie, PieChart } from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { useAuth } from '@/hooks/auth'
import useSWR from 'swr'
import axios from '@/lib/axios'
import { Customer } from '@/app/(authenticated)/customers/page'
import { useEffect, useState } from 'react'

const chartConfig = {
  visitors: {
    label: 'Visitors',
  },
  chrome: {
    label: 'Chrome',
    color: 'hsl(var(--chart-1))',
  },
  safari: {
    label: 'Safari',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig

export default function DonutChart({ data }: { data: Customer[] }) {
  const [offlineCount, setOfflineCount] = useState(0)
  const [onlineCount, setOnlineCount] = useState(0)
  const chartData = [
    { browser: 'active', visitors: onlineCount, fill: 'var(--color-safari)' },
    { browser: 'offline', visitors: offlineCount, fill: 'var(--color-chrome)' },
  ]
  const [totalVisitors, setTotalVisitors] = useState(0)

  useEffect(() => {
    if (data) {
      const activeCount = data.filter(
        (body: Customer) => body.subscription_status === 'active',
      ).length
      const offlineCount = data.filter(
        (body: Customer) => body.subscription_status === 'offline',
      ).length
      setOfflineCount(offlineCount)
      setOnlineCount(activeCount)
      setTotalVisitors(chartData.reduce((acc, curr) => acc + curr.visitors, 0))
    }
  }, [data, chartData])

  return (
    <Card className="flex flex-col w-fit">
      <CardHeader className="items-center pb-0">
        <CardTitle>Customer Chart Analysis</CardTitle>
        <CardDescription>January - December 2025</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]">
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="visitors"
              nameKey="browser"
              innerRadius={60}
              strokeWidth={5}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle">
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold">
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground">
                          Customers
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Showing total customers for the last 12 months
        </div>
      </CardFooter>
    </Card>
  )
}
