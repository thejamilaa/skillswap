'use client'

import { useState, useTransition } from 'react'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { toggleAnonymousMode } from '@/app/actions/profile'
import { VenetianMask, User } from 'lucide-react'

export function AnonymousToggle({ initialStatus }: { initialStatus: boolean }) {
  const [isAnonymous, setIsAnonymous] = useState(initialStatus)
  const [isPending, startTransition] = useTransition()

  const handleToggle = (checked: boolean) => {
    setIsAnonymous(checked)
    startTransition(async () => {
      await toggleAnonymousMode(checked)
    })
  }

  return (
    <div className="absolute top-4 right-4 flex items-center space-x-2 bg-[var(--neu-bg)] border border-[var(--neu-border)] px-3 py-1.5 rounded-full shadow-sm">
      {isAnonymous ? (
        <VenetianMask className="w-4 h-4 text-emerald-500" />
      ) : (
        <User className="w-4 h-4 text-indigo-500" />
      )}
      <Label htmlFor="anonymous-mode" className="text-sm font-medium cursor-pointer select-none">
        Anonim
      </Label>
      <Switch 
        id="anonymous-mode" 
        checked={isAnonymous} 
        onCheckedChange={handleToggle}
        disabled={isPending}
        className="ml-1"
      />
    </div>
  )
}
