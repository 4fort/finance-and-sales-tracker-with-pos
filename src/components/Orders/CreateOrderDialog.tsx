import { Button } from '@/components/ui/button'
import useSWR, { mutate } from 'swr'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from '@/lib/axios'
import { useAuth } from '@/hooks/auth'
import { CustomersComboBox } from './CustomersComboBox'
import { Customer } from '@/app/(authenticated)/customers/page'
import { OrderStatusComboBox } from './OrderStatusComboBox'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

// Define the Zod schema (without user_id)
const customerSchema = z.object({
  items: z.coerce.number(),
  order_status: z.string().min(1, 'Order status is required'),
  total: z.coerce.number(),
  customer_id: z.string().min(1, 'Customer is required'),
})

// Infer the TypeScript type from the schema
type OrderFormValues = z.infer<typeof customerSchema>

export function CreateOrderDialog() {
  const queryClient = useQueryClient()
  // const csrfToken = Cookies.get('XSRF-TOKEN')

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<OrderFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      items: 0,
      order_status: '',
      total: 0,
      customer_id: '',
    },
  })
  const {
    isPending,
    error: userError,
    data: user,
  } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.auth.getUser()
        if (error) {
          console.error(error)
        }
        if (data) {
          console.log('data user', data)
          return data
        }
      } catch (error: any) {
        console.error(error)
      }
    },
  })
  const {
    data: customerData,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('customers')
          .select('*')
          .eq('user_id', user?.user?.id)
        if (error) {
          console.error(error)
        }
        if (data) {
          console.log(data)
          return data as Customer[]
        }
      } catch (error: any) {
        console.error(error)
      }
    },
    enabled: !!user?.user?.id, // Only run this query if the user ID is available
  })
  const { mutateAsync: createOrderMutation } = useMutation({
    mutationFn: async (data: OrderFormValues) => {
      const orderData = {
        ...data,
        user_id: user?.user?.id,
        // Add user_id dynamically
      }
      try {
        const { data, error } = await supabase.from('orders').insert(orderData)
        if (error) {
          console.error(error)
          return
        }
        reset()
      } catch (error) {
        console.error(error)
      }
      // Reset the form after submission
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })
  const onSubmit = async (data: OrderFormValues) => {
    const orderData = {
      ...data,
      user_id: user?.user?.id,
      // Add user_id dynamically
    }

    await createOrderMutation(orderData)
  }

  // Dummy function to generate user_id (replace with real implementation)

  return (
    <Dialog onOpenChange={() => reset()}>
      <DialogTrigger asChild>
        <Button variant="outline">+</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Order</DialogTitle>
          <DialogDescription>
            Add your new order here. Click submit when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          {/* Email */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Items
            </Label>
            <Input
              id="email"
              type="number"
              {...register('items')}
              className="col-span-3"
              placeholder="Enter email address"
            />
            {errors.items && (
              <p className="col-span-4 text-red-500 text-sm">
                {errors.items.message}
              </p>
            )}
          </div>

          {/* First Name */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="first_name" className="text-right">
              Total
            </Label>
            <Input
              id="first_name"
              type="number"
              {...register('total')}
              className="col-span-3"
              placeholder="Enter first name"
            />
            {errors.total && (
              <p className="col-span-4 text-red-500 text-sm">
                {errors.total.message}
              </p>
            )}
          </div>

          {/* Last Name */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="last_name" className="text-right">
              Order Status
            </Label>
            <Controller
              name="order_status"
              control={control}
              render={({ field }) => (
                <OrderStatusComboBox
                  value={field.value}
                  onChange={field.onChange} // Connect combobox to react-hook-form
                />
              )}
            />
            {errors.customer_id && (
              <p className="col-span-4 text-red-500 text-sm">
                {errors.customer_id.message}
              </p>
            )}
          </div>

          {/* Subscription Status */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="subscription_status" className="text-right">
              Customer
            </Label>
            <Controller
              name="customer_id"
              control={control}
              render={({ field }) => (
                <CustomersComboBox
                  customerData={customerData ? customerData : []}
                  value={field.value}
                  onChange={field.onChange} // Connect combobox to react-hook-form
                />
              )}
            />
            {errors.customer_id && (
              <p className="col-span-4 text-red-500 text-sm">
                {errors.customer_id.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button type="submit">Submit</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
