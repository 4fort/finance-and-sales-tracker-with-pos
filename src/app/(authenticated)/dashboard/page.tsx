'use client'
import { Dashboard } from '@/components/screens/Dashboard/Dashboard'
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

const DashboardPage = () => {
  return <Dashboard />
}
export default DashboardPage
