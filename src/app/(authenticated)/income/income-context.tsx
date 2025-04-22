'use client'

import { Receipt, ShoppingBasket } from 'lucide-react'
import React from 'react'
import NewSaleForm from './components/new-sale-form'

// export type ViewSelection = 'sales' | 'items'

export type IncomeTabs = 'all' | 'gcash' | 'card' | 'cash'

export const viewSelections = [
  {
    label: 'Sales',
    value: 'sales',
    icon: Receipt,
  },
  {
    label: 'Items',
    value: 'items',
    icon: ShoppingBasket,
  },
] as const
export type ViewSelection = (typeof viewSelections)[number]

type IncomeContextType = {
  viewSelection: ViewSelection | undefined
  setViewSelection: React.Dispatch<
    React.SetStateAction<IncomeContextType['viewSelection']>
  >
  globalSearchFilter: string
  setGlobalSearchFilter: React.Dispatch<React.SetStateAction<string>>
  viewAllItems: (sale_id: string) => void
  newSaleFormOpen: boolean
  setNewSaleFormOpen: React.Dispatch<React.SetStateAction<boolean>>
  tab: IncomeTabs
  setTab: React.Dispatch<React.SetStateAction<IncomeTabs>>
}

export const IncomeContext = React.createContext<IncomeContextType>({
  viewSelection: undefined,
  setViewSelection: () => {},
  globalSearchFilter: '',
  setGlobalSearchFilter: () => {},
  viewAllItems: () => {},
  newSaleFormOpen: false,
  setNewSaleFormOpen: () => {},
  setTab: () => {},
  tab: 'all',
})

export const useIncomeContext = () => {
  const context = React.useContext(IncomeContext)
  if (!context) {
    throw new Error('useIncomeContext must be used within an IncomeProvider')
  }
  return context
}

export const IncomeContextProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [viewSelection, setViewSelection] = React.useState<
    IncomeContextType['viewSelection']
  >(viewSelections[0])
  const [globalSearchFilter, setGlobalSearchFilter] = React.useState('')
  const [newSaleFormOpen, setNewSaleFormOpen] = React.useState(false)
  const [tab, setTab] = React.useState<IncomeTabs>('all')

  const viewAllItems = (sale_id: string) => {
    setViewSelection(viewSelections[1])
    setGlobalSearchFilter(`col:sales_id=${sale_id}`)
  }

  React.useEffect(() => {
    if (viewSelection?.value === 'sales') setGlobalSearchFilter('')
  }, [viewSelection])

  return (
    <IncomeContext.Provider
      value={{
        viewSelection,
        setViewSelection,
        globalSearchFilter,
        setGlobalSearchFilter,
        viewAllItems,
        newSaleFormOpen,
        setNewSaleFormOpen,
        tab,
        setTab,
      }}>
      <NewSaleForm />
      {children}
    </IncomeContext.Provider>
  )
}
