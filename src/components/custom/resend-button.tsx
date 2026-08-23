'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { resendVerificationEmail } from '@/app/actions/auth'

export function ResendButton({ email }: { email: string }) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)

  const handleResend = async () => {
    setLoading(true)
    setMessage('')
    setIsError(false)
    
    const res = await resendVerificationEmail(email)
    
    if (res?.error) {
      setIsError(true)
      setMessage(res.error)
    } else {
      setMessage("Xat qayta yuborildi! Pochtani tekshiring.")
    }
    setLoading(false)
  }

  if (!email) return null

  return (
    <div className="w-full space-y-2 mt-2">
      <Button 
        variant="outline" 
        onClick={handleResend} 
        disabled={loading || !email}
        className="w-full border-slate-300 dark:border-slate-700"
      >
        {loading ? 'Yuborilmoqda...' : 'Xatni qayta yuborish'}
      </Button>
      {message && (
        <p className={`text-xs text-center font-medium ${isError ? 'text-red-500' : 'text-emerald-600'}`}>
          {message}
        </p>
      )}
    </div>
  )
}
