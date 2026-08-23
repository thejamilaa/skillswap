'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { endClass } from '@/app/actions/reviews'

import { Loader2 } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

export function EndClassButton({ swapId }: { swapId: string }) {
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')

  const handleEndClass = async () => {
    setLoading(true)
    setError('')
    const res = await endClass(swapId)
    if (res?.error) {
      setError(res.error)
      setLoading(false)
    } else {
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="destructive" size="sm" className="gap-2" />}>
        <span className="w-2 h-2 bg-white rounded-full"></span> Darsni yakunlash
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Darsni yakunlash</DialogTitle>
          <DialogDescription>
            Rostdan ham bu darsni tugatmoqchimisiz? Dars tugagandan so'ng siz va sherigingiz bir-biringizga baho qo'yib, izoh qoldirishingiz mumkin bo'ladi.
          </DialogDescription>
        </DialogHeader>
        {error && <div className="text-red-500 text-sm p-2 bg-red-50 dark:bg-red-950/20 rounded-md border border-red-100">{error}</div>}
        <DialogFooter className="pt-4 mt-2 border-t">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Bekor qilish
          </Button>
          <Button variant="destructive" onClick={handleEndClass} disabled={loading}>
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Ha, yakunlash'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
