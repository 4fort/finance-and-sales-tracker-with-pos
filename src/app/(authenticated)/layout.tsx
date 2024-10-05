'use client'
import { ReactNode } from 'react'
import { useAuth } from '@/hooks/auth'
import Navigation from '@/components/Layouts/Navigation'

const AppLayout = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth({ middleware: 'auth' })
  if (!user) {
    return <div>loading user</div>
  }
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Page Content */}
      <main>{children}</main>
    </div>
  )
}

export default AppLayout
