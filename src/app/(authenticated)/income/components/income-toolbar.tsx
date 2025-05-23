import { Input } from '@/components/ui/input'
import React from 'react'
import { IncomeTabs, useIncomeContext } from '../income-context'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ViewAsCombobox } from './view-as-combobox'

export default function IncomeToolbar() {
  const {
    globalSearchFilter,
    setGlobalSearchFilter,
    setNewSaleFormOpen,
    tab,
    setTab,
    viewSelection,
  } = useIncomeContext()

  const isActive = (currentTab: IncomeTabs) => {
    return tab === currentTab ? 'outline' : 'ghost'
  }
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-tl-md rounded-tr-md border-border border-l border-t border-r no-print">
      <div className="bg-muted p-0.5 rounded-md space-x-1">
        <Button
          variant={isActive('all')}
          onClick={() => setTab('all')}
          size="sm"
          className="border-none hover:bg-background"
          disabled={viewSelection?.value === 'items'}>
          All
        </Button>
        <Button
          variant={isActive('cash')}
          onClick={() => setTab('cash')}
          size="sm"
          className="border-none hover:bg-background"
          disabled={viewSelection?.value === 'items'}>
          Cash
        </Button>
        <Button
          variant={isActive('gcash')}
          onClick={() => setTab('gcash')}
          size="sm"
          className="border-none hover:bg-background"
          disabled={viewSelection?.value === 'items'}>
          Gcash
        </Button>
        <Button
          variant={isActive('card')}
          onClick={() => setTab('card')}
          size="sm"
          className="border-none hover:bg-background"
          disabled={viewSelection?.value === 'items'}>
          Card
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <ViewAsCombobox />
        <div className="relative flex items-center gap-2">
          <Search className="absolute left-3 h-4 w-4" />
          <Input
            placeholder="Search products..."
            value={globalSearchFilter}
            onChange={e => setGlobalSearchFilter(e.target.value)}
            className="bg-muted pl-8"
          />
        </div>
        <Button onClick={() => setNewSaleFormOpen(true)}>+ Add New Sale</Button>
      </div>
    </div>
  )
}
