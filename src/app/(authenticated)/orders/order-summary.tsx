import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, Package, RefreshCcw, Truck } from 'lucide-react'
import { Orders } from './page'
import { useAuth } from '@/hooks/auth'
import useSWR from 'swr'
import axios from '@/lib/axios'

export function OrderSummary({ data }: { data: Orders[] }) {
  const summaryItems = [
    {
      title: 'Total Orders',
      value: data?.length,
      icon: Package,
      color: 'text-blue-600',
    },
    {
      title: 'Pending Orders',
      value: data?.filter(order => order.order_status === 'pending').length,
      icon: RefreshCcw,
      color: 'text-yellow-600',
    },
    {
      title: 'Shipped Orders',
      value: data?.filter(order => order.order_status === 'shipped').length,
      icon: Truck,
      color: 'text-green-600',
    },
    {
      title: 'Total Revenue',
      value:
        '$ ' +
        data
          ?.filter(order => order.order_status === 'delivered')
          .reduce((acc, curr) => acc + curr.total, 0),
      icon: DollarSign,
      color: 'text-purple-600',
    },
  ]
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {summaryItems.map(item => (
        <Card key={item.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
            <item.icon className={`h-4 w-4 ${item.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{item.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
