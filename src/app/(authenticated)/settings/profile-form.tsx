'use client'

import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import { useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { toast } from '@/hooks/use-toast'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  BusinessProfile,
  useBusinessProfileContext,
} from '@/app/business-profile-context'
import { Info, Plus } from 'lucide-react'
import { BusinessProfileSwitcher } from '@/components/Dashboard/business-profile-switcher'
import { Avatar, AvatarImage } from '@/components/ui/avatar'

const profileFormSchema = z.object({
  email: z
    .string({
      required_error: 'Please select an email to display.',
    })
    .email()
    .optional(),
  business_profile: z.coerce.number().optional(),
  manager_name: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

export function ProfileForm() {
  const { profiles, selectedProfile, setSelectedProfile } =
    useBusinessProfileContext()

  const [isCreateBusinessProfileFormOpen, setIsCreateBusinessProfileFormOpen] =
    useState(false)

  const { data: userData, isPending: userIsPending } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.auth.getUser()
        if (error) {
          console.error(error)
        }
        if (data && data.user) {
          return data
        }
      } catch (error) {
        console.error(error)
      }
    },
  })

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      email: '',
      business_profile: undefined,
      manager_name: '',
    },
    values: {
      email: userData?.user.email ?? '',
      business_profile:
        userData?.user.user_metadata?.profile?.business_profile ?? undefined,
      manager_name: selectedProfile?.manager_name ?? '',
    },
  })

  const queryClient = useQueryClient()

  const { mutateAsync: userMutate, isPending: userMutateIsPending } =
    useMutation({
      mutationFn: async (values: ProfileFormValues) => {
        const { data: userData, error } = await supabase.auth.updateUser({
          data: {
            profile: {
              business_profile: values.business_profile,
            },
          },
        })

        if (error) {
          throw error
        }
        return userData
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['user'] })

        toast({
          title: 'Business profile updated successfully.',
          description: 'You can now use this profile for your transactions.',
        })
      },
      onError: error => {
        toast({
          title: 'Error updating business profile',
          description: error.message,
          variant: 'destructive',
        })
      },
    })

  const onSubmit = async (values: ProfileFormValues) => {
    const payload = {
      ...values,
      business_profile: values.business_profile,
    }

    if (!userData?.user) {
      toast({
        title: 'Please try again later or reload the page.',
        variant: 'destructive',
      })
      return
    }

    try {
      await userMutate(payload)
      setSelectedProfile(
        profiles.find(profile => profile.id === values.business_profile) ||
          null,
      )
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="business_profile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Profile</FormLabel>
                  <div className="flex justify-between">
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value?.toString()}
                      value={field.value?.toString()}>
                      <FormControl>
                        <SelectTrigger className="w-[280px]">
                          <SelectValue placeholder="Select your prefered business profile" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {profiles
                          .sort((a, b) => a.id - b.id)
                          .map(profile => (
                            <SelectItem
                              key={profile.id}
                              value={profile.id.toString()}>
                              <div className="flex items-center">
                                <Avatar className="mr-2 h-5 w-5">
                                  <AvatarImage
                                    src={`https://avatar.vercel.sh/${profile?.id}.png`}
                                    className="grayscale"
                                  />
                                </Avatar>
                                {profile.shop_name}
                              </div>
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => setIsCreateBusinessProfileFormOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" /> Create custom business
                      profile
                    </Button>
                  </div>
                  <FormDescription>
                    This is the business profile that will be used for your
                    transactions and receipts. You can also temporarily switch
                    profile at the top-left corner of your screen.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {(!selectedProfile || selectedProfile.id) === 2 ? (
              <div className="flex items-center space-x-2 text-amber-700 bg-amber-100 border border-amber-400 p-2 rounded-md">
                <Info className="w-6 self-start" />
                <p>
                  You are currently using the default business profile. It is
                  advised to create or use a custom business profile to manage
                  your business information effectively.
                </p>
              </div>
            ) : (
              selectedProfile && (
                <div className="grid grid-cols-2">
                  <div className="space-y-4 divide-y text-muted-foreground">
                    <div>Shop name</div>
                    <div>Street</div>
                    <div>City</div>
                    <div>State</div>
                    <div>Zip code</div>
                    {/* <div>Manager name</div> */}
                  </div>
                  <div className="space-y-4 divide-y">
                    <div>{selectedProfile.shop_name}</div>
                    <div>{selectedProfile.street}</div>
                    <div>{selectedProfile.city}</div>
                    <div>{selectedProfile.state}</div>
                    <div>{selectedProfile.zip_code}</div>
                    {/* <div>
                      <FormField
                        control={form.control}
                        name="manager_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder="Manager name"
                                {...field}
                                className="bg-white"
                              />
                            </FormControl>
                            <FormDescription>
                              This is the name of the manager of the current
                              selected business profile.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div> */}
                  </div>
                </div>
              )
            )}
          </div>
          <FormField
            control={form.control}
            name="email"
            disabled={true}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" {...field} className="bg-white" />
                </FormControl>
                <FormDescription>
                  Manage your email address here.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Update business profile</Button>
        </form>
      </Form>
      {/* <Button
        onClick={() => {
          console.log('Form values:', form.getValues())
          console.log('Form errors:', form.formState.errors)

          const result = profileFormSchema.safeParse(form.getValues())

          if (!result.success) {
            const allErrors = result.error.format()

            // You can access all field errors
            console.log(allErrors.email?._errors)
            console.log(allErrors.business_profile?._errors)
            console.log(allErrors.manager_name?._errors)

            // Add a global error manually if needed
            return {
              ...allErrors,
              global: ['Something went wrong, please review the form.'],
            }
          }
        }}>
        test
      </Button>
      <Button
        onClick={() => {
          form.setValue('manager_name', 'test')
        }}>
        test2
      </Button> */}
      <Dialog
        open={isCreateBusinessProfileFormOpen}
        onOpenChange={setIsCreateBusinessProfileFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Custom Business Profile</DialogTitle>
            <DialogDescription asChild>
              <p className="text-sm text-muted-foreground">
                Create a new custom business profile to manage your business
                information effectively.
              </p>
            </DialogDescription>
            <div className="">
              <BusinessProfileForm
                userId={userData?.user.id}
                setIsOpen={setIsCreateBusinessProfileFormOpen}
              />
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  )
}

type BusinessProfileFormValues = Omit<
  BusinessProfile,
  'owner_id' | 'created_at'
>
const businessProfileFormSchema = z.object({
  shop_name: z.string().min(1, {
    message: 'Please enter a shop name.',
  }),
  street: z.string().min(1, {
    message: 'Please enter a street address.',
  }),
  city: z.string().min(1, {
    message: 'Please enter a city.',
  }),
  state: z.string().min(1, {
    message: 'Please enter a state.',
  }),
  zip_code: z.string().min(1, {
    message: 'Please enter a zip code.',
  }),
  manager_name: z.string().optional(),
})

function BusinessProfileForm({
  userId,
  setIsOpen,
}: {
  userId?: string
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const queryClient = useQueryClient()

  const form = useForm<BusinessProfileFormValues>({
    resolver: zodResolver(businessProfileFormSchema),
    defaultValues: {
      shop_name: '',
      city: '',
      state: '',
      street: '',
      zip_code: '',
      manager_name: '',
    },
  })

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (values: BusinessProfileFormValues) => {
      const payload = {
        ...values,
        owner_id: userId,
      }
      const { data, error } = await supabase
        .from('business_profiles')
        .insert([payload])
        .select()
      if (error) {
        throw error
      }
      return data
    },
    onSuccess: () => {
      toast({
        title: 'Business profile created successfully.',
        description: 'You can now use this profile for your transactions.',
      })
      queryClient.invalidateQueries({ queryKey: ['businessProfiles'] })
      setIsOpen(false)
    },
    onError: error => {
      toast({
        title: 'Error creating business profile',
        description: error.message,
        variant: 'destructive',
      })
    },
  })

  const onSubmit = async (values: BusinessProfileFormValues) => {
    const payload = {
      ...values,
      owner_id: userId,
    }

    if (!userId) {
      toast({
        title: 'Please try again later or reload the page.',
        variant: 'destructive',
      })
      return
    }

    try {
      await mutateAsync(payload)
      form.reset()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Form {...form}>
      <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
        <div>
          <FormField
            control={form.control}
            name="shop_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Shop Name</FormLabel>
                <FormControl>
                  <Input placeholder="Shop Name" {...field} />
                </FormControl>
                <FormDescription>
                  This is the name of your shop.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="street"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Street Address</FormLabel>
                <FormControl>
                  <Input placeholder="Street Address" {...field} />
                </FormControl>
                <FormDescription>Enter your street address.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="City" {...field} />
                </FormControl>
                <FormDescription>Enter your city.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Input placeholder="State" {...field} />
                </FormControl>
                <FormDescription>Enter your state.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="zip_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Zip Code</FormLabel>
                <FormControl>
                  <Input placeholder="Zip Code" {...field} />
                </FormControl>
                <FormDescription>Enter your zip code.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="manager_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Manager Name</FormLabel>
                <FormControl>
                  <Input placeholder="Manager Name" {...field} />
                </FormControl>
                <FormDescription>
                  This is the name of the manager of this business profile.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isPending}>
          Create Business Profile
        </Button>
      </form>
    </Form>
  )
}
