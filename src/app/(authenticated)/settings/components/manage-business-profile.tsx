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
import { UserCog, MoreHorizontal, PlusIcon, CheckCircle } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import React, { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { BusinessProfileForm } from '../profile-form'
import { BusinessProfile } from '@/app/business-profile-context'
import { useOwnerConfirmation } from '@/components/owner-confirmation'
import { useToast } from '@/hooks/use-toast'

export default function ManageBusinessProfile() {
  const { profiles, selectedProfile, setSelectedProfile } =
    useBusinessProfileContext()
  const [isCreateProfileOpen, setIsCreateProfileOpen] = useState(false)
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false)
  const [editingProfile, setEditingProfile] = useState<BusinessProfile | null>(
    null,
  )
  const { toast } = useToast()

  const { requestConfirmation, OwnerConfirmationDialogComponent } =
    useOwnerConfirmation()

  const { data: currentUser, isLoading: isUserLoading } = useQuery({
    queryKey: ['currentUserForProfileForm'],
    queryFn: async () => {
      const { data: authData, error } = await supabase.auth.getUser()
      if (error) {
        console.error('Error fetching user:', error.message)
        throw new Error(`Failed to fetch user: ${error.message}`)
      }
      if (!authData || !authData.user) {
        console.error('User not authenticated or not found.')
        throw new Error('User not authenticated or not found.')
      }
      return authData.user
    },
  })

  const queryClient = useQueryClient()

  const {
    mutateAsync: deleteProfileMutateAsync,
    isPending: isDeletingProfile,
  } = useMutation({
    mutationFn: async (profileId: number) => {
      const { error } = await supabase
        .from('business_profiles')
        .delete()
        .eq('id', profileId)
      if (error) {
        console.error('Error deleting profile:', error.message)
        throw new Error(`Failed to delete profile: ${error.message}`)
      }
      return true
    },
    onSuccess: () => {
      toast({
        title: 'Profile Deleted',
        description: 'The profile has been deleted successfully.',
        variant: 'default',
      })
      queryClient.invalidateQueries({ queryKey: ['businessProfiles'] })
    },
    onError: (error: Error) => {
      toast({
        title: 'Profile Deletion Failed',
        description: error.message,
        variant: 'destructive',
      })
    },
  })

  const handleOpenEditDialog = async (profile: BusinessProfile) => {
    const confirmed = await requestConfirmation()
    if (confirmed) {
      setEditingProfile(profile)
      setIsEditProfileOpen(true)
    } else {
      toast({
        title: 'Edit Cancelled',
        description: 'You chose not to proceed with editing the profile.',
        variant: 'destructive',
      })
    }
  }

  const handleDeleteProfile = async (profileId: number) => {
    const confirmed = await requestConfirmation()
    if (confirmed) {
      console.log('Delete profile:', profileId)
      // TODO: Implement actual Supabase call to delete the profile
      toast({
        title: 'Profile Deletion Initiated',
        description: `Password confirmed. Profile ${profileId} would be deleted`,
        variant: 'default',
      })

      try {
        await deleteProfileMutateAsync(profileId)
      } catch (error) {
        console.error('Error deleting profile:', error)
        toast({
          title: 'Profile Deletion Failed',
          description: 'An error occurred while deleting the profile.',
          variant: 'destructive',
        })
      }
    } else {
      console.log('Deletion cancelled for profile:', profileId)
      toast({
        title: 'Deletion Cancelled',
        description: 'You chose not to proceed with deleting the profile.',
        variant: 'destructive',
      })
    }
  }

  return (
    <>
      <OwnerConfirmationDialogComponent />

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" type="button">
            <UserCog className="h-4 w-4 mr-2" /> Manage Business Profiles
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Manage Business Profiles</DialogTitle>
            <DialogDescription>
              Don&apos;t forget to click save when selecting a new profile to
              make it default.
            </DialogDescription>
          </DialogHeader>

          {/* Toolbar for creating a new profile */}
          <div className="flex justify-end my-4">
            <Dialog
              open={isCreateProfileOpen}
              onOpenChange={setIsCreateProfileOpen}>
              <DialogTrigger asChild>
                <Button variant="default">
                  <PlusIcon className="h-4 w-4 mr-2" /> Create New Profile
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Business Profile</DialogTitle>
                  <DialogDescription>
                    Fill in the details to create a new business profile.
                  </DialogDescription>
                </DialogHeader>
                {isUserLoading ? (
                  <p>Loading user information...</p>
                ) : currentUser?.id ? (
                  <BusinessProfileForm
                    userId={currentUser.id}
                    setIsOpen={setIsCreateProfileOpen}
                  />
                ) : (
                  <p>Could not load user information. Please try again.</p>
                )}
              </DialogContent>
            </Dialog>
          </div>

          <div className="mt-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead></TableHead>
                  <TableHead>Profile Name</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {profiles.map(profile => (
                  <TableRow
                    key={profile.id}
                    className={
                      selectedProfile?.id === profile.id ? 'bg-muted/50' : ''
                    }>
                    <TableCell>
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={`https://avatar.vercel.sh/${profile.id}.png`}
                          alt={profile.shop_name}
                          className="grayscale"
                        />
                        <AvatarFallback>
                          {profile.shop_name
                            ?.split(' ')
                            .map(n => n[0])
                            .join('')
                            .substring(0, 2)
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {profile.shop_name}
                        {selectedProfile?.id === profile.id && (
                          <CheckCircle className="ml-2 h-5 w-5 text-green-500" />
                        )}
                      </div>
                    </TableCell>
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
                              onClick={() => handleOpenEditDialog(profile)}
                              className="w-full justify-start">
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
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

          {/* Edit Profile Dialog */}
          {editingProfile && (
            <Dialog
              open={isEditProfileOpen}
              onOpenChange={setIsEditProfileOpen}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Edit Business Profile</DialogTitle>
                  <DialogDescription>
                    Update the details for {editingProfile.shop_name}.
                  </DialogDescription>
                </DialogHeader>
                {isUserLoading ? (
                  <p>Loading user information...</p>
                ) : currentUser?.id ? (
                  <BusinessProfileForm
                    userId={currentUser.id}
                    setIsOpen={setIsEditProfileOpen}
                    mode="edit"
                    initialData={editingProfile}
                  />
                ) : (
                  <p>Could not load user information. Please try again.</p>
                )}
              </DialogContent>
            </Dialog>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
