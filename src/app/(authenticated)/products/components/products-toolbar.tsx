import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React, { useState } from 'react'
import { Tabs, useProductContext } from '../products-context'
import { Search } from 'lucide-react'

export default function ProductsToolbar() {
  const {
    setFormIsOpen,
    globalSearchFilter,
    setGlobalSearchFilter,
    tab,
    setTab,
  } = useProductContext()

  const isActive = (currentTab: Tabs) => {
    return tab === currentTab ? 'outline' : 'ghost'
  }

  return (
    <div className="w-full flex items-center justify-between">
      <div className="bg-muted p-1 rounded-md border">
        <Button variant={isActive('all')} onClick={() => setTab('all')}>
          All
        </Button>
        <Button
          variant={isActive('archived')}
          onClick={() => setTab('archived')}>
          Archived
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative flex items-center gap-2">
          <Search className="absolute left-3 h-4 w-4" />
          <Input
            placeholder="Search products..."
            value={globalSearchFilter}
            onChange={e => setGlobalSearchFilter(e.target.value)}
            className="bg-white pl-8"
          />
        </div>
        <Button onClick={() => setFormIsOpen(true)}>+ Add Product</Button>
      </div>
    </div>
  )
}
