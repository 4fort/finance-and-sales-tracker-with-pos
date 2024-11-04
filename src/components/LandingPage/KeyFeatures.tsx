import { BarChart2, ShoppingCart, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

export function KeyFeatures() {
  return (
    <section
      id="features"
      className="w-full min-h-[70vh] py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800 px-4 md:px-6 flex flex-row justify-center items-center">
      <div className="w-[90%] md:w-[70%] flex flex-col space-y-12">
        <div className="flex flex-col justify-center items-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center">
            Key Features
          </h2>
          <p
            className="
            text-center
            max-w-[600px]
            mx-auto
            mt-4
            text-gray-700
            dark:text-gray-300
            md:text-xl
          ">
            Explore the essential tools designed to streamline your operations
            and foster growth.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={
              <BarChart2 className="h-6 w-6 mb-2 text-primary group-hover:text-white" />
            }
            title="Advanced Analytics"
            description="Gain deep insights into your sales, customer behavior, and inventory trends."
          />
          <FeatureCard
            icon={
              <ShoppingCart className="h-6 w-6 mb-2 text-primary text-white" />
            }
            title="Order Management"
            description="Efficiently process orders, manage returns, and track shipments in real-time."
          />
          <FeatureCard
            icon={
              <Users className="h-6 w-6 mb-2 text-primary group-hover:text-white" />
            }
            title="Customer Relationships"
            description="Build lasting relationships with integrated CRM tools and personalized marketing."
          />
        </div>
      </div>
    </section>
  )
}

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card
      className={`${
        title === 'Order Management'
          ? 'scale-110  bg-gray-900 text-white '
          : 'transform  hover:scale-105 transition-transform duration-300 hover:bg-gray-900 hover:text-white group'
      }  `}>
      <CardHeader className="flex flex-col items-start text-start">
        {icon}
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p
          className={`${
            title === 'Order Management'
              ? 'text-white'
              : 'text-gray-700 dark:text-gray-300 group-hover:text-gray-100 '
          } `}>
          {description}
        </p>
      </CardContent>
    </Card>
  )
}
