'use client'

import { Facebook, Instagram, Twitter } from 'lucide-react'
import Link from 'next/link'

export function AdminFooter() {
  return (
    <footer className="bg-gray-100 text-gray-600 py-12 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link
                href="/dashboard"
                className="hover:text-gray-900 transition-colors">
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/orders"
                className="hover:text-gray-900 transition-colors">
                Orders
              </Link>
            </li>
            <li>
              <Link
                href="/products"
                className="hover:text-gray-900 transition-colors">
                Products
              </Link>
            </li>
            <li>
              <Link
                href="/customers"
                className="hover:text-gray-900 transition-colors">
                Customers
              </Link>
            </li>
            <li>
              <Link
                href="/analytics"
                className="hover:text-gray-900 transition-colors">
                Analytics
              </Link>
            </li>
          </ul>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Support</h3>
          <ul className="space-y-2">
            <li>
              <Link
                href="/help-center"
                className="hover:text-gray-900 transition-colors">
                Help Center
              </Link>
            </li>
            <li>
              <Link
                href="/contact-support"
                className="hover:text-gray-900 transition-colors">
                Contact Support
              </Link>
            </li>
            <li>
              <Link
                href="/faq"
                className="hover:text-gray-900 transition-colors">
                FAQ
              </Link>
            </li>
            <li>
              <Link
                href="/documentation"
                className="hover:text-gray-900 transition-colors">
                Documentation
              </Link>
            </li>
            <li>
              <Link
                href="/api-status"
                className="hover:text-gray-900 transition-colors">
                API Status
              </Link>
            </li>
          </ul>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Legal</h3>
          <ul className="space-y-2">
            <li>
              <Link
                href="/terms"
                className="hover:text-gray-900 transition-colors">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link
                href="/privacy"
                className="hover:text-gray-900 transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                href="/cookies"
                className="hover:text-gray-900 transition-colors">
                Cookie Policy
              </Link>
            </li>
            <li>
              <Link
                href="/gdpr"
                className="hover:text-gray-900 transition-colors">
                GDPR Compliance
              </Link>
            </li>
            <li>
              <Link
                href="/security"
                className="hover:text-gray-900 transition-colors">
                Security
              </Link>
            </li>
          </ul>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Company</h3>
          <p>Acme E-commerce Solutions</p>
          <p>123 Admin Street, Suite 456</p>
          <p>San Francisco, CA 94105</p>
          <p>support@acme-ecommerce.com</p>
          <div className="flex space-x-4 mt-4">
            <Link
              href="https://facebook.com"
              className="text-gray-400 hover:text-gray-900 transition-colors">
              <Facebook className="h-6 w-6" />
              <span className="sr-only">Facebook</span>
            </Link>
            <Link
              href="https://twitter.com"
              className="text-gray-400 hover:text-gray-900 transition-colors">
              <Twitter className="h-6 w-6" />
              <span className="sr-only">Twitter</span>
            </Link>
            <Link
              href="https://instagram.com"
              className="text-gray-400 hover:text-gray-900 transition-colors">
              <Instagram className="h-6 w-6" />
              <span className="sr-only">Instagram</span>
            </Link>
          </div>
        </div>
      </div>
      <div className="mt-12 pt-8 border-t border-gray-200 text-center">
        <p>&copy; 2024 Acme E-commerce Solutions. All rights reserved.</p>
      </div>
    </footer>
  )
}
