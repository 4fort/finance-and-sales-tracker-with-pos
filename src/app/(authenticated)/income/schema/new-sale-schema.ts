import { createZodObject } from '@/lib/utils'
import { AddSalePayload } from '@/types/Income'
import { z } from 'zod'

export type AddSale = Omit<AddSalePayload, 'user_id'>

export const newSaleFormSchema = createZodObject<AddSale>({
  customer_name: z.string().optional(),
  total_amount: z.coerce
    .number()
    .min(0.1, { message: 'Total amount is required' }),
  paid_amount: z.coerce
    .number()
    .min(0.1, { message: 'Paid amount is required' }),
  payment_method: z.string(),
  items: z
    .array(
      z.object({
        product_id: z.coerce.number(),
        quantity: z.coerce.number().min(1, { message: 'Quantity is required' }),
        unit_price: z.coerce
          .number()
          .min(0.1, { message: 'Unit price is required' }),
      }),
    )
    .min(1, { message: 'At least one item is required' }),
}).superRefine((data, ctx) => {
  const { total_amount, paid_amount } = data
  if (total_amount > paid_amount) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Paid amount must be greater than or equal to total amount',
      fatal: true,
      path: ['paid_amount'],
    })
  }
})
