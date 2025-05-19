import { useBusinessProfileContext } from '@/app/business-profile-context'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { UserCog, MoreHorizontal } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

import React from 'react'

export default function ManageBusinessProfile() {
  const { profiles, selectedProfile, setSelectedProfile } =
    useBusinessProfileContext()

  // TODO: Implement edit and delete functions
  const handleEditProfile = (profileId: number) => {
    console.log('Edit profile:', profileId)
    // Add logic to open an edit dialog or navigate to an edit page
  }

  const handleDeleteProfile = (profileId: number) => {
    console.log('Delete profile:', profileId)
    // Add logic to confirm and delete the profile
  }

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" type="button">
            <UserCog className="h-4 w-4 mr-2" /> Manage Business Profiles
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Business Profiles</DialogTitle>
            {/* <div className=""></div> */}
          </DialogHeader>
          <div className="mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Profile Name</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {profiles.map(profile => (
                  <TableRow key={profile.id}>
                    <TableCell>{profile.shop_name}</TableCell>
                    <TableCell>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-40">
                          <div className="grid gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedProfile(profile)}
                              disabled={selectedProfile?.id === profile.id}
                              className="w-full justify-start">
                              {selectedProfile?.id === profile.id
                                ? 'Selected'
                                : 'Select'}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditProfile(profile.id)}
                              className="w-full justify-start">
                              Edit
                            </Button>
                            <Button
                              variant="destructive" // Or "ghost" if you prefer less emphasis
                              size="sm"
                              onClick={() => handleDeleteProfile(profile.id)}
                              className="w-full justify-start">
                              Delete
                            </Button>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
