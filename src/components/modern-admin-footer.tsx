'use client'

import { Facebook, Instagram, Twitter, Mail, MapPin, Phone } from 'lucide-react'
import Link from 'next/link'

export function ModernAdminFooter() {
  return (
    <footer className="bg-white text-gray-600 py-12 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-gray-900">AdminCommerce</h3>
          <p className="text-sm leading-relaxed">
            Empowering e-commerce businesses with cutting-edge admin solutions.
            Streamline your operations and boost your online presence.
          </p>
          <div className="flex space-x-4">
            <Link
              href="https://facebook.com"
              className="text-gray-400 hover:text-gray-900 transition-colors duration-300">
              <Facebook className="h-6 w-6" />
              <span className="sr-only">Facebook</span>
            </Link>
            <Link
              href="https://twitter.com"
              className="text-gray-400 hover:text-gray-900 transition-colors duration-300">
              <Twitter className="h-6 w-6" />
              <span className="sr-only">Twitter</span>
            </Link>
            <Link
              href="https://instagram.com"
              className="text-gray-400 hover:text-gray-900 transition-colors duration-300">
              <Instagram className="h-6 w-6" />
              <span className="sr-only">Instagram</span>
            </Link>
          </div>
        </div>
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Links
          </h4>
          <ul className="space-y-2">
            {['Dashboard', 'Orders', 'Products', 'Customers', 'Analytics'].map(
              item => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase()}`}
                    className="hover:text-gray-900 transition-colors duration-300">
                    {item}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Support</h4>
          <ul className="space-y-2">
            {[
              'Help Center',
              'Contact Support',
              'FAQ',
              'Documentation',
              'API Status',
            ].map(item => (
              <li key={item}>
                <Link
                  href={`/${item.toLowerCase().replace(' ', '-')}`}
                  className="hover:text-gray-900 transition-colors duration-300">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            Contact Us
          </h4>
          <ul className="space-y-4">
            <li className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-gray-400" />
              <span>
                121 Roxas Street, Bais City, Negros Oriental, Philippines
              </span>
            </li>
            <li className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-gray-400" />
              <span>+1 (555) 123-4567</span>
            </li>
            <li className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-gray-400" />
              <a
                href="mailto:support@acme-admin.com"
                className="hover:text-gray-900 transition-colors duration-300">
                support@admincommerce.com
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="mt-12 pt-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm">
            &copy; 2024 AdminCommerce Solutions. All rights reserved.
          </p>
          <ul className="flex space-x-6 mt-4 md:mt-0">
            <li>
              <Link
                href="/terms"
                className="text-sm hover:text-gray-900 transition-colors duration-300">
                Terms
              </Link>
            </li>
            <li>
              <Link
                href="/privacy"
                className="text-sm hover:text-gray-900 transition-colors duration-300">
                Privacy
              </Link>
            </li>
            <li>
              <Link
                href="/cookies"
                className="text-sm hover:text-gray-900 transition-colors duration-300">
                Cookies
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
