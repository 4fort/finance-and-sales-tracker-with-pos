'use client'

import { supabase } from '@/lib/supabase'
import { useQuery } from '@tanstack/react-query'
import React from 'react'

export type BusinessProfile = {
  id: number
  shop_name: string
  city: string
  street: string
  state: string
  zip_code: string
  created_at: string
  owner_id: string
  manager_name: string
}

type BusinessProfileContextType = {
  selectedProfile: BusinessProfile | null
  setSelectedProfile: React.Dispatch<
    React.SetStateAction<BusinessProfile | null>
  >
  profiles: BusinessProfile[]
  userProfiles: BusinessProfile[]
  customProfiles: BusinessProfile[]
}

export const BusinessProfileContext =
  React.createContext<BusinessProfileContextType>({
    selectedProfile: null,
    setSelectedProfile: () => {},
    profiles: [],
    userProfiles: [],
    customProfiles: [],
  })

export const useBusinessProfileContext = () => {
  const context = React.useContext(BusinessProfileContext)
  if (!context) {
    throw new Error(
      'useBusinessProfileContext must be used within a BusinessProfileProvider',
    )
  }
  return context
}

export const BusinessProfileContextProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [selectedProfile, setSelectedProfile] =
    React.useState<BusinessProfile | null>(null)
  const [userProfiles, setUserProfiles] = React.useState<BusinessProfile[]>([])
  const [customProfiles, setCustomProfiles] = React.useState<BusinessProfile[]>(
    [],
  )

  const { error, data: userData } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.auth.getUser()
        if (error) {
          console.error(error)
        }
        if (data) {
          //   console.log('data user', data)
          return data
        }
      } catch (error: any) {
        console.error(error)
      }
    },
  })

  const {
    data: profiles,
    isPending,
    error: profilesError,
  } = useQuery({
    queryKey: ['businessProfiles'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('business_profiles')
          .select('*')

        if (error) {
          console.error(error)
        }
        if (data) {
          if (userData?.user) {
            const userPrefProfileId =
              userData?.user?.user_metadata.profile.business_profile
            const userPrefProfile = data.find(p => p.id === userPrefProfileId)
            const defaultProfile = data.find(p => p.shop_name === 'Default')
            setSelectedProfile(userPrefProfile ?? defaultProfile)
            setUserProfiles(
              data.filter(profile => profile.owner_id === userData?.user.id),
            )
          }

          setCustomProfiles(data.filter(profile => profile.owner_id))

          return data
        }
      } catch (error) {
        console.error(error)
      }
    },
    enabled: !!userData?.user,
  })

  return (
    <BusinessProfileContext.Provider
      value={{
        selectedProfile,
        setSelectedProfile,
        profiles: profiles || [],
        userProfiles,
        customProfiles,
      }}>
      {children}
    </BusinessProfileContext.Provider>
  )
}
