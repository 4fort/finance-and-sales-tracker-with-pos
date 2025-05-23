import type { ReactNode } from 'react'

interface POSLayoutProps {
  children: ReactNode
}

export default function Layout({ children }: POSLayoutProps) {
  return (
    <div className="flex shrink flex-col bg-background">
      <main className="flex-1 grow h-full overflow-hidden flex flex-col">
        {children}
      </main>
    </div>
  )
}
