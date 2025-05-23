export interface StatItem {
  value: number
  change: number
  trend: 'up' | 'down'
  period: string
}

export interface IncomeStatsType {
  totalSales: StatItem
  totalProfit: StatItem
  profitMargin: StatItem
  stocksSold: StatItem
}

export interface IncomeChartDataType {
  label: string
  sales: number
  profit: number
}

export interface IncomeSalesRowType {
  id: number
  customer_name: string | undefined
  total_amount: number
  paid_amount: number
  payment_method: string
  created_at: Date
  items: Item[] | null
}

export interface Item {
  quantity: number
  subtotal: number
  product_id: number
  unit_price: number
  product_name: string
  created_at: Date
  product_sku: string
  sales_item_id: number
  sales_id: number
}

export interface AddSalePayload {
  user_id: string
  customer_name: string | undefined
  total_amount: number
  paid_amount: number
  payment_method: string
  items: {
    product_id: Item['product_id']
    quantity: Item['quantity']
    unit_price: Item['unit_price']
  }[]
}
