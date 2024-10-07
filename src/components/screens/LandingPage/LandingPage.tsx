'use client'

import { FAQ } from '@/components/LandingPage/FAQ'
import { Footer } from '@/components/LandingPage/Footer'
import { Header } from '@/components/LandingPage/Header'
import { Hero } from '@/components/LandingPage/Hero'
import { KeyFeatures } from '@/components/LandingPage/KeyFeatures'
import { Pricing } from '@/components/LandingPage/Pricing'
import { SecondaryHero } from '@/components/LandingPage/SecondaryHero'
import { Testimonials } from '@/components/LandingPage/Testimonials'

export function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen font-sans relative">
      <Header />
      <main className="flex-1">
        <Hero />
        <KeyFeatures />
        <Testimonials />
        <Pricing />
        <FAQ />
        <SecondaryHero />
      </main>
      <Footer />
    </div>
  )
}
