import Link from 'next/link'

import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'
import { Separator } from '../ui/separator'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname()

  const { data: userData, isPending: userIsPending } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.auth.getUser()
        if (error) {
          console.error(error)
        }
        if (data) {
          console.log('data user', data)
          return data
        }
      } catch (error: any) {
        console.error(error)
      }
    },
  })

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
      {!userIsPending && userData?.user?.user_metadata.role !== 'cashier' && (
        <>
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
        </>
      )}
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
