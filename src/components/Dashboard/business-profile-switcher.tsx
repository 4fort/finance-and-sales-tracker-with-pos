'use client'

import * as React from 'react'
import {
  CaretSortIcon,
  CheckIcon,
  PlusCircledIcon,
} from '@radix-ui/react-icons'

import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAuth } from '@/hooks/auth'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useBusinessProfileContext } from '@/app/business-profile-context'
import { profile } from 'console'

type Team = {
  value: string
  label: string
}

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface TeamSwitcherProps extends PopoverTriggerProps {}

export function BusinessProfileSwitcher({ className }: TeamSwitcherProps) {
  // const { user } = useAuth({ middleware: 'auth' })
  // const {
  //   isPending,
  //   error,
  //   data: userData,
  // } = useQuery({
  //   queryKey: ['user'],
  //   queryFn: async () => {
  //     try {
  //       const { data, error } = await supabase.auth.getUser()
  //       if (error) {
  //         console.error(error)
  //       }
  //       if (data) {
  //         // console.log('data user', data)
  //         return data
  //       }
  //     } catch (error: any) {
  //       console.error(error)
  //     }
  //   },
  // })

  const { profiles, selectedProfile, setSelectedProfile } =
    useBusinessProfileContext()

  const [open, setOpen] = React.useState(false)
  const [showNewTeamDialog, setShowNewTeamDialog] = React.useState(false)
  const groups = [
    {
      label: 'Business Profiles',
      teams: profiles.map(profile => ({
        label: profile.shop_name,
        value: profile.id.toString(),
      })),
    },
  ]

  return (
    <Dialog open={showNewTeamDialog} onOpenChange={setShowNewTeamDialog}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a team"
            className={cn('w-[200px] justify-between', className)}>
            <Avatar className="mr-2 h-5 w-5">
              <AvatarImage
                src={`https://avatar.vercel.sh/${selectedProfile?.id}.png`}
                className="grayscale"
              />
              {/* <AvatarFallback>SC</AvatarFallback> */}
            </Avatar>
            {selectedProfile?.shop_name}
            <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            {/* <CommandInput placeholder="Search team..." /> */}
            <CommandList>
              <CommandEmpty>No team found.</CommandEmpty>
              {groups.map(group => (
                <CommandGroup key={group.label} heading={group.label}>
                  {group.teams.map(team => (
                    <CommandItem
                      key={team.value}
                      onSelect={() => {
                        const profile = profiles.find(
                          p => p.id.toString() === team.value,
                        )
                        setSelectedProfile(profile || null)
                        setOpen(false)
                      }}
                      className="text-sm">
                      <Avatar className="mr-2 h-5 w-5">
                        <AvatarImage
                          src={`https://avatar.vercel.sh/${team.value}.png`}
                          alt={team.label}
                          className="grayscale"
                        />
                      </Avatar>
                      {team.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <DialogTrigger asChild></DialogTrigger>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create team</DialogTitle>
          <DialogDescription>
            Add a new team to manage products and customers.
          </DialogDescription>
        </DialogHeader>
        <div>
          <div className="space-y-4 py-2 pb-4">
            <div className="space-y-2">
              <Label htmlFor="name">Team name</Label>
              <Input id="name" placeholder="Acme Inc." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="plan">Subscription plan</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select a plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">
                    <span className="font-medium">Free</span> -{' '}
                    <span className="text-muted-foreground">
                      Trial for two weeks
                    </span>
                  </SelectItem>
                  <SelectItem value="pro">
                    <span className="font-medium">Pro</span> -{' '}
                    <span className="text-muted-foreground">
                      $9/month per user
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowNewTeamDialog(false)}>
            Cancel
          </Button>
          <Button type="submit">Continue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
