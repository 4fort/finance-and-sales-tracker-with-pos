'use client'

import { Button } from '@/components/ui/button'
import { ToastAction } from '@/components/ui/toast'
import { useToast } from '@/hooks/use-toast'

export function ErrorToast({ errorMessage }: { errorMessage: any }) {
  const { toast } = useToast()

  return toast({
    variant: 'destructive',
    title: 'Uh oh! Something went wrong.',
    description: errorMessage,
    action: <ToastAction altText="Try again">Try again</ToastAction>,
  })
}
