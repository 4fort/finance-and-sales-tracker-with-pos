import Image from 'next/image'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card'
import image from '../../../public/next.svg'
export function Testimonials() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 px-4 md:px-6 bg-white">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
          What Our Users Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
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
          ].map((testimonial, index) => (
            <Card
              className="hover:scale-110 duration-200 hover:bg-gray-950 hover:text-white group"
              key={index}>
              <CardHeader>
                <CardTitle>{testimonial.name}</CardTitle>
                <CardDescription>{testimonial.role}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>"{testimonial.content}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
