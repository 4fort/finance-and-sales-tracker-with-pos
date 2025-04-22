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

// This can come from your database or API.

export function ProfileForm() {
  const [userPrefBusinessProfile, setuserPrefBusinessProfile] = useState<
    number | undefined
  >(undefined)
  const [isCreateBusinessProfileFormOpen, setIsCreateBusinessProfileFormOpen] =
    useState(false)

  const { profiles, selectedProfile, setSelectedProfile } =
    useBusinessProfileContext()

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
        form.setValue('manager_name', selectedProfile?.manager_name)
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
      manager_name: '',
    },
    values: {
      email: user?.email,
      business_profile: user?.user_metadata.profile.business_profile,
      manager_name: selectedProfile?.manager_name,
    },
    mode: 'onChange',
  })

  // const userPrefBusinessProfile = user?.user_metadata.profile.business_profile

  useEffect(() => {
    getUser()
  }, [])

  const queryClient = useQueryClient()

  async function onSubmit(data: ProfileFormValues) {
    try {
      const { data: userData, error } = await supabase.auth.updateUser({
        data: {
          profile: {
            business_profile: data.business_profile,
          },
        },
      })

      const { data: businessProfile, error: businessProfileError } =
        await supabase
          .from('business_profiles')
          .update({
            manager_name: data.manager_name,
          })
          .eq('id', data.business_profile)

      if (error || businessProfileError) {
        throw error ?? businessProfileError
      }
      if (userData || businessProfile) {
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
          queryClient.invalidateQueries({ queryKey: ['businessProfiles'] })

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
                        <SelectTrigger className="w-[180px]">
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
            {!userPrefBusinessProfile || userPrefBusinessProfile === 2 ? (
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
                    <div>Manager name</div>
                  </div>
                  <div className="space-y-4 divide-y">
                    <div>{selectedProfile.shop_name}</div>
                    <div>{selectedProfile.street}</div>
                    <div>{selectedProfile.city}</div>
                    <div>{selectedProfile.state}</div>
                    <div>{selectedProfile.zip_code}</div>
                    <div>
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
                    </div>
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
