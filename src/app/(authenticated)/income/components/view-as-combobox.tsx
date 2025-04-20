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
import {
  ViewSelection,
  useIncomeContext,
  viewSelections,
} from '../income-context'

const items = viewSelections

export function ViewAsCombobox() {
  const [open, setOpen] = React.useState(false)
  const { viewSelection, setViewSelection } = useIncomeContext()

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between">
          {viewSelection ? (
            <>
              {viewSelection.icon && (
                <viewSelection.icon className="mr-2 h-4 w-4" />
              )}
              {
                items.find(framework => framework.value === viewSelection.value)
                  ?.label
              }
            </>
          ) : (
            'View as...'
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {items.map(item => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={_currentValue => {
                    const currentValue = _currentValue as ViewSelection['value']
                    setViewSelection(
                      items.find(
                        _item => _item.value === currentValue,
                      ) as ViewSelection,
                    )
                    setOpen(false)
                  }}>
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      viewSelection?.value === item.value
                        ? 'opacity-100'
                        : 'opacity-0',
                    )}
                  />
                  {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
