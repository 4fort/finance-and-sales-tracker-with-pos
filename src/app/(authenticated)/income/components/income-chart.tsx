'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  type TooltipProps,
} from 'recharts'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { IncomeChartDataType } from '@/types/Income'
import { cn } from '@/lib/utils'

interface IncomeChartProps {
  data: IncomeChartDataType[]
  title?: string
  description?: string
  className?: string
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <Card className="p-3 border shadow-sm bg-background">
        <p className="font-medium">{`${label}`}</p>
        <p className="text-sm text-blue-500">{`Sales: ${payload[0].value?.toLocaleString(
          'en-US',
          {
            style: 'currency',
            currency: 'PHP',
          },
        )}`}</p>
        <p className="text-sm text-green-500">{`Profit: ${payload[1].value?.toLocaleString(
          'en-US',
          {
            style: 'currency',
            currency: 'PHP',
          },
        )}`}</p>
      </Card>
    )
  }

  return null
}

export function IncomeChart({
  data,
  title = 'Income Overview',
  description = 'View your sales and profit trends over time',
  className,
}: IncomeChartProps) {
  return (
    <Card
      className={cn('col-span-4 print:border-0 print:shadow-none', className)}>
      <CardHeader>
        <CardTitle className="print:text-lg">{title}</CardTitle>
        <CardDescription className="print:text-sm">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2 chart-container">
        <ResponsiveContainer width="100%" height={350}>
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="label" className="text-xs" />
            <YAxis className="text-xs" tickFormatter={value => `$${value}`} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#3b82f6"
              activeDot={{ r: 8 }}
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="profit"
              stroke="#10b981"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
