import { Button } from '../ui/button'
import Image from 'next/image'

export function SecondaryHero() {
  return (
    <section
      id="faq"
      className="w-full min-h-[80vh] py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800 px-4 md:px-6 flex flex-row justify-center items-center relative">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={require('../../../public/secondary-hero.jpg')} // Replace with your image path
          alt="Background Image"
          layout="fill"
          objectFit="cover"
          className="opacity-50" // Adjust opacity if needed
        />
      </div>

      {/* Dark Color Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-70 z-0"></div>

      <div className="w-[90%] md:w-[70%] flex flex-col space-y-12 relative z-10">
        <div className="flex flex-col space-y-12 justify-center items-center">
          <div className="space-y-4 flex flex-col justify-center items-center">
            <h2 className="w-[70%] text-center text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
              Ready to Transform Your E-commerce Business?
            </h2>
            <p className="mx-auto max-w-[700px] text-white md:text-xl dark:text-gray-400">
              Join thousands of successful online stores using AdminCommerce.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Button size="lg">Start Free Trial</Button>
            <Button variant="outline" size="lg">
              Schedule a Demo
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
