import { Button } from '@/components/ui/button'
import useSWR from 'swr'
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
import { SubscriptionComboBox } from './SubscriptionComboBox'
import axios from '@/lib/axios'
import { Customer } from '@/app/(authenticated)/customers/page'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

// Define the Zod schema (without user_id)
const customerSchema = z.object({
  email: z.string().email('Invalid email address'),
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  subscription_status: z.string().min(1, 'Subscription status is required'),
})

// Infer the TypeScript type from the schema
type CustomerFormValues = z.infer<typeof customerSchema>

export function UpdateCustomerDialog({
  customerId,
  customer,
}: {
  customerId: string
  customer: Customer
}) {
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      email: customer.email,
      first_name: customer.first_name,
      last_name: customer.last_name,
      subscription_status: customer.subscription_status,
      // customer_data: customer.id, // Default value for the combobox
    },
  })
  const queryClient = useQueryClient()
  const { mutateAsync: updateCustomerMutation } = useMutation({
    mutationFn: async (mutateData: CustomerFormValues) => {
      console.log('mutate data: ', mutateData)
      console.log(customerId)
      try {
        const { error, data } = await supabase
          .from('customers')
          .update(mutateData)
          .eq('id', customerId)
        if (error) {
          console.error(error)
        }

        if (data) {
          console.log('response update data: ', data)
        }
        reset()
      } catch (error) {
        console.error(error)
      }
      // Reset the form after submission
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
    },
  })
  const onSubmit = async (data: CustomerFormValues) => {
    await updateCustomerMutation(data)
  }

  // Dummy function to generate user_id (replace with real implementation)
  const generateUserId = () => Math.floor(Math.random() * 10000)

  return (
    <Dialog onOpenChange={() => reset()}>
      <DialogTrigger asChild>
        <p className="text-sm px-2 py-1 cursor-pointer hover:bg-gray-50">
          Update customer
        </p>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Customer Info</DialogTitle>
          <DialogDescription>
            Update customer info here. Click submit when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          {/* Email */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              {...register('email')}
              className="col-span-3"
              placeholder="Enter email address"
            />
            {errors.email && (
              <p className="col-span-4 text-red-500 text-sm">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* First Name */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="first_name" className="text-right">
              First Name
            </Label>
            <Input
              id="first_name"
              {...register('first_name')}
              className="col-span-3"
              placeholder="Enter first name"
            />
            {errors.first_name && (
              <p className="col-span-4 text-red-500 text-sm">
                {errors.first_name.message}
              </p>
            )}
          </div>

          {/* Last Name */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="last_name" className="text-right">
              Last Name
            </Label>
            <Input
              id="last_name"
              {...register('last_name')}
              className="col-span-3"
              placeholder="Enter last name"
            />
            {errors.last_name && (
              <p className="col-span-4 text-red-500 text-sm">
                {errors.last_name.message}
              </p>
            )}
          </div>

          {/* Subscription Status */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="subscription_status" className="text-right">
              Subscription
            </Label>
            <Controller
              name="subscription_status"
              control={control}
              render={({ field }) => (
                <SubscriptionComboBox
                  value={field.value}
                  onChange={field.onChange} // Connect combobox to react-hook-form
                />
              )}
            />
            {errors.subscription_status && (
              <p className="col-span-4 text-red-500 text-sm">
                {errors.subscription_status.message}
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
