// Product type
// export interface Product {
//   id: string
//   name: string
//   sku: string
//   unit_price: number
//   cost_price: number
//   quantity_in_stock: number
//   minStock: number
//   profit: number
//   profitMargin: number
//   status: 'in-stock' | 'low-stock' | 'out-of-stock'
//   image?: string
// }

import { ProductSalesRow } from './Product'

// Order item type
export interface OrderItem {
  product: ProductSalesRow
  quantity: number
}

// Payment method type
export type PaymentMethod =
  | 'cash'
  | 'gcash'
  | 'grabpay'
  | 'paymaya'
  | 'paypal'
  | 'card'
  | 'credit'
  | 'debit'

// Order type
export interface Order {
  id: string
  items: OrderItem[]
  subtotal: number
  //   tax: number
  total: number
  paymentMethod: PaymentMethod
  amountPaid: number
  change: number
  date: string
  // status: 'pending' | 'completed' | 'cancelled'
}
