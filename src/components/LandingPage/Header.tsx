'use client'
import { Menu, ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import { Button } from '../ui/button'
import { useState } from 'react'
import { useParams } from 'next/navigation'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  return (
    <>
      <header className="px-4 lg:px-6 h-14 flex items-center  bg-transparent">
        <Link className="flex items-center justify-center" href="#">
          <ShoppingCart className="h-6 w-6 mr-2 text-white" />
          <span className=" text-xl font-bold text-white">AdminCommerce</span>
        </Link>
        <nav className="ml-auto hidden md:flex gap-4 sm:gap-6 text-white">
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#features">
            Features
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#pricing">
            Pricing
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#faq">
            FAQ
          </Link>
        </nav>
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <Menu className="h-6 w-6" />
        </Button>
      </header>
      {mobileMenuOpen && (
        <nav className="flex flex-col items-center py-4 bg-background border-b md:hidden">
          <Link
            className="text-sm font-medium py-2"
            href="#features"
            onClick={() => setMobileMenuOpen(false)}>
            Features
          </Link>
          <Link
            className="text-sm font-medium py-2"
            href="#pricing"
            onClick={() => setMobileMenuOpen(false)}>
            Pricing
          </Link>
          <Link
            className="text-sm font-medium py-2"
            href="#faq"
            onClick={() => setMobileMenuOpen(false)}>
            FAQ
          </Link>
        </nav>
      )}
    </>
  )
}
