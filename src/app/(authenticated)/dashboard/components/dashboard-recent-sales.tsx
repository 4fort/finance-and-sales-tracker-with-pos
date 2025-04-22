import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { IncomeSalesRowType } from '@/types/Income'
import { Banknote, CreditCard, SmartphoneNfc } from 'lucide-react'
import React from 'react'

export default function DashboardRecentSales({
  sales,
  className,
}: {
  sales: IncomeSalesRowType[]
  className?: string
}) {
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Recent Sales</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead />
              <TableHead>ID</TableHead>
              <TableHead>Customer Name</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sales.map(sale => {
              const paymentMethod = sale.payment_method
              const nonCashMethods = ['gcash', 'grabpay', 'paymaya', 'paypal']
              const cardMethods = [
                'credit_card',
                'debit_card',
                'card',
                'credit',
                'debit',
              ]
              return (
                <TableRow key={sale.id}>
                  <TableCell>
                    <div className="flex items-center justify-center py-4">
                      <span className="rounded-lg bg-neutral-700 text-white h-auto p-1.5 aspect-square">
                        {nonCashMethods.includes(paymentMethod) ? (
                          <SmartphoneNfc
                            strokeWidth={1.5}
                            className="h-8 w-8 m-auto"
                          />
                        ) : cardMethods.includes(paymentMethod) ? (
                          <CreditCard
                            strokeWidth={1.5}
                            className="h-8 w-8 m-auto"
                          />
                        ) : (
                          <Banknote
                            strokeWidth={1.5}
                            className="h-8 w-8 m-auto"
                          />
                        )}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{sale.id}</TableCell>
                  <TableCell>{sale.customer_name}</TableCell>
                  <TableCell>
                    {sale.total_amount.toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'PHP',
                    })}
                  </TableCell>
                  <TableCell>
                    {new Date(sale.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              )
            })}
            {sales.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No sales data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
