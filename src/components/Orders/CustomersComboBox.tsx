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
import { Customer } from '@/app/(authenticated)/customers/page'

// const frameworks = [
//   {
//     value: 'active',
//     label: 'Active',
//   },
//   {
//     value: 'offline',
//     label: 'Offline',
//   },
// ]
type SubscriptionComboBoxProps = {
  value: number
  onChange: (value: number) => void
  customerData: Customer[]
}

export function CustomersComboBox({
  value,
  onChange,
  customerData,
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
            ? customerData.find(customer => customer.id === value)?.email
            : 'Select Customer...'}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search framework..." className="h-9" />
          <CommandList>
            <CommandEmpty>No customer found.</CommandEmpty>

            <CommandGroup>
              {customerData.map(customer => (
                <CommandItem
                  key={customer.id}
                  value={customer.id.toString()}
                  onSelect={currentValue => {
                    const newValue =
                      parseInt(currentValue) === value ? '' : currentValue
                    onChange(parseInt(newValue))
                    setOpen(false)
                  }}>
                  {customer.email}
                  <Check
                    className={cn(
                      'ml-auto',
                      value === customer.id ? 'opacity-100' : 'opacity-0',
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
