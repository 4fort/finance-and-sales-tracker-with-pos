'use client'
import Link from 'next/link'
import axios, { AxiosError } from 'axios'
import { ShoppingCart } from 'lucide-react'
import { useAuth } from '@/hooks/auth'
import styles from '../Auth/registerPage.module.css'
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik'
import * as Yup from 'yup'
import { redirect, useRouter } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { supabase } from '@/lib/supabase'
import { ErrorToast } from '@/components/ErrorToast'
import { useToast } from '@/hooks/use-toast'
import { ToastAction } from '@/components/ui/toast'
// import { createClient } from '@/lib/supabase'

interface Values {
  name: string
  email: string
  password: string
  password_confirmation: string
}

export const description =
  "A login page with two columns. The first column has the login form with email and password. There's a Forgot your passwork link and a link to sign up if you do not have an account. The second column has a cover image."

export function RegisterPage() {
  const { toast } = useToast()
  const router = useRouter()
  const { register } = useAuth({
    middleware: 'guest',
    redirectIfAuthenticated: '/dashboard',
  })

  const submitForm = async (
    values: Values,
    { setSubmitting, setErrors }: FormikHelpers<Values>,
  ): Promise<any> => {
    try {
      // const supabase = createClient()

      // type-casting here for convenience
      // in practice, you should validate your inputs

      const { error, data } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            name: values.name,
            profile: {
              username: values.name,
              bio: '',
            },
          },
        },
      })

      if (error) {
        console.error(error)
        toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong.',
          description: error.message,
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        })
        return
      }

      if (data) {
        window.location.reload()
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: error,
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      })
      console.error(error)
    } finally {
      setSubmitting(false)
    }
  }

  const RegisterSchema = Yup.object().shape({
    name: Yup.string().required('The name field is required.'),
    email: Yup.string()
      .email('Invalid email')
      .required('The email field is required.'),
    password: Yup.string().required('The password field is required.'),
    password_confirmation: Yup.string()
      .required('Please confirm password.')
      .oneOf([Yup.ref('password')], 'Your passwords do not match.'),
  })

  return (
    <div className={styles['page-container']}>
      <div className={styles['left-column']}>
        <div className={styles['form-container']}>
          <div
            className={styles['form-brand']}
            onClick={() => router.push('/')}>
            <ShoppingCart className={styles['cart-icon']} />
            <h1>FASTracking System</h1>
          </div>
          <div className={styles['form-header']}>
            <h1 className={styles['form-title']}>Join Now!</h1>
            <p className={styles['form-description']}>
              Create your account and enjoy your admin experience with us.
            </p>
          </div>
          <div className={styles['form-body']}>
            <Formik
              onSubmit={submitForm}
              validationSchema={RegisterSchema}
              initialValues={{
                name: '',
                email: '',
                password: '',
                password_confirmation: '',
              }}>
              <Form className={styles['form']}>
                <div>
                  <label htmlFor="name" className={styles['label']}>
                    Name
                  </label>
                  <Field
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    className={styles['input']}
                  />
                  <ErrorMessage
                    name="name"
                    component="span"
                    className={styles['error']}
                  />
                </div>

                <div>
                  <label htmlFor="email" className={styles['label']}>
                    Email
                  </label>
                  <Field
                    id="email"
                    name="email"
                    type="email"
                    placeholder="JohnDoe@email.com"
                    className={styles['input']}
                  />
                  <ErrorMessage
                    name="email"
                    component="span"
                    className={styles['error']}
                  />
                </div>

                <div>
                  <label htmlFor="password" className={styles['label']}>
                    Password
                  </label>
                  <Field
                    id="password"
                    name="password"
                    type="password"
                    className={styles['input']}
                  />
                  <ErrorMessage
                    name="password"
                    component="span"
                    className={styles['error']}
                  />
                </div>

                <div>
                  <label
                    htmlFor="password_confirmation"
                    className={styles['label']}>
                    Confirm Password
                  </label>
                  <Field
                    id="password_confirmation"
                    name="password_confirmation"
                    type="password"
                    className={styles['input']}
                  />
                  <ErrorMessage
                    name="password_confirmation"
                    component="span"
                    className={styles['error']}
                  />
                </div>

                <div className={styles['form-footer']}>
                  <button type="submit" className={styles['submit-button']}>
                    Register
                  </button>
                  <Link href="/login" className={styles['login-link']}>
                    Already registered?
                  </Link>
                </div>
              </Form>
            </Formik>
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
      </div>
    </div>
  )
}
