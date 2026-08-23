'use client'

import { useState } from 'react'
import { updateProfile } from '@/app/actions/profile'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, ChevronsUpDown, X, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent } from "@/components/ui/dialog"

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useRouter } from 'next/navigation'

export default function ProfileForm({ profile, allSkills, initialTeach, initialLearn }: any) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [teachSkills, setTeachSkills] = useState<string[]>(initialTeach)
  const [learnSkills, setLearnSkills] = useState<string[]>(initialLearn)
  const [message, setMessage] = useState('')
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  const [teachOpen, setTeachOpen] = useState(false)
  const [teachCategory, setTeachCategory] = useState<string>('')

  const [learnOpen, setLearnOpen] = useState(false)
  const [learnCategory, setLearnCategory] = useState<string>('')

  // Get unique categories from allSkills
  const categories = Array.from(new Set(allSkills.map((s: any) => s.category))) as string[]

  const toggleSkill = (skillId: string, list: string[], setList: any) => {
    if (list.includes(skillId)) {
      setList(list.filter(id => id !== skillId))
    } else {
      setList([...list, skillId])
    }
  }

  const getSkillName = (id: string) => allSkills.find((s: any) => s.id === id)?.name || 'Unknown'

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Rasm hajmi 2MB dan oshmasligi kerak!')
        e.target.value = ''
        return
      }
      setAvatarPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    
    const formData = new FormData(e.currentTarget)
    formData.append('teachSkills', JSON.stringify(teachSkills))
    formData.append('learnSkills', JSON.stringify(learnSkills))
    
    const res = await updateProfile(formData)
    
    if (res?.error) {
      setMessage('Xatolik: ' + res.error)
    } else {
      setMessage('')
      setShowSuccessModal(true)
      setTimeout(() => {
        setShowSuccessModal(false)
        router.push('/profile')
      }, 2000)
    }
    setLoading(false)
  }

  return (
    <>
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md bg-[var(--neu-surface)] border-[var(--neu-border)] p-6" showCloseButton={false}>
          <div className="flex flex-col items-center justify-center space-y-4 py-4">
            <div className="rounded-full bg-emerald-500/10 p-3">
              <CheckCircle2 className="h-10 w-10 text-emerald-500" />
            </div>
            <h3 className="text-xl font-semibold text-[var(--neu-text)]">Muvaffaqiyatli saqlandi!</h3>
            <p className="text-sm text-[var(--neu-subtle-text)] text-center">
              Sizning ma'lumotlaringiz muvaffaqiyatli yangilandi.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <Card className="border-[var(--neu-border)] bg-[var(--neu-surface)]">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="text-[var(--neu-text)]">Shaxsiy ma'lumotlar</CardTitle>
          <CardDescription className="text-[var(--neu-subtle-text)]">Boshqa foydalanuvchilar sizni izlaganda ushbu ma'lumotlarni ko'radi.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {message && (
            <div className={`p-3 text-sm text-white rounded-md ${message.includes('Xatolik') ? 'bg-red-500' : 'bg-green-500'}`}>
              {message}
            </div>
          )}
          
          {/* Avatar Upload */}
          <div className="space-y-3">
            <Label className="text-[var(--neu-text)]">Profil rasmi</Label>
            <div className="flex items-center gap-4">
              <Avatar className="w-20 h-20 border-2 border-[var(--neu-border)] bg-[var(--neu-muted)]">
                <AvatarImage src={avatarPreview || profile?.avatar_url} className="object-cover" />
                <AvatarFallback className="text-xl bg-indigo-100 text-indigo-700 font-bold">{profile?.full_name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="avatar" className="cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-[var(--neu-border)] bg-[var(--neu-bg)] shadow-xs hover:bg-[var(--neu-muted)] hover:text-accent-foreground h-9 px-4 py-2 w-max text-[var(--neu-text)]">
                  Rasm yuklash
                </Label>
                <Input 
                  id="avatar" 
                  name="avatar" 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleAvatarChange}
                />
                <span className="text-xs text-[var(--neu-subtle-text)]">JPG, PNG. Maksimal 2MB.</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-[var(--neu-text)]">To'liq ism</Label>
              <Input id="fullName" name="fullName" defaultValue={profile?.full_name} required className="bg-[var(--neu-bg)] border-[var(--neu-border)] text-[var(--neu-text)]" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username" className="text-[var(--neu-text)]">Foydalanuvchi nomi (Username)</Label>
              <Input id="username" name="username" defaultValue={profile?.username} placeholder="@johndoe" className="bg-[var(--neu-bg)] border-[var(--neu-border)] text-[var(--neu-text)]" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bio" className="text-[var(--neu-text)]">O'zingiz haqingizda (Bio)</Label>
            <Textarea id="bio" name="bio" defaultValue={profile?.bio} placeholder="Men tajribali React dasturchiman va UI/UX dizaynni o'rganmoqchiman..." rows={4} className="bg-[var(--neu-bg)] border-[var(--neu-border)] text-[var(--neu-text)]" />
          </div>

          <div className="space-y-8 pt-8 border-t border-[var(--neu-border)]">
            
            {/* O'RGATA OLASIZ SECTION */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">1. Nimalarni o'rgata olasiz?</h3>
                <p className="text-sm text-[var(--neu-subtle-text)] mt-1">Siz yaxshi biladigan va boshqalarga o'rgata oladigan fanlarni belgilang.</p>
              </div>

              {teachSkills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 p-4 bg-[var(--neu-bg)] border border-[var(--neu-border)] rounded-lg">
                  <span className="w-full text-xs font-semibold text-[var(--neu-subtle-text)] mb-1">TANLANGAN FANLAR:</span>
                  {teachSkills.map(id => (
                    <Badge key={id} className="bg-indigo-600 text-white dark:text-white border-transparent gap-1.5 pl-2 pr-1.5 py-0.5">
                      {getSkillName(id)}
                      <button type="button" onClick={() => toggleSkill(id, teachSkills, setTeachSkills)} className="rounded-full hover:bg-indigo-700 p-0.5">
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-[var(--neu-text)] text-sm font-medium">Yo'nalishni qidiring</Label>
                <Popover open={teachOpen} onOpenChange={setTeachOpen}>
                  <PopoverTrigger render={
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={teachOpen}
                      className="w-full sm:w-[350px] justify-between bg-[var(--neu-bg)] border-[var(--neu-border)] text-[var(--neu-text)] hover:bg-[var(--neu-muted)] hover:text-[var(--neu-text)]"
                    >
                      <span className="truncate">{teachCategory ? teachCategory : "Yo'nalishni qidirish..."}</span>
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  } />
                  <PopoverContent className="w-[350px] p-0 bg-[var(--neu-surface)] border-[var(--neu-border)] shadow-xl">
                    <Command className="bg-transparent border-none outline-none">
                      <CommandInput placeholder="Qidirish..." className="border-none outline-none focus:ring-0 focus:outline-none text-sm text-[var(--neu-text)] placeholder:text-[var(--neu-subtle-text)] shadow-none" />
                      <CommandList className="max-h-64 overflow-y-auto custom-scrollbar pt-1 pb-1">
                        <CommandEmpty className="py-6 text-center text-sm text-[var(--neu-subtle-text)]">Yo'nalish topilmadi.</CommandEmpty>
                        <CommandGroup>
                          {categories.map((category) => (
                            <CommandItem
                              key={category}
                              value={category}
                              onSelect={(currentValue) => {
                                const origCategory = categories.find(c => c.toLowerCase() === currentValue) || category
                                setTeachCategory(origCategory === teachCategory ? "" : origCategory)
                                setTeachOpen(false)
                              }}
                              className="cursor-pointer py-2.5 px-3 mb-1 text-[var(--neu-text)] hover:bg-[var(--neu-muted)] data-[selected=true]:bg-[var(--neu-muted)] data-[selected=true]:text-[var(--neu-text)] transition-colors rounded-md flex items-start"
                            >
                              <div className="w-5 flex-shrink-0 mt-0.5">
                                {teachCategory === category && <Check className="h-4 w-4 text-indigo-500" />}
                              </div>
                              <span className="flex-1 leading-snug">{category}</span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {teachCategory && (
                <div className="flex flex-wrap gap-2 pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  {allSkills.filter((s: any) => s.category === teachCategory).map((skill: any) => (
                    <Badge 
                      key={`teach-${skill.id}`} 
                      variant={teachSkills.includes(skill.id) ? "default" : "outline"}
                      className={`cursor-pointer transition-all border-[var(--neu-border)] shadow-none text-sm px-3 py-1 ${teachSkills.includes(skill.id) ? 'bg-indigo-600 text-white dark:text-white hover:bg-indigo-700 border-transparent' : 'hover:bg-[var(--neu-muted)] text-[var(--neu-text)]'}`}
                      onClick={() => toggleSkill(skill.id, teachSkills, setTeachSkills)}
                    >
                      {skill.name}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* O'RGANMOQCHISIZ SECTION */}
            <div className="space-y-4 pt-6 border-t border-[var(--neu-border)]">
              <div>
                <h3 className="text-lg font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">2. Nimalarni o'rganmoqchisiz?</h3>
                <p className="text-sm text-[var(--neu-subtle-text)] mt-1">Siz o'rganishni xohlagan fanlarni belgilang.</p>
              </div>

              {learnSkills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 p-4 bg-[var(--neu-bg)] border border-[var(--neu-border)] rounded-lg">
                  <span className="w-full text-xs font-semibold text-[var(--neu-subtle-text)] mb-1">TANLANGAN FANLAR:</span>
                  {learnSkills.map(id => (
                    <Badge key={id} className="bg-emerald-600 text-white dark:text-white border-transparent gap-1.5 pl-2 pr-1.5 py-0.5">
                      {getSkillName(id)}
                      <button type="button" onClick={() => toggleSkill(id, learnSkills, setLearnSkills)} className="rounded-full hover:bg-emerald-700 p-0.5">
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-[var(--neu-text)] text-sm font-medium">Yo'nalishni qidiring</Label>
                <Popover open={learnOpen} onOpenChange={setLearnOpen}>
                  <PopoverTrigger render={
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={learnOpen}
                      className="w-full sm:w-[350px] justify-between bg-[var(--neu-bg)] border-[var(--neu-border)] text-[var(--neu-text)] hover:bg-[var(--neu-muted)] hover:text-[var(--neu-text)]"
                    >
                      <span className="truncate">{learnCategory ? learnCategory : "Yo'nalishni qidirish..."}</span>
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  } />
                  <PopoverContent className="w-[350px] p-0 bg-[var(--neu-surface)] border-[var(--neu-border)] shadow-xl">
                    <Command className="bg-transparent border-none outline-none">
                      <CommandInput placeholder="Qidirish..." className="border-none outline-none focus:ring-0 focus:outline-none text-sm text-[var(--neu-text)] placeholder:text-[var(--neu-subtle-text)] shadow-none" />
                      <CommandList className="max-h-64 overflow-y-auto custom-scrollbar pt-1 pb-1">
                        <CommandEmpty className="py-6 text-center text-sm text-[var(--neu-subtle-text)]">Yo'nalish topilmadi.</CommandEmpty>
                        <CommandGroup>
                          {categories.map((category) => (
                            <CommandItem
                              key={category}
                              value={category}
                              onSelect={(currentValue) => {
                                const origCategory = categories.find(c => c.toLowerCase() === currentValue) || category
                                setLearnCategory(origCategory === learnCategory ? "" : origCategory)
                                setLearnOpen(false)
                              }}
                              className="cursor-pointer py-2.5 px-3 mb-1 text-[var(--neu-text)] hover:bg-[var(--neu-muted)] data-[selected=true]:bg-[var(--neu-muted)] data-[selected=true]:text-[var(--neu-text)] transition-colors rounded-md flex items-start"
                            >
                              <div className="w-5 flex-shrink-0 mt-0.5">
                                {learnCategory === category && <Check className="h-4 w-4 text-emerald-500" />}
                              </div>
                              <span className="flex-1 leading-snug">{category}</span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {learnCategory && (
                <div className="flex flex-wrap gap-2 pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  {allSkills.filter((s: any) => s.category === learnCategory).map((skill: any) => (
                    <Badge 
                      key={`learn-${skill.id}`} 
                      variant={learnSkills.includes(skill.id) ? "default" : "outline"}
                      className={`cursor-pointer transition-all border-[var(--neu-border)] shadow-none text-sm px-3 py-1 ${learnSkills.includes(skill.id) ? 'bg-emerald-600 text-white dark:text-white hover:bg-emerald-700 border-transparent' : 'hover:bg-[var(--neu-muted)] text-[var(--neu-text)]'}`}
                      onClick={() => toggleSkill(skill.id, learnSkills, setLearnSkills)}
                    >
                      {skill.name}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            
          </div>
        </CardContent>
        
        <CardFooter className="bg-[var(--neu-muted)] border-t border-[var(--neu-border)] py-4">
          <Button type="submit" disabled={loading} className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:text-white shadow-none">
            {loading ? 'Saqlanmoqda...' : 'O\'zgarishlarni saqlash'}
          </Button>
        </CardFooter>
      </form>
    </Card>
    </>
  )
}
