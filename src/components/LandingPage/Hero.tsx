import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'
import heroImage from '../../../public/hero-image.jpg'
export function Hero() {
  const router = useRouter()

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 px-4 md:px-6 ">
      <div className="absolute inset-0 -z-20 w-full h-full">
        <video
          src={require('../../../public/hero-video-2.mp4')}
          autoPlay
          muted
          loop
          className="object-cover w-full h-full"
        />
      </div>
      <div className="container mx-auto">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-white">
              Supercharge Your E-commerce Business
            </h1>
            <p className="mx-auto max-w-[700px] text-white md:text-xl dark:text-white">
              Powerful admin tools to manage your online store, boost sales, and
              delight customers.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Button
              size="lg"
              onClick={() => router.push('/login')}
              className="bg-transparent border rounded-md">
              Get Started
            </Button>
            <Button variant="secondary" size="lg">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
