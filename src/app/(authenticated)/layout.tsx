'use client'
import { ReactNode, useEffect, useState } from 'react'
import { useAuth } from '@/hooks/auth'
import { Loader2 } from 'lucide-react'
import { TeamSwitcher } from '@/components/Dashboard/team-switcher'
import { MainNav } from '@/components/Dashboard/main-nav'
import { Search } from '@/components/Dashboard/search'
import { UserNav } from '@/components/Dashboard/user-nav'

const AppLayout = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth({ middleware: 'auth' })
  if (!user) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <div className="flex flex-col items-center space-y-4 text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <h2 className="text-2xl font-bold text-primary">Loading...</h2>
          <p className="text-muted-foreground">
            Please wait while we fetch your data
          </p>
        </div>
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-gray-100 ">
      {/* Page Content */}
      <main>
        <div className="border-b bg-white">
          <div className="flex h-16 items-center px-4">
            <TeamSwitcher />
            <MainNav className="mx-6" />
            <div className="ml-auto flex items-center space-x-4">
              <Search />
              <UserNav />
            </div>
          </div>
        </div>
        {children}
      </main>
    </div>
  )
}

export default AppLayout
