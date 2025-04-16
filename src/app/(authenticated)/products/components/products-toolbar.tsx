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
    <div className="w-full flex items-center justify-between bg-white p-2 rounded-md border">
      <div className="bg-muted p-0.5 rounded-md space-x-1">
        <Button
          variant={isActive('all')}
          onClick={() => setTab('all')}
          size="sm"
          className="border-none hover:bg-background">
          All
        </Button>
        <Button
          variant={isActive('archived')}
          onClick={() => setTab('archived')}
          size="sm"
          className="border-none hover:bg-background">
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
