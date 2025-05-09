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

export function CreateCustomerDialog({ user_id }: { user_id: any }) {
  const queryClient = useQueryClient()

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      email: '',
      first_name: '',
      last_name: '',
      subscription_status: '', // Default value for the combobox
    },
  })

  const { mutateAsync: createCustomerMutation } = useMutation({
    mutationFn: async ({ customerData }: { customerData: any }) => {
      try {
        const { data, error } = await supabase
          .from('customers')
          .insert(customerData)
        if (error) {
          console.error(error)
          return
        }
        reset()
      } catch (error) {
        console.error(error)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
    },
  })
  const onSubmit = async (data: CustomerFormValues) => {
    const customerData = {
      ...data,
      user_id: user_id, // Add user_id dynamically
    }
    await createCustomerMutation({ customerData })
    // Reset the form after submission
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
          <DialogTitle>Add New Customer</DialogTitle>
          <DialogDescription>
            Add your new customer here. Click submit when you&apos;re done.
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
