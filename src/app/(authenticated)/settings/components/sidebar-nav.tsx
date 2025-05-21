'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { useQueries, useQuery } from '@tanstack/react-query'

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string
    title: string
  }[]
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  // const { data: userData } = useQuery({
  //   queryKey: ['user'],
  //   queryFn: async () => {
  //     const { data } = await supabase.auth.getUser()
  //     return data
  //   },
  // })

  const pathname = usePathname()
  console.log(pathname === items[0].href)
  return (
    <nav
      className={cn(
        'flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1',
        className,
      )}
      {...props}>
      {items.map(item => {
        // const userRole = userData?.user?.user_metadata.role

        // if (item.title === 'Account' && userRole === 'owner') {
        //   return null
        // }

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              buttonVariants({ variant: 'ghost' }),
              pathname === item.href
                ? 'bg-gray-200 hover:bg-muted'
                : 'hover:bg-transparent hover:underline',
              'justify-start',
            )}>
            {item.title}
          </Link>
        )
      })}
    </nav>
  )
}
