'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { acceptSwap, declineSwap } from '@/app/actions/swaps'

export function SwapActionButtons({ swapId, senderId }: { swapId: string, senderId: string }) {
  const [loading, setLoading] = useState<'accept' | 'decline' | null>(null)
  const [error, setError] = useState('')

  const handleAccept = async () => {
    setLoading('accept')
    setError('')
    const res = await acceptSwap(swapId)
    if (res?.error) {
      setError("Xato: " + res.error)
    }
    setLoading(null)
  }

  const handleDecline = async () => {
    if (!window.confirm("Haqiqatan ham ushbu so'rovni rad etmoqchimisiz?")) return
    setLoading('decline')
    setError('')
    const res = await declineSwap(swapId, senderId)
    if (res?.error) {
      setError("Xato: " + res.error)
    }
    setLoading(null)
  }

  return (
    <div className="w-full flex flex-col gap-2">
      {error && <div className="text-xs text-red-500 font-medium w-full text-center">{error}</div>}
      <div className="flex gap-2 w-full">
        <Button 
          onClick={handleAccept} 
          disabled={loading !== null} 
          className="w-1/2 bg-emerald-600 dark:bg-emerald-600 hover:bg-emerald-700 dark:hover:bg-emerald-700 text-white dark:text-white border-transparent dark:border-transparent shadow-sm"
        >
          {loading === 'accept' ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Qabul qilish'}
        </Button>
        <Button 
          onClick={handleDecline} 
          disabled={loading !== null} 
          variant="outline" 
          className="w-1/2 text-red-600 dark:text-red-500 border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-950/40"
        >
          {loading === 'decline' ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Rad etish'}
        </Button>
      </div>
    </div>
  )
}
