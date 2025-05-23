import Link from 'next/link'

import axios, { AxiosError } from 'axios'

import { Menu, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/auth'
// import loginImage from '../../../../public/'
import styles from '../Auth/loginPage.module.css'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { ToastAction } from '@/components/ui/toast'
import { useToast } from '@/hooks/use-toast'

const formSchema = z.object({
  email: z.string().min(1, {
    message: 'Email field is required.',
  }),
  password: z.string().min(1, {
    message: 'Password field is required.',
  }),
})

export const description =
  "A login page with two columns. The first column has the login form with email and password. There's a Forgot your passwork link and a link to sign up if you do not have an account. The second column has a cover image."

export function LoginPage() {
  const router = useRouter()
  // 1. Define your form.

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<string>('')
  const { toast } = useToast()

  const { login } = useAuth({
    middleware: 'guest',
    redirectIfAuthenticated: '/dashboard',
  })

  useEffect(() => {
    const resetToken = searchParams.get('reset')
    setStatus(resetToken ? atob(resetToken) : '')
  }, [searchParams])

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      })
      if (error) {
        toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong.',
          description: error.message,
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        })
        return
      }

      window.location.reload()
    } catch (error: Error | AxiosError | any) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: error.message,
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      })
      return
    } finally {
      setStatus('')
    }
  }

  return (
    <div className={styles['page-container']}>
      <div className={styles['left-column']}>
        <div className={styles['form-container']}>
          <div
            className={styles['form-brand']}
            onClick={() => router.push('/')}>
            <ShoppingCart className="h-10 w-10 mr-2 " />
            <h1>COTEJAR STORE BINDOY: TRACKING SYSTEM</h1>
          </div>
          <div className={styles['form-header']}>
            <h1 className={styles['form-title']}>Welcome back!</h1>
            <p className={styles['form-description']}>
              Enter your email below to login to your account
            </p>
          </div>
          <div className={styles['form-body']}>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className={styles['form']}>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={styles['form-label']}>
                        Email
                      </FormLabel>
                      <FormControl>
                        <input
                          placeholder="Sample@mail.com"
                          {...field}
                          className={styles['form-input']}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className={styles['form-item']}>
                      <FormLabel className={styles['form-label']}>
                        Password
                      </FormLabel>
                      <FormControl>
                        <input
                          className={styles['form-input']}
                          placeholder="Password"
                          {...field}
                          type="password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className={styles['button']}>
                  Login
                </Button>
              </form>
            </Form>
          </div>
          {/* <div className={styles['form-footer']}>
            Don&apos;t have an account?{' '}
            <Link href="/register" className={styles['form-footer-link']}>
              Sign up
            </Link>
          </div> */}
        </div>
      </div>
      <div className={styles['right-column']}>
        <video
          src={require('../../../../public/login-video.mp4')}
          autoPlay
          muted
          loop
          className={styles['cover-image']}
        />
        {/* <div className={styles['video-caption']}>
          Supercharge your eCommerce business with our all-in-one admin SaaS
          platform.
        </div> */}
      </div>
    </div>
  )
}
