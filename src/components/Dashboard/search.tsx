'use client'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export function Search() {
  const [query, setQuery] = useState('')
  const router = useRouter()
  const validRoutes = ['dashboard', 'customers', 'orders', 'settings/account']

  useEffect(() => {
    if (validRoutes.includes('' + query.trim().toLowerCase())) {
      router.push(`/${query}`)
    } else if (query.trim().toLowerCase() === 'account') {
      router.push(`/settings/account`)
    } else if (
      query.trim().toLowerCase() === 'settings' ||
      query.trim().toLowerCase() === 'profile'
    ) {
      router.push(`/settings`)
    }
  }, [query])
  return (
    <Input
      type="text"
      value={query}
      onChange={e => setQuery(e.target.value)}
      placeholder="Search pages..."
    />
  )
}
