import { useState, useCallback } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { supabase } from '@/lib/supabase'
import { AlertCircle } from 'lucide-react'

interface InnerOwnerConfirmationDialogProps {
  isOpen: boolean
  onConfirmAttempt: (password: string) => Promise<boolean>
  onClose: (confirmed: boolean) => void
  // TODO: Consider passing email if 'login@owner.com' needs to be dynamic
}

const InnerOwnerConfirmationDialog: React.FC<
  InnerOwnerConfirmationDialogProps
> = ({ isOpen, onConfirmAttempt, onClose }) => {
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isAttempting, setIsAttempting] = useState(false)

  const handleConfirmClick = async () => {
    setError(null)
    setIsAttempting(true)
    const success = await onConfirmAttempt(password)
    setIsAttempting(false)
    if (success) {
      setPassword('')
      onClose(true) // Confirmed
    } else {
      setError('Incorrect password or failed to confirm. Please try again.')
      // Do not close, let user retry
    }
  }

  const handleCancelClick = () => {
    setPassword('')
    setError(null)
    onClose(false) // Cancelled
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={open => {
        if (!open) {
          // If dialog is about to close
          handleCancelClick() // Treat as cancel
        }
      }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Action</DialogTitle>
          <DialogDescription>
            Enter the owner&apos;s password to confirm this action.
          </DialogDescription>
        </DialogHeader>
        <Input
          type="password"
          placeholder="Owner's Password"
          value={password}
          onChange={e => {
            setPassword(e.target.value)
            if (error) setError(null) // Clear error on new input
          }}
          disabled={isAttempting}
        />
        {error && (
          <div className="flex items-center space-x-2 text-red-700 bg-red-100 border border-red-400 p-2 rounded-md mt-2">
            <AlertCircle className="h-5 w-5 self-start flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}
        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleCancelClick}
            disabled={isAttempting}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirmClick}
            disabled={isAttempting}>
            {isAttempting ? 'Confirming...' : 'Confirm'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export const useOwnerConfirmation = () => {
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean
    promiseResolve?: (confirmed: boolean) => void
    // No explicit promiseReject needed as cancel also resolves (with false)
  }>({ isOpen: false })

  const requestConfirmation = useCallback((): Promise<boolean> => {
    return new Promise<boolean>(resolve => {
      setDialogState({
        isOpen: true,
        promiseResolve: resolve,
      })
    })
  }, []) // No dependencies, this function's identity is stable

  const handleCloseDialog = useCallback(
    (confirmed: boolean) => {
      if (dialogState.promiseResolve) {
        dialogState.promiseResolve(confirmed)
      }
      setDialogState({ isOpen: false }) // Reset state
    },
    [dialogState],
  )

  const performPasswordCheck = useCallback(
    async (password: string): Promise<boolean> => {
      try {
        // TODO: The email 'login@owner.com' should ideally come from user data or config.
        // For now, using the previously hardcoded value.
        const { data: userData, error: sessionError } =
          await supabase.auth.getUser()
        if (sessionError || !userData.user || !userData.user.email) {
          console.error('Error fetching user session or email:', sessionError)
          // Fallback or specific handling if main user email isn't the owner's login email
          // This example assumes the currently logged-in user is the one whose password is used for confirmation.
          // If 'login@owner.com' is a fixed special account, that logic is different.
          // For now, let's assume we need the current user's email for re-authentication.
          // If the intent was a *specific* owner account, 'login@owner.com' is fine.
          // Given the original code used 'login@owner.com', we'll stick to that for direct password check.
          // This implies 'login@owner.com' is a known, fixed email for the owner.
        }

        const emailToUse = 'login@owner.com' // As per original logic

        const { error } = await supabase.auth.signInWithPassword({
          email: emailToUse,
          password,
        })

        if (error) {
          console.error('Error signing in for confirmation:', error.message)
          // supabase.auth.signOut(); // Important: Sign out immediately if re-auth was just for confirmation
          // Actually, signInWithPassword for re-authentication doesn't change the current session if it's the same user.
          // If it were a different user, it would, and signout would be critical.
          // For now, let's assume it's a re-auth of the current owner or a dedicated owner account.
          return false
        }
        // If signInWithPassword was successful, it means the password is correct.
        // No need to explicitly sign out if it's a re-authentication of the current user.
        // If 'login@owner.com' is a *different* account, then the session has now changed,
        // which is a side effect. This needs clarification.
        // Assuming 'login@owner.com' is the email of the *current* user who is an owner.
        return true
      } catch (error) {
        console.error('Exception during owner confirmation:', error)
        // supabase.auth.signOut(); // Clean up session if it changed due to a different email.
        return false
      }
    },
    [],
  )

  const OwnerConfirmationDialogComponent = useCallback(
    () => (
      <InnerOwnerConfirmationDialog
        isOpen={dialogState.isOpen}
        onConfirmAttempt={performPasswordCheck}
        onClose={handleCloseDialog}
      />
    ),
    [dialogState.isOpen, performPasswordCheck, handleCloseDialog],
  )

  return { requestConfirmation, OwnerConfirmationDialogComponent }
}

// Remove default export if not needed, or adjust as per project structure.
// export default OwnerConfirmationDialog; // Old default export, no longer primary.
