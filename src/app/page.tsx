'use client'

import Head from 'next/head'
import Link from 'next/link'
import { useAuth } from '@/hooks/auth'
import { Dashboard } from '@/components/dashboard-05'
import { LandingPage } from '@/components/screens/LandingPage/LandingPage'

export default function Home() {
  return <LandingPage />
}
