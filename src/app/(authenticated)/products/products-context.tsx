'use client'

import React from 'react'
import ProductForm from './components/new-product-form'
import { ProductSalesRow } from '@/types/Product'
import ArchiveProductDialog from './components/archive-product-dialog'
import RecoverProductDialog from './components/recover-product-dialog'

export type ProductTabs = 'all' | 'archived'

type ProductContextType = {
  formIsOpen: boolean
  setFormIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  archiveIsOpen: boolean
  setArchiveIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  recoverIsOpen: boolean
  setRecoverIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  selectedProduct: ProductSalesRow | null
  setSelectedProduct: React.Dispatch<
    React.SetStateAction<ProductSalesRow | null>
  >
  globalSearchFilter: string
  setGlobalSearchFilter: React.Dispatch<React.SetStateAction<string>>
  tab: ProductTabs
  setTab: React.Dispatch<React.SetStateAction<ProductTabs>>
}

export const ProductContext = React.createContext<ProductContextType>({
  formIsOpen: false,
  setFormIsOpen: () => {},
  archiveIsOpen: false,
  setArchiveIsOpen: () => {},
  recoverIsOpen: false,
  setRecoverIsOpen: () => {},
  selectedProduct: null,
  setSelectedProduct: () => {},
  globalSearchFilter: '',
  setGlobalSearchFilter: () => {},
  tab: 'all',
  setTab: () => {},
})

export const useProductContext = () => {
  const context = React.useContext(ProductContext)
  if (!context) {
    throw new Error('useProductContext must be used within a ProductProvider')
  }
  return context
}

export const ProductsContextProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [formIsOpen, setFormIsOpen] = React.useState(false)
  const [archiveIsOpen, setArchiveIsOpen] = React.useState(false)
  const [recoverIsOpen, setRecoverIsOpen] = React.useState(false)
  const [selectedProduct, setSelectedProduct] =
    React.useState<ProductSalesRow | null>(null)
  const [globalSearchFilter, setGlobalSearchFilter] = React.useState('')
  const [tab, setTab] = React.useState<ProductTabs>('all')

  React.useEffect(() => {
    if (!formIsOpen) setSelectedProduct(null)
  }, [formIsOpen])

  React.useEffect(() => {
    if (!archiveIsOpen) setSelectedProduct(null)
  }, [archiveIsOpen])

  React.useEffect(() => {
    if (!recoverIsOpen) setSelectedProduct(null)
  }, [recoverIsOpen])

  return (
    <ProductContext.Provider
      value={{
        formIsOpen,
        setFormIsOpen,
        archiveIsOpen,
        setArchiveIsOpen,
        recoverIsOpen,
        setRecoverIsOpen,
        selectedProduct,
        setSelectedProduct,
        globalSearchFilter,
        setGlobalSearchFilter,
        tab,
        setTab,
      }}>
      {children}
      <ProductForm />
      <ArchiveProductDialog />
      <RecoverProductDialog />
    </ProductContext.Provider>
  )
}
