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
      className="w-full min-h-[90vh] py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800 px-4 md:px-6 flex flex-row justify-center items-center">
      <div className="w-[90%] md:w-[70%] flex flex-col space-y-12">
        <div className="flex flex-col justify-center items-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center">
            Pricing
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
            Choose the plan that best fits your business needs. All plans
            include a 14-day free trial.
          </p>
        </div>
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
              className="hover:scale-110 flex flex-col justify-between duration-200 hover:bg-gray-950 hover:text-white group">
              <div className="flex flex-col w-full">
                <CardHeader>
                  <CardTitle className="text-3xl">{plan.name}</CardTitle>
                  <CardDescription>
                    <span className="text-2xl font-bold">{plan.price}</span>
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
              </div>

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
