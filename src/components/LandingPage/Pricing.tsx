import { Button } from '../ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card'

export function Pricing() {
  return (
    <section
      id="pricing"
      className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800 px-4 md:px-6">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
          Pricing Plans
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: 'Starter',
              price: '$29',
              features: [
                'Basic analytics',
                'Up to 1,000 orders/month',
                'Email support',
              ],
            },
            {
              name: 'Pro',
              price: '$99',
              features: [
                'Advanced analytics',
                'Unlimited orders',
                'Priority support',
                'API access',
              ],
            },
            {
              name: 'Enterprise',
              price: 'Custom',
              features: [
                'Custom solutions',
                'Dedicated account manager',
                'On-premise deployment option',
              ],
            },
          ].map((plan, index) => (
            <Card
              key={index}
              className="hover:scale-110 duration-200 hover:bg-gray-950 hover:text-white group">
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>
                  <span className="text-3xl font-bold">{plan.price}</span>
                  {plan.price !== 'Custom' && (
                    <span className="text-sm font-normal">/month</span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2">
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex}>{feature}</li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full group-hover:bg-white group-hover:text-black">
                  {index === 2 ? 'Contact Sales' : 'Get Started'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
