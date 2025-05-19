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
import { UserCog } from 'lucide-react'

import React from 'react'

export default function ManageBusinessProfile() {
  const { profiles, selectedProfile, setSelectedProfile } =
    useBusinessProfileContext()

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
                      {/* Add action buttons here */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedProfile(profile)}
                        disabled={selectedProfile?.id === profile.id}>
                        {selectedProfile?.id === profile.id
                          ? 'Selected'
                          : 'Select'}
                      </Button>
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
