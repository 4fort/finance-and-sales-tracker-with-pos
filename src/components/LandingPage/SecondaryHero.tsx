import { Button } from '../ui/button'

export function SecondaryHero() {
  return (
    <section
      id="faq"
      className="w-full min-h-[90vh] py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800 px-4 md:px-6 flex flex-row justify-center items-center">
      <div className="w-[90%] md:w-[70%] flex flex-col space-y-12">
        <div className="flex flex-col space-y-12 justify-center items-center">
          <div className="space-y-4 flex flex-col justify-center items-center">
            <h2 className="w-[70%] text-center text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Ready to Transform Your E-commerce Business?
            </h2>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
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
