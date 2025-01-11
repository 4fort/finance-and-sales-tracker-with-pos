'use client'

import * as React from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

const orderStatus = [
  {
    value: 'pending',
    label: 'Pending',
  },
  {
    value: 'processing',
    label: 'Processing',
  },
  {
    value: 'delivered',
    label: 'Delivered',
  },
  {
    value: 'cancelled',
    label: 'Cancelled',
  },
  {
    value: 'shipped',
    label: 'Shipped',
  },
]
type SubscriptionComboBoxProps = {
  value: string
  onChange: (value: string) => void
}

export function OrderStatusComboBox({
  value,
  onChange,
}: SubscriptionComboBoxProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between">
          {value
            ? orderStatus.find(order => order.value === value)?.label
            : 'Select Order Status...'}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandGroup>
              {orderStatus.map(order => (
                <CommandItem
                  key={order.value}
                  value={order.value}
                  onSelect={currentValue => {
                    const newValue = currentValue === value ? '' : currentValue
                    onChange(newValue)
                    setOpen(false)
                  }}>
                  {order.label}
                  <Check
                    className={cn(
                      'ml-auto',
                      value === order.value ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
