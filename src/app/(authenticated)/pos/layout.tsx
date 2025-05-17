import type { ReactNode } from 'react'

interface POSLayoutProps {
  children: ReactNode
}

export default function Layout({ children }: POSLayoutProps) {
  return (
    <div className="flex flex-1 grow flex-col bg-background">
      <main className="flex-1 h-full overflow-hidden flex flex-col">
        {children}
      </main>
    </div>
  )
}
