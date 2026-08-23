'use client'

import { useState } from 'react'
import { createSwapRequest } from '@/app/actions/swaps'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Loader2 } from 'lucide-react'

export function SwapRequestModal({ receiver, skills }: { receiver: any, skills: any[] }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    const formData = new FormData(e.currentTarget)
    formData.append('receiverId', receiver.id)
    
    const res = await createSwapRequest(formData)
    
    if (res?.error) {
      setError(res.error)
    } else {
      setSuccess(true)
      // Muvaffaqiyatli bo'lsa, birozdan keyin modalni yopamiz
      setTimeout(() => {
        setOpen(false)
        setSuccess(false)
      }, 2000)
    }
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="w-full bg-indigo-600 dark:bg-indigo-600 hover:bg-indigo-700 dark:hover:bg-indigo-700 text-white dark:text-white border-transparent" />}>
        Almashuv so'rash (1 Kredit)
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Dars so'rash</DialogTitle>
          <DialogDescription>
            <strong className="text-[var(--neu-text)]">{receiver.full_name}</strong> bilan dars o'tish so'rovini yuborish. Tasdiqlanganida hisobingizdan 1 kredit vaqtincha muzlatiladi.
          </DialogDescription>
        </DialogHeader>
        
        {success ? (
          <div className="py-8 text-center text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-900/20 rounded-md">
            So'rov muvaffaqiyatli yuborildi! Kuting...
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4 pt-2">
            {error && <div className="p-3 text-sm text-white bg-red-500 rounded-md">{error}</div>}
            
            <div className="space-y-2">
              <Label htmlFor="requestedSkillId">Qaysi fanni o'rganmoqchisiz?</Label>
              <select 
                name="requestedSkillId" 
                required 
                defaultValue=""
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="" disabled>Fanni tanlang...</option>
                {skills.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message">Xabar (Ixtiyoriy)</Label>
              <Textarea 
                id="message" 
                name="message" 
                placeholder="Salom, men sizdan shu fanni o'rganmoqchi edim. Qachon vaqtingiz bo'ladi?" 
                className="resize-none bg-[var(--neu-bg)] border-[var(--neu-border)] text-[var(--neu-text)]" 
                rows={3}
              />
            </div>
            
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Bekor qilish</Button>
              <Button type="submit" disabled={loading} className="bg-indigo-600 dark:bg-indigo-600 hover:bg-indigo-700 dark:hover:bg-indigo-700 text-white dark:text-white border-transparent">
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'So\'rov yuborish'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
