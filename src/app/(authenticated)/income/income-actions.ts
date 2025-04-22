import { supabase } from '@/lib/supabase'
import { AddSalePayload } from '@/types/Income'

export const incomeActions = {
  getStats: async () => {
    const { data, error } = await supabase.rpc('get_income_stats')
    if (error) {
      console.error('Error fetching income stats:', error)
      return null
    }

    return data
  },
  getChartData: async () => {
    const { data: userData, error: userError } = await supabase.auth.getUser()

    if (userError) {
      console.error('Error fetching user data:', userError)
      return null
    }
    const user_id = userData.user?.id
    if (!user_id) {
      console.error('User ID not found')
      return null
    }

    const { data, error } = await supabase.rpc('get_monthly_chart_data')
    if (error) {
      console.error('Error fetching income chart data:', error)
      return null
    }

    return data
  },
  getUserSales: async () => {
    const { data: userData, error: userError } = await supabase.auth.getUser()

    if (userError) {
      console.error('Error fetching user data:', userError)
      return null
    }
    const user_id = userData.user?.id
    if (!user_id) {
      console.error('User ID not found')
      return null
    }

    const { data, error } = await supabase.rpc('get_user_sales')
    if (error) {
      console.error('Error fetching user sales:', error)
      return null
    }

    return data
  },
  addSale: async (sale: Omit<AddSalePayload, 'user_id'>) => {
    const { data: userData, error: userError } = await supabase.auth.getUser()

    if (userError) {
      console.error('Error fetching user data:', userError)
      return null
    }
    const user_id = userData.user?.id
    if (!user_id) {
      console.error('User ID not found')
      return null
    }

    const payload = {
      user_id: user_id,
      customer_name: sale.customer_name,
      total_amount: sale.total_amount,
      paid_amount: sale.paid_amount,
      payment_method: sale.payment_method,
      items: sale.items,
    }

    console.log('Payload for addSale:', payload)

    const { data, error } = await supabase.rpc('add_sale', {
      payload,
    })
    if (error) {
      console.error('Error adding sale:', error)
      throw error
    }

    return data
  },
}
