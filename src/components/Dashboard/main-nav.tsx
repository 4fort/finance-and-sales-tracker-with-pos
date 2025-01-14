import Link from 'next/link'

import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname()
  return (
    <nav
      className={cn('flex items-center space-x-4 lg:space-x-6', className)}
      {...props}>
      <Link
        href="/dashboard"
        className={`text-sm font-medium transition-colors hover:text-primary ${
          pathname === '/dashboard' ? '' : 'text-muted-foreground'
        }`}>
        Dashboard
      </Link>
      <Link
        href="/customers"
        className={`text-sm font-medium transition-colors hover:text-primary ${
          pathname === '/customers' ? '' : 'text-muted-foreground'
        }`}>
        Customers
      </Link>
      <Link
        href="/orders"
        className={`text-sm font-medium transition-colors hover:text-primary ${
          pathname === '/orders' ? '' : 'text-muted-foreground'
        }`}>
        Orders
      </Link>
      {/* <Link
        href="/products"
        className={`text-sm font-medium transition-colors hover:text-primary ${
          pathname === '/products' ? '' : 'text-muted-foreground'
        }`}>
        Products
      </Link> */}
      {/* <Link
        href="/settings"
        className={`text-sm font-medium transition-colors hover:text-primary ${
          pathname === '/settings' || pathname === '/settings/account'
            ? ''
            : 'text-muted-foreground'
        }`}>
        Settings
      </Link> */}
    </nav>
  )
}
