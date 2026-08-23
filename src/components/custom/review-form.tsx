'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { submitReview } from '@/app/actions/reviews'
import { Star, CheckCircle } from 'lucide-react'

export function ReviewForm({ swapId, revieweeId, partnerName, existingReview }: { swapId: string, revieweeId: string, partnerName: string, existingReview?: any }) {
  const [rating, setRating] = useState(5)
  const [hovered, setHovered] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(!!existingReview)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    const formData = new FormData(e.currentTarget)
    formData.append('swapId', swapId)
    formData.append('revieweeId', revieweeId)
    formData.append('rating', rating.toString())

    const res = await submitReview(formData)
    
    if (res?.error) {
      setError(res.error)
    } else {
      setSuccess(true)
    }
    setLoading(false)
  }

  if (success) {
    return (
      <div className="bg-[var(--neu-surface)] text-[var(--neu-text)] p-6 rounded-xl text-center border border-[var(--neu-border)] shadow-sm max-w-md mx-auto mt-8">
        <div className="w-16 h-16 bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h3 className="font-bold text-xl mb-2">Ajoyib!</h3>
        <p className="text-[var(--neu-subtle-text)]">Siz {partnerName} uchun o'z bahoingizni qoldirdingiz. Ishtirokingiz uchun rahmat!</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[var(--neu-surface)] p-8 rounded-xl border border-[var(--neu-border)] max-w-md mx-auto mt-8">
      <h3 className="text-2xl font-bold mb-2 text-[var(--neu-text)]">Dars yakunlandi!</h3>
      <p className="text-[var(--neu-subtle-text)] mb-6">Iltimos, sherigingiz (<span className="font-semibold text-[var(--neu-text)]">{partnerName}</span>) qanday qatnashganini baholang.</p>
      
      <div className="flex justify-center gap-2 mb-6">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="focus:outline-none transition-transform hover:scale-110"
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => setRating(star)}
          >
            <Star 
              size={36} 
              className={`${(hovered || rating) >= star ? 'fill-indigo-500 text-indigo-500' : 'text-[var(--neu-border)]'}`} 
            />
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <Textarea 
          name="comment" 
          placeholder={`${partnerName} haqida qisqacha fikringizni yozing (ixtiyoriy)...`}
          className="resize-none min-h-[100px] bg-[var(--neu-bg)] border-[var(--neu-border)] text-[var(--neu-text)] focus-visible:ring-indigo-500"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button type="submit" className="w-full h-12 text-lg bg-indigo-600 dark:bg-indigo-600 hover:bg-indigo-700 dark:hover:bg-indigo-700 text-white dark:text-white border-transparent" disabled={loading}>
          {loading ? 'Yuborilmoqda...' : 'Bahoni saqlash'}
        </Button>
      </div>
    </form>
  )
}
