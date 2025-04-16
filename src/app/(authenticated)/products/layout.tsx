import React from 'react'
import { ProductsContextProvider } from './products-context'

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <ProductsContextProvider>{children}</ProductsContextProvider>
    </>
  )
}
