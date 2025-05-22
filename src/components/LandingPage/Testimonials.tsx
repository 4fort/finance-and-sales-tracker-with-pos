/* eslint-disable react/no-unescaped-entities */
import Image from 'next/image'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card'
import React, { ReactNode } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
type TestimonialsType = {
  name: string
  role: string
  content: string
  image_url: string
}

type TestimonialsProps = {
  index: number
}
const testimonials = [
  {
    name: 'Alex Johnson',
    role: 'E-commerce Manager',
    content:
      'COTEJAR STORE BINDOY: TRACKING SYSTEM has revolutionized how we manage our online store. The analytics are top-notch!',
    image_url:
      'https://media6.ppl-media.com/mediafiles/blogs/shutterstock_1491969896_9198201c3a.jpg',
  },
  {
    name: 'Sarah Lee',
    role: 'Small Business Owner',
    content:
      "As a small business owner, this platform has been a game-changer. It's intuitive and powerful.",
    image_url:
      'data:image/jpeg;base64,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',
  },
  {
    name: 'Michael Chen',
    role: 'Marketing Director',
    content:
      'The customer segmentation tools have helped us create highly targeted campaigns. Fantastic results!',
    image_url:
      'https://i.pinimg.com/564x/75/16/6f/75166fad74d76fcd5168abdaf18cf4f7.jpg',
  },
]

export function Testimonials() {
  return (
    <section
      id="testimonials"
      className="w-full min-h-[70vh] py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-800 px-4 md:px-6 flex flex-row justify-center items-center">
      <div className="w-[90%] md:w-[70%] flex flex-col space-y-12">
        <Header />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial: TestimonialsType, index) => (
            <TestimonialCard
              key={index}
              testimonials={testimonial}
              index={index}
            />
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
      Discover how COTEJAR STORE BINDOY: TRACKING SYSTEM has empowered
      businesses to grow with our powerful tools and customer-focused solutions
    </p>
  </div>
)

const TestimonialCard = ({
  testimonials,
  index,
}: {
  testimonials: TestimonialsType
  index: number
}) => (
  <Card
    className={`${
      index === 1
        ? 'scale-110  bg-gray-900 text-white'
        : 'transform  hover:scale-105 transition-transform duration-300 hover:bg-gray-900 hover:text-white group'
    }  `}>
    <CardHeader>
      <Avatar className="w-14 h-14">
        <AvatarImage className="object-cover " src={testimonials.image_url} />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>

      <CardTitle>{testimonials.name}</CardTitle>
      <CardDescription>{testimonials.role}</CardDescription>
    </CardHeader>
    <CardContent>
      <p>"{testimonials.content}"</p>
    </CardContent>
  </Card>
)
