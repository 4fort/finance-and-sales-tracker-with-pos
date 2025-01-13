'use client'
import { Metadata } from 'next'
import Image from 'next/image'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CalendarDateRangePicker } from '@/components/Dashboard/date-range-picker'
import { MainNav } from '@/components/Dashboard/main-nav'
import { Overview } from '@/components/Dashboard/overview'
import { RecentSales } from '@/components/Dashboard/recent-sales'
import { Search } from '@/components/Dashboard/search'
import { TeamSwitcher } from '@/components/Dashboard/team-switcher'
import { UserNav } from '@/components/Dashboard/user-nav'
import { ChartLine } from '@/components/chart-line-interactive'
import { OrdersTable } from '@/components/Dashboard/orders-table'
import { useAuth } from '@/hooks/auth'
import useSWR from 'swr'
import axios from '@/lib/axios'
import { Orders } from '@/app/(authenticated)/orders/page'
import { Customer } from '@/app/(authenticated)/customers/page'
import { useQuery } from '@tanstack/react-query'

// Metadata for the dashboard page
export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Example dashboard app built using the components.',
}

// Reusable StatCard component to reduce repetitive code
const StatCard = ({
  title,
  value,
  change,
  icon,
}: {
  title: string
  value: number
  change: number
  icon: React.ReactNode
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{change}</p>
    </CardContent>
  </Card>
)

export function Dashboard() {
  const { user } = useAuth({ middleware: 'auth' })
  const ordersBaseUrl = `api/v1/orders?user_id=${user.id}`
  const customersbaseUrl = `api/v1/customers?user_id=${user.id}`

  const { isPending, error, data } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      try {
        const res = await axios.get(ordersBaseUrl)
        console.log(res.data.data)
        return res.data.data as Orders[]
      } catch (error: any) {
        console.error(error)
      }
    },
  })

  const {
    data: customersData,
    error: customersError,
    isLoading: customersIsLoading,
  } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      try {
        const res = await axios.get(customersbaseUrl)
        return res.data.data as Customer[]
      } catch (error: any) {
        console.error(error)
      }
    },
  })

  const statsData = [
    {
      title: 'Total Revenue',
      value:
        '$ ' +
        data
          ?.filter(
            order =>
              order.order_status === 'delivered' ||
              order.order_status === 'shipped' ||
              order.order_status === 'processing',
          )
          .reduce((acc, curr) => acc + curr.total, 0),
      change: 'Total revenue of the company',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          className="h-4 w-4 text-muted-foreground">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
    },
    {
      title: 'Subscribers',
      value: customersData?.length,
      change: 'Numbers of subscribed customers',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          className="h-4 w-4 text-muted-foreground">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      title: 'Sales',
      value:
        '$ ' +
        data
          ?.filter(order => order.order_status === 'delivered')
          .reduce((acc, curr) => acc + curr.total, 0),
      change: 'Amount of sales earned',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          className="h-4 w-4 text-muted-foreground">
          <rect width="20" height="14" x="2" y="5" rx="2" />
          <path d="M2 10h20" />
        </svg>
      ),
    },
    {
      title: 'Active Now',
      value: customersData?.filter(
        customer => customer.subscription_status === 'active',
      ).length,
      change: 'Numbers of active users',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          className="h-4 w-4 text-muted-foreground">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      ),
    },
  ]

  return (
    <>
      <div>
        {/* <Image
          src="/examples/dashboard-light.png"
          width={1280}
          height={866}
          alt="Dashboard"
          className="block dark:hidden"
        />
        <Image
          src="/examples/dashboard-dark.png"
          width={1280}
          height={866}
          alt="Dashboard"
          className="hidden dark:block"
        /> */}
      </div>
      <div className="flex-col flex">
        {/*    Nav      */}
        <div className="flex-1 space-y-4 p-8 pt-6">
          {/* <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <div className="flex items-center space-x-2">
              <CalendarDateRangePicker />
              <Button>Download</Button>
            </div>
          </div> */}
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {statsData.map((stat, index) => (
                  <StatCard
                    orders={data ? data : []}
                    customers={customersData ? customersData : []}
                    key={index}
                    title={stat.title}
                    value={stat.value}
                    change={stat.change}
                    icon={stat.icon}
                  />
                ))}
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <Overview />
                  </CardContent>
                </Card>
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Recent Sales</CardTitle>
                    <CardDescription>
                      You made{' '}
                      {'$ ' +
                        data
                          ?.filter(order => order.order_status === 'delivered')
                          .reduce((acc, curr) => acc + curr.total, 0)}{' '}
                      sales this month.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <OrdersTable orders={data ? data?.slice(0, 5) : []} />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
          <ChartLine data={customersData ? customersData : []} />
        </div>
      </div>
    </>
  )
}
