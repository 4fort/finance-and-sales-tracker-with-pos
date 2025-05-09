import useSWR from 'swr'
import axios from '@/lib/axios'
import { useEffect } from 'react'
import { AxiosResponse } from 'axios'
import { useRouter, useParams } from 'next/navigation'

export const useAuth = ({
  middleware,
  redirectIfAuthenticated,
}: {
  middleware?: string
  redirectIfAuthenticated?: string
}) => {
  const router = useRouter()
  const params = useParams()
  const {
    data: user,
    error,
    mutate,
    isLoading,
  } = useSWR('/api/user', async () => {
    try {
      // const res = await axios.get('/api/user')
      // return res.data
    } catch (error: any) {
      if (error.response?.status === 409) {
        router.push('/verify-email')
      } else {
        throw error
      }
    }
  })

  const csrf = async () => {
    await axios.get('/sanctum/csrf-cookie')
  }

  const register = async (data: {
    name: string
    email: string
    password: string
    password_confirmation: string
  }) => {
    try {
      // await csrf()
      await axios.post('/register', data)
      mutate()
    } catch (error) {
      throw error
    }
  }

  const login = async (data: {
    email: string
    password: string
    remember: boolean
  }) => {
    try {
      await csrf()
      await axios.post('/login', data)
      mutate()
    } catch (error) {
      throw error
    }
  }

  const forgotPassword = async (data: {
    email: string
  }): Promise<AxiosResponse> => {
    try {
      await csrf()
      return await axios.post('/forgot-password', data)
    } catch (error) {
      throw error
    }
  }

  const resetPassword = async (data: {
    email: string
    password: string
    password_confirmation: string
  }) => {
    try {
      await csrf()
      const response = await axios.post('/reset-password', {
        ...data,
        token: params.token,
      })
      router.push('/login?reset=' + btoa(response.data.status))
    } catch (error) {
      throw error
    }
  }

  const resendEmailVerification = async () => {
    try {
      return await axios.post('/email/verification-notification')
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    if (!error) {
      await axios.post('/logout')
      mutate()
    }
    window.location.pathname = '/login'
  }

  useEffect(() => {
    const handleRedirection = async () => {
      if (middleware === 'guest' && redirectIfAuthenticated && user) {
        router.push(redirectIfAuthenticated)
      }

      if (
        window.location.pathname === '/verify-email' &&
        redirectIfAuthenticated
      ) {
        router.push(redirectIfAuthenticated)
      }

      if (middleware === 'auth' && error) {
        await logout()
      }
    }

    handleRedirection()
  }, [user, error, middleware, redirectIfAuthenticated])

  return {
    user,
    register,
    login,
    forgotPassword,
    resetPassword,
    resendEmailVerification,
    logout,
    isLoading,
  }
}
