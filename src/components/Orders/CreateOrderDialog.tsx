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
import { useMutation, useQueryClient } from '@tanstack/react-query'

// Define the Zod schema (without user_id)
const customerSchema = z.object({
  items: z.coerce.number(),
  order_status: z.string().min(1, 'Order status is required'),
  total: z.coerce.number(),
  customer_id: z.number().min(1, 'Customer is required'),
})

// Infer the TypeScript type from the schema
type OrderFormValues = z.infer<typeof customerSchema>

export function CreateOrderDialog() {
  const queryClient = useQueryClient()
  const { user } = useAuth({ middleware: 'auth' })
  const baseUrl = `api/v1/customers?user_id=${user.id}`
  // const csrfToken = Cookies.get('XSRF-TOKEN')

  const {
    data: customerData,
    error,
    mutate,
    isLoading,
  } = useSWR(baseUrl, async () => {
    try {
      const res = await axios.get(baseUrl)
      return res.data.data as Customer[]
    } catch (error: any) {
      console.error(error)
    }
  })
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
      customer_id: 0,
    },
  })
  // const {
  //   data: user,
  //   error,
  //   mutate,
  //   isLoading,
  // } = useSWR('/api/user', async () => {
  //   try {
  //     const res = await axios.get('/api/user')
  //     return res.data
  //   } catch (error: any) {
  //     if (error.response?.status === 409) {
  //       // router.push('/verify-email')
  //     } else {
  //       throw error
  //     }
  //   }
  // })
  const { mutateAsync: createOrderMutation } = useMutation({
    mutationFn: async (data: OrderFormValues) => {
      const orderData = {
        ...data,
        user_id: user.id,
        // Add user_id dynamically
      }
      try {
        const csrf = async () => {
          await axios.get('/sanctum/csrf-cookie')
        }
        const baseUrl = `/api/v1/orders`

        await csrf()
        await axios.post(baseUrl, orderData)
        //   mutate()
        //   const response = await fetch(baseUrl, {
        //     method: 'POST',
        //     headers: {
        //       Accept: 'application/json',
        //       'Content-Type': 'application/json',
        //       // Add this if you're using authentication
        //       // 'Authorization': 'Bearer your_token_here'
        //     },
        //     body: JSON.stringify(customerData),
        //   })

        //   if (!response.ok) {
        //     throw new Error(`HTTP error! status: ${response.status}`)
        //   }
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
      user_id: user.id,
      // Add user_id dynamically
    }

    await createOrderMutation(orderData)
  }

  // Dummy function to generate user_id (replace with real implementation)
  const generateUserId = () => Math.floor(Math.random() * 10000)

  return (
    <Dialog onOpenChange={() => reset()}>
      <DialogTrigger asChild>
        <Button variant="outline">+</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Order</DialogTitle>
          <DialogDescription>
            Add your new order here. Click submit when you're done.
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
