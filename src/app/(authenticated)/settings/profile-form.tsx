'use client'

import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import { useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
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

const profileFormSchema = z.object({
  // username: z
  //   .string()
  //   .min(2, {
  //     message: 'Username must be at least 2 characters.',
  //   })
  //   .max(30, {
  //     message: 'Username must not be longer than 30 characters.',
  //   }),
  email: z
    .string({
      required_error: 'Please select an email to display.',
    })
    .email()
    .optional(),
  bio: z.string().max(160).min(4),
  // urls: z
  //   .array(
  //     z.object({
  //       value: z.string().url({ message: 'Please enter a valid URL.' }),
  //     }),
  //   )
  //   .optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

// This can come from your database or API.

export function ProfileForm() {
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
        // console.log(user)
        // setUser(user)

        form.reset({
          email: user.email,
          bio: user.user_metadata.profile.bio,
          // username: user.user_metadata.profile.username,
        })
      }
    } catch (error) {
      console.error(error)
    }
  }
  useEffect(() => {
    getUser()
  }, [])

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      email: '',
      bio: '',
      // username: '',
    },
    mode: 'onChange',
  })

  // const { fields, append } = useFieldArray({
  //   name: 'urls',
  //   control: form.control,
  // })

  async function onSubmit(data: ProfileFormValues) {
    try {
      const { data: userData, error } = await supabase.auth.updateUser({
        data: {
          profile: {
            // username: data.username,
            bio: data.bio,
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} className="bg-white" />
              </FormControl>
              <FormDescription>
                This is your public display name. It can be your real name or a
                pseudonym. You can only change this once every 30 days.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        /> */}
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
              <FormDescription>Manage your email address here.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us a little bit about yourself"
                  className="resize-none bg-white"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                You can <span>@mention</span> other users and organizations to
                link to them.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* <div>
          {fields.map((field, index) => (
            <FormField
              control={form.control}
              key={field.id}
              name={`urls.${index}.value`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(index !== 0 && 'sr-only')}>
                    URLs
                  </FormLabel>
                  <FormDescription className={cn(index !== 0 && 'sr-only')}>
                    Add links to your website, blog, or social media profiles.
                  </FormDescription>
                  <FormControl>
                    <Input {...field} className="bg-white" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => append({ value: '' })}>
            Add URL
          </Button>
        </div> */}
        <Button type="submit">Update profile</Button>
      </form>
    </Form>
  )
}
