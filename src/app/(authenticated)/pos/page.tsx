'use client'

import { useState } from 'react'
import { ProductGrid } from './components/product-grid'
import { OrderSummary } from './components/order-summary'
import { PaymentModal } from './components/payment-modal'
import { ReceiptModal } from './components/receipt-modal'
import { SearchBar } from './components/search-bar'
import { Button } from '@/components/ui/button'
import { ShoppingCart, History } from 'lucide-react'
import { OrderHistoryDrawer } from './components/order-history-drawer'
import type { OrderItem, Order, PaymentMethod } from '@/types/POS'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { productActions } from '../products/product-actions'
import { ProductSalesRow } from '@/types/Product'
import { supabase } from '@/lib/supabase'
import { AddSalePayload } from '@/types/Income'
import { incomeActions } from '../income/income-actions'

export default function POSPage() {
  const { data: userData, isPending: isUserDataPending } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data, error } = await supabase.auth.getUser()
      if (error) {
        throw error.message
      }
      if (data) {
        return data
      }
    },
  })

  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false)
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false)
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null)
  const [orderHistory, setOrderHistory] = useState<Order[]>(
    typeof window !== 'undefined' && !isUserDataPending
      ? JSON.parse(
          localStorage.getItem(
            `${`order_history-${userData?.user.id}`}-order_history`,
          ) || '[]',
        )
      : [],
  )

  const { data, isPending } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const data = await productActions.getAll()
      return data
    },
  })

  const products = data?.products

  // Filter products based on category and search query
  const filteredProducts = products?.filter(product => {
    // const matchesCategory =
    //   activeCategory === 'all' || product.category === activeCategory
    // Fix: Use product_name instead of name
    const matchesSearch = product.product_name
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  // Add product to order
  const addProductToOrder = (product: ProductSalesRow) => {
    setOrderItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(
        item => item.product.product_id === product.product_id,
      )

      if (existingItemIndex >= 0) {
        // Product already in order, increase quantity
        const updatedItems = [...prevItems]
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1,
        }
        return updatedItems
      } else {
        // Add new product to order
        return [...prevItems, { product, quantity: 1 }]
      }
    })
  }

  // Update product quantity
  const updateProductQuantity = (productId: number, quantity: number) => {
    setOrderItems(prevItems => {
      if (quantity <= 0) {
        // Remove item if quantity is 0 or negative
        return prevItems.filter(item => item.product.product_id !== productId)
      }

      // Update quantity
      return prevItems.map(item =>
        item.product.product_id === productId ? { ...item, quantity } : item,
      )
    })
  }

  // Remove product from order
  const removeProductFromOrder = (productId: number) => {
    setOrderItems(prevItems =>
      prevItems.filter(item => item.product.product_id !== productId),
    )
  }

  // Calculate order totals
  const calculateOrderTotals = () => {
    const subtotal = orderItems.reduce(
      (sum, item) => sum + item.product.unit_price * item.quantity,
      0,
    )
    // const tax = subtotal * 0.12 // Assuming 12% tax
    const total = subtotal

    return { subtotal, total }
  }

  const queryClient = useQueryClient()

  const {
    mutateAsync: newIncomeSaleMutation,
    isPending: newIncomeSaleIsPending,
    error: newIncomeSaleError,
  } = useMutation({
    mutationFn: async (payload: Omit<AddSalePayload, 'user_id'>) => {
      const data = await incomeActions.addSale(payload)
      return data
    },
    onSuccess: data => {
      queryClient.invalidateQueries({
        queryKey: ['income_stats'],
      })
      queryClient.invalidateQueries({
        queryKey: ['income_chart'],
      })
      queryClient.invalidateQueries({
        queryKey: ['user_sales'],
      })
      queryClient.invalidateQueries({
        queryKey: ['products'],
      })

      return data
    },
    onError: error => {
      console.error(error)
    },
  })

  // Process payment
  const processPayment = async (
    paymentMethod: PaymentMethod,
    amountPaid: number,
  ) => {
    const { subtotal, total } = calculateOrderTotals()

    // Create initial order structure
    const orderData = {
      items: [...orderItems],
      subtotal,
      total,
      paymentMethod,
      amountPaid,
      change: amountPaid - total,
      date: new Date().toISOString(),
      status: 'completed',
    }

    const payload: Omit<AddSalePayload, 'user_id'> = {
      customer_name: 'Walk-in Customer',
      items: orderData.items.map(item => ({
        product_id: item.product.product_id,
        quantity: item.quantity,
        unit_price: item.product.unit_price,
      })),
      paid_amount: orderData.amountPaid,
      payment_method: orderData.paymentMethod,
      total_amount: orderData.total,
    }

    try {
      const newIncomeSaleData = await newIncomeSaleMutation(payload)

      console.log(newIncomeSaleData)

      // Create completed order with ID from response
      const newOrder: Order = {
        ...orderData,
        id: newIncomeSaleData.id
          ? `SALE-${newIncomeSaleData.id}`
          : `SALE-${Date.now()}`,
      }

      setCompletedOrder(newOrder)
      setOrderHistory(prev => {
        const updatedHistory = [newOrder, ...prev]

        if (typeof window !== 'undefined') {
          localStorage.setItem(
            `${`order_history-${userData?.user.id}`}-order_history`,
            JSON.stringify(updatedHistory),
          )
        }

        return updatedHistory
      })

      setIsPaymentModalOpen(false)
      setIsReceiptModalOpen(true)
    } catch (error) {
      console.error(error)
    }
  }

  // Start new order
  const startNewOrder = () => {
    setOrderItems([])
    setCompletedOrder(null)
    setIsReceiptModalOpen(false)
  }

  // Check if cart has items
  const hasItems = orderItems.length > 0

  return (
    <>
      <div className="grow flex flex-1 h-full flex-col md:flex-row">
        {/* Left side - Product selection */}
        <div className="flex flex-col w-full md:w-2/3 p-4 border-r">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Point of Sale</h1>
            <Button
              variant="outline"
              onClick={() => setIsHistoryDrawerOpen(true)}
              className="flex items-center gap-2">
              <History className="h-4 w-4" />
              <span className="hidden sm:inline">Order History</span>
            </Button>
          </div>

          <SearchBar
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery('')}
          />

          {/* <CategoryTabs
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          /> */}

          <ProductGrid
            products={filteredProducts ?? []}
            onProductSelect={addProductToOrder}
          />
        </div>

        {/* Right side - Order summary */}
        <div className="shrink flex flex-col w-full md:w-1/3 bg-muted/30">
          <OrderSummary
            items={orderItems}
            onUpdateQuantity={updateProductQuantity}
            onRemoveItem={removeProductFromOrder}
            totals={calculateOrderTotals()}
          />

          <div className="p-4 border-t mt-auto">
            <Button
              className="w-full h-16 text-lg"
              disabled={!hasItems}
              onClick={() => setIsPaymentModalOpen(true)}>
              <ShoppingCart className="mr-2 h-5 w-5" />
              Checkout
            </Button>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        orderTotal={calculateOrderTotals().total}
        onProcessPayment={processPayment}
        newIncomeSaleIsPending={newIncomeSaleIsPending}
      />

      {/* Receipt Modal */}
      <ReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={startNewOrder}
        order={completedOrder}
      />

      {/* Order History Drawer */}
      <OrderHistoryDrawer
        isOpen={isHistoryDrawerOpen}
        onClose={() => setIsHistoryDrawerOpen(false)}
        orders={orderHistory}
      />
    </>
  )
}
