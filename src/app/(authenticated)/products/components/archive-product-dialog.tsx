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

export default function ArchiveProductDialog() {
  const queryClient = useQueryClient()
  const { archiveIsOpen, setArchiveIsOpen, selectedProduct } =
    useProductContext()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async () => {
      if (!selectedProduct) return
      const data = await productActions.archive(selectedProduct.product_id)
      if (!data) {
        throw new Error('Failed to archive product')
      }
      return
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      setArchiveIsOpen(false)
    },
  })

  const handleArchive = async () => {
    await mutateAsync()
  }

  return (
    <Dialog open={archiveIsOpen} onOpenChange={setArchiveIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription className="flex items-center space-x-2 text-amber-700 bg-amber-100 border border-amber-400 p-2 rounded-md">
            <Info className="w-6 self-start" />
            <p>
              Products that are archived will no longer be visible in the main
              product list and will not be counted in the statistics.
            </p>
          </DialogDescription>
        </DialogHeader>
        <p>
          You are about to archive{' '}
          <span className="font-bold">{selectedProduct?.product_name}</span>.
          You can still recover this product later.
        </p>
        <DialogFooter>
          <Button
            variant="destructive"
            onClick={async () => {
              handleArchive()
            }}
            disabled={isPending}>
            Archive
          </Button>
          <Button
            variant="outline"
            onClick={() => setArchiveIsOpen(false)}
            className="mr-2"
            disabled={isPending}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
