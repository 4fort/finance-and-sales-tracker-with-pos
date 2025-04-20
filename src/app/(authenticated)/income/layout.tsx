import React from 'react'
import { IncomeContextProvider } from './income-context'

export default function IncomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <IncomeContextProvider>{children}</IncomeContextProvider>
    </>
  )
}
