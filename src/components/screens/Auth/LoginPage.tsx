import Image from 'next/image'
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
      await login({
        email: values.email,
        password: values.password,
      })
    } catch (error: Error | AxiosError | any) {
      if (axios.isAxiosError(error) && error.response?.status === 422) {
        const dbErrors = error.response?.data?.errors
        if (dbErrors) {
          Object.keys(dbErrors).forEach(field => {
            form.setError(field as keyof typeof values, {
              type: 'manual',
              message: dbErrors[field][0], // Assuming the error message is an array
            })
          })
        } else {
          form.setError('email', {
            type: 'manual',
            message: 'Something went wrong. Please try again.',
          })
        }
      }
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
            <h1>AdminCommerce</h1>
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
          <div className={styles['form-footer']}>
            Don&apos;t have an account?{' '}
            <Link href="/register" className={styles['form-footer-link']}>
              Sign up
            </Link>
          </div>
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
