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
import { Info } from 'lucide-react'
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
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

// This can come from your database or API.

export function ProfileForm() {
  const [userPrefBusinessProfile, setuserPrefBusinessProfile] = useState<
    number | undefined
  >(undefined)
  const [isCreateBusinessProfileFormOpen, setIsCreateBusinessProfileFormOpen] =
    useState(false)

  const [user, setUser] = useState<User | null>(null)
  const getUser = async () => {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()
      if (error) {
        throw error.message
      }
      if (user) {
        setuserPrefBusinessProfile(user.user_metadata.profile.business_profile)
        form.setValue('email', user.email)
        setUser(user)
        form.setValue(
          'business_profile',
          user.user_metadata.profile.business_profile,
        )
      }
    } catch (error) {
      console.error(error)
    }
  }

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      email: '',
      business_profile: undefined,
    },
    values: {
      email: user?.email,
      business_profile: user?.user_metadata.profile.business_profile,
    },
    mode: 'onChange',
  })

  const { profiles, setSelectedProfile } = useBusinessProfileContext()

  // const userPrefBusinessProfile = user?.user_metadata.profile.business_profile

  useEffect(() => {
    getUser()
  }, [])

  async function onSubmit(data: ProfileFormValues) {
    try {
      const { data: userData, error } = await supabase.auth.updateUser({
        data: {
          profile: {
            business_profile: data.business_profile,
          },
        },
      })
      if (error) {
        throw error
      }
      if (userData) {
        toast({
          title: 'Successfully updated profile information',
          description: userData.user.email,
        })
        if (userData.user.user_metadata.profile.business_profile) {
          setuserPrefBusinessProfile(
            userData.user.user_metadata.profile.business_profile,
          )
        }
        if (data.business_profile) {
          const _selectedProfile = profiles.find(
            profile => profile.id === data.business_profile,
          )
          setSelectedProfile(_selectedProfile ?? profiles[0])
        }
      }
    } catch (error) {
      console.error(error)
    }
    // toast({
    //   title: "You submitted the following values:",
    //   description: (
    //     <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
    //       <code className="text-white">{JSON.stringify(data, null, 2)}</code>
    //     </pre>
    //   ),
    // registry/new-york})
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="business_profile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Profile</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value?.toString()}
                    value={field.value?.toString()}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your prefered business profile" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {profiles.map(profile => (
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
                  <FormDescription>
                    This is the business profile that will be used for your
                    transactions and receipts. You can also temporarily switch
                    profile at the top-left corner of your screen.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {(!userPrefBusinessProfile || userPrefBusinessProfile === 2) && (
              <div className="flex items-center space-x-2 text-amber-700 bg-amber-100 border border-amber-400 p-2 rounded-md">
                <Info className="w-6 self-start" />
                <p>
                  You are currently using the default business profile. It is
                  advised to create or use a custom business profile to manage
                  your business information effectively.
                </p>
              </div>
            )}
            <div className="flex flex-col w-min space-y-4">
              <Button
                variant="outline"
                type="button"
                onClick={() => setIsCreateBusinessProfileFormOpen(true)}>
                Create a custom business profile
              </Button>
            </div>
          </div>
          <Button type="submit">Update business profile</Button>
        </form>
      </Form>
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
                userId={user?.id}
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
        </div>

        <Button type="submit" disabled={isPending}>
          Create Business Profile
        </Button>
      </form>
    </Form>
  )
}
