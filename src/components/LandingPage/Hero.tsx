import { MoveRight, PhoneCall } from 'lucide-react'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export const Hero = () => {
  const router = useRouter()

  return (
    <div className="w-full overflow-hidden relative z-10">
      <div className="container mx-auto">
        <div className="flex min-h-[90vh] gap-8 py-20 lg:py-40 items-center justify-center flex-col">
          <div className="flex gap-4 flex-col">
            <h1 className="text-5xl md:text-7xl max-w-2xl tracking-tighter text-center font-bold text-slate-900 dark:text-white">
              Supercharge Your E-commerce Business
            </h1>
            <p className="text-lg md:text-xl leading-relaxed tracking-tight text-slate-900 dark:text-white max-w-2xl text-center">
              Powerful admin tools to manage your online store, boost sales, and
              delight customers.
            </p>
          </div>
          <div className="flex flex-row gap-3">
            <Button
              size="lg"
              className="gap-4"
              variant="outline"
              onClick={() => router.push('/login')}>
              Get Started <MoveRight className="w-4 h-4" />
            </Button>
            <Button size="lg" className="gap-4">
              Learn More <PhoneCall className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
