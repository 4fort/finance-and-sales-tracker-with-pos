import { createZodObject } from '@/lib/utils'
import { Tables } from '@/types/supabase'
import { z } from 'zod'

export type ProductsTable = Omit<
  Tables<'products'>,
  'id' | 'created_at' | 'user_id' | 'sku' | 'quantity' | 'category_id'
> & {
  sku: string | undefined
  quantity: number
  category_id: number | undefined
}

export const newProductFormSchema = createZodObject<ProductsTable>({
  name: z.string().min(1, { message: 'Product name is required' }),
  sku: z.string().optional(),
  unit_price: z.coerce.number().min(0.1, { message: 'Unit price is required' }),
  cost_price: z.coerce.number().min(0.1, { message: 'Cost price is required' }),
  quantity: z.coerce
    .number()
    .min(0, { message: 'Quantity in stock is required' }),
  category_id: z.coerce.number().optional(),
})

// export const newProductFormSchema = z.object({
//   name: z.string().min(1, { message: 'Product name is required' }),
//   sku: z.string().min(1, { message: 'SKU is required' }),
//   unit_price: z.number().min(0, { message: 'Unit price is required' }),
//   cost_price: z.number().min(0, { message: 'Cost price is required' }),
//   quantity_in_stock: z
//     .number()
//     .min(0, { message: 'Quantity in stock is required' }),
//   description: z.string().optional(),
//   category_id: z.number().optional(),
//   supplier_id: z.number().optional(),
//   is_active: z.boolean().default(true),
// })

// export type NewProductFormSchemaType = z.infer<typeof newProductFormSchema>
