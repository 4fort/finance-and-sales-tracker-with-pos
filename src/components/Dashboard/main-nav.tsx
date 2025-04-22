import Link from 'next/link'

import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'
import { Separator } from '../ui/separator'

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
        href="/pos"
        className={`text-sm font-medium transition-colors hover:text-primary ${
          pathname === '/pos' ? '' : 'text-muted-foreground'
        }`}>
        POS
      </Link>
      <Separator orientation="vertical" className="h-6" />
      <Link
        href="/dashboard"
        className={`text-sm font-medium transition-colors hover:text-primary ${
          pathname === '/dashboard' ? '' : 'text-muted-foreground'
        }`}>
        Dashboard
      </Link>
      <Link
        href="/products"
        className={`text-sm font-medium transition-colors hover:text-primary ${
          pathname === '/products' ? '' : 'text-muted-foreground'
        }`}>
        Products
      </Link>
      <Link
        href="/income"
        className={`text-sm font-medium transition-colors hover:text-primary ${
          pathname === '/income' ? '' : 'text-muted-foreground'
        }`}>
        Income
      </Link>
      {/* <Link
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
      </Link> */}
      {/* <Link
        href="/products"
        className={`text-sm font-medium transition-colors hover:text-primary ${
          pathname === '/products' ? '' : 'text-muted-foreground'
        }`}>
        Products
      </Link> */}
      <Link
        href="/settings"
        className={`text-sm font-medium transition-colors hover:text-primary ${
          pathname === '/settings' || pathname === '/settings/account'
            ? ''
            : 'text-muted-foreground'
        }`}>
        Settings
      </Link>
    </nav>
  )
}
