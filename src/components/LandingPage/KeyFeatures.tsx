import { BarChart2, ShoppingCart, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

export function KeyFeatures() {
  return (
    <section
      id="features"
      className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800 px-4 md:px-6">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
          Key Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="hover:scale-110 duration-200 hover:bg-gray-950 hover:text-white group">
            <CardHeader>
              <BarChart2 className="h-8 w-8 mb-2 text-primary group-hover:text-white" />
              <CardTitle>Advanced Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Gain deep insights into your sales, customer behavior, and
                inventory trends.
              </p>
            </CardContent>
          </Card>
          <Card className="hover:scale-110 duration-200 hover:bg-gray-950 hover:text-white group">
            <CardHeader>
              <ShoppingCart className="h-8 w-8 mb-2 text-primary group-hover:text-white" />
              <CardTitle>Order Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Efficiently process orders, manage returns, and track shipments
                in real-time.
              </p>
            </CardContent>
          </Card>
          <Card className="hover:scale-110 duration-200 hover:bg-gray-950 hover:text-white group">
            <CardHeader>
              <Users className="h-8 w-8 mb-2 text-primary group-hover:text-white" />
              <CardTitle>Customer Relationships</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Build lasting relationships with integrated CRM tools and
                personalized marketing.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
