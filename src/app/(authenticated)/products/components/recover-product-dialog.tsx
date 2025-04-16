import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import React from 'react'
import { useProductContext } from '../products-context'
import { Button } from '@/components/ui/button'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { productActions } from '../product-actions'
import { Info } from 'lucide-react'

export default function RecoverProductDialog() {
  const queryClient = useQueryClient()
  const { recoverIsOpen, setRecoverIsOpen, selectedProduct } =
    useProductContext()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async () => {
      if (!selectedProduct) return
      const data = await productActions.recover(selectedProduct.product_id)
      if (!data) {
        throw new Error('Failed to recover product')
      }
      return
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      setRecoverIsOpen(false)
    },
  })

  const handleRecover = async () => {
    await mutateAsync()
  }

  return (
    <Dialog open={recoverIsOpen} onOpenChange={setRecoverIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription className="flex items-center space-x-2 text-amber-700 bg-amber-100 border border-amber-400 p-2 rounded-md">
            <Info className="w-6 self-start" />
            <p>
              Products that are recovered will be visible in the main product
              list and will be counted in the statistics.
            </p>
          </DialogDescription>
        </DialogHeader>
        <p>
          You are about to recover{' '}
          <span className="font-bold">{selectedProduct?.product_name}</span>.
        </p>
        <DialogFooter>
          <Button
            variant="destructive"
            onClick={async () => {
              handleRecover()
            }}
            disabled={isPending}>
            Recover
          </Button>
          <Button
            variant="outline"
            onClick={() => setRecoverIsOpen(false)}
            className="mr-2"
            disabled={isPending}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
