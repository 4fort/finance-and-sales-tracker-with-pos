import { MoveRight, PhoneCall } from 'lucide-react'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import HeroImage from '../../../public/hero-image-3.jpg'
export const Hero = () => {
  const router = useRouter()

  return (
    <div className="w-full overflow-hidden relative z-10">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={HeroImage} // Path to your overlay image
          alt="Background Image"
          layout="fill" // Makes the image cover the entire container
          objectFit="cover" // Ensures the image scales properly
          className="opacity-50" // Adjust the opacity for a subtle overlay
        />
      </div>

      {/* Dark Color Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-70 z-0"></div>

      <div className="container mx-auto relative z-10">
        <div className="flex min-h-[90vh] gap-8 py-20 lg:py-40 items-center justify-center flex-col">
          <div className="flex gap-4 flex-col">
            <h1 className="text-5xl md:text-7xl max-w-2xl tracking-tighter text-center font-bold text-white">
              Supercharge Your E-commerce Business
            </h1>
            <p className="text-lg md:text-xl leading-relaxed tracking-tight  text-white max-w-2xl text-center">
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
