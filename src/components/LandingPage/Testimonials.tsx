/* eslint-disable react/no-unescaped-entities */
import Image from 'next/image'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card'

const testimonials = [
  {
    name: 'Alex Johnson',
    role: 'E-commerce Manager',
    content:
      'AdminCommerce has revolutionized how we manage our online store. The analytics are top-notch!',
  },
  {
    name: 'Sarah Lee',
    role: 'Small Business Owner',
    content:
      "As a small business owner, this platform has been a game-changer. It's intuitive and powerful.",
  },
  {
    name: 'Michael Chen',
    role: 'Marketing Director',
    content:
      'The customer segmentation tools have helped us create highly targeted campaigns. Fantastic results!',
  },
]

export function Testimonials() {
  return (
    <section
      id="testimonials"
      className="w-full min-h-[90vh] py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-800 px-4 md:px-6 flex flex-row justify-center items-center">
      <div className="w-[90%] md:w-[70%] flex flex-col space-y-12">
        <Header />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  )
}

const Header = () => (
  <div className="flex flex-col justify-center items-center">
    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center">
      What Our Users Say
    </h2>
    <p className="text-center max-w-[600px] mx-auto mt-4 text-gray-700 dark:text-gray-300 md:text-xl">
      Discover how AdminCommerce has empowered businesses to grow with our
      powerful tools and customer-focused solutions
    </p>
  </div>
)

const TestimonialCard = ({ testimonial }: any) => (
  <Card className="hover:scale-110 duration-200 hover:bg-gray-950 hover:text-white group">
    <CardHeader>
      <CardTitle>{testimonial.name}</CardTitle>
      <CardDescription>{testimonial.role}</CardDescription>
    </CardHeader>
    <CardContent>
      <p>"{testimonial.content}"</p>
    </CardContent>
  </Card>
)
