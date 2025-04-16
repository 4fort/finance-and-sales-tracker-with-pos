export type ProductSalesRow = {
  product_id: number
  product_name: string
  sku: string
  unit_price: number
  cost_price: number
  quantity_in_stock: number
  sold_quantity: number
  total_sales: number
  total_cost: number
  profit: number
  is_archived: boolean
}

export interface ProductStats {
  totalProducts: {
    count: number // e.g., 248
    change: number // e.g., 12
    trend: 'up' | 'down' // for determining which arrow to show
    period: string // e.g., "month", "week"
  }
  inventoryValue: {
    value: number // e.g., 89432.54
    change: number // e.g., 4320.12
    trend: 'up' | 'down'
    period: string
  }
  profitMargin: {
    percentage: number // e.g., 42.8
    change: number // e.g., 1.2
    trend: 'up' | 'down'
    period: string
  }
  lowStockItems: {
    count: number // e.g., 12
    change: number // e.g., 3
    trend: 'up' | 'down'
    period: string
  }
}

export type GetProductSalesSummaryResponse = {
  products: ProductSalesRow[]
  stats: ProductStats
}
