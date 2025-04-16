import { supabase } from '@/lib/supabase'
import { QueryData } from '@supabase/supabase-js'
import { ProductsTable } from './schema/new-product-schema'
import {
  GetProductSalesSummaryResponse,
  ProductSalesRow,
} from '@/types/Product'

export const productActions = {
  getAll: async () => {
    const { data, error } = await supabase.rpc('get_product_sales_summary')
    if (error) {
      console.error('Error fetching product sales summary:', error)
      return null
    }

    console.log(data)

    return data[0] as GetProductSalesSummaryResponse
  },
  getCategories: async () => {
    const { data, error } = await supabase.from('categories').select('*')
    if (error) {
      console.error('Error fetching categories:', error)
      return []
    }

    return data
  },
  add: async (values: ProductsTable) => {
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

    const data = {
      name: values.name,
      sku: values.sku,
      unit_price: values.unit_price,
      cost_price: values.cost_price,
      quantity: values.quantity,
      category_id: values.category_id === 0 ? null : values.category_id,
      user_id,
    }

    const { data: newProduct, error } = await supabase
      .from('products')
      .insert(data)
      .select()

    if (error) {
      console.error('Error adding product:', error)
      return null
    }
    return newProduct
  },
  update: async (values: ProductsTable, productId: number) => {
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

    const data = {
      name: values.name,
      sku: values.sku,
      unit_price: values.unit_price,
      cost_price: values.cost_price,
      quantity: values.quantity,
      category_id: values.category_id === 0 ? null : values.category_id,
      user_id,
    }

    const { data: updatedProduct, error } = await supabase
      .from('products')
      .update(data)
      .eq('id', productId)
      .select()

    if (error) {
      console.error('Error updating product:', error)
      return null
    }
    return updatedProduct
  },
  archive: async (productId: number) => {
    const { error } = await supabase
      .from('products')
      .update({ is_archived: true })
      .eq('id', productId)

    if (error) {
      console.error('Error archiving product:', error)
      return null
    }
    return true
  },
  recover: async (productId: number) => {
    const { error } = await supabase
      .from('products')
      .update({ is_archived: false })
      .eq('id', productId)

    if (error) {
      console.error('Error archiving product:', error)
      return null
    }
    return true
  },
}
