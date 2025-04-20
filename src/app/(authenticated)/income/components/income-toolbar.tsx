import { Input } from '@/components/ui/input'
import React from 'react'
import { useIncomeContext } from '../income-context'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ViewAsCombobox } from './view-as-combobox'

export default function IncomeToolbar() {
  const { globalSearchFilter, setGlobalSearchFilter, setNewSaleFormOpen } =
    useIncomeContext()
  return (
    <div className="flex items-center justify-end p-4 bg-white rounded-tl-md rounded-tr-md border-border border-l border-t border-r">
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
