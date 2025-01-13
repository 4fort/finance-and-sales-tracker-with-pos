import type { Metadata } from 'next'
import { Nunito } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/LandingPage/Header'
import { Footer } from '@/components/LandingPage/Footer'
import QueryProvider from '@/util/QueryProviders'
const nunito = Nunito({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AdminCommerce',
  description: 'Created by DevRonin',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${nunito.className} text-gray-900 antialiased`}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  )
}
