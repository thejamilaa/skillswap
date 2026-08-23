import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Star, ShieldAlert, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { AnonymousToggle } from '@/components/custom/anonymous-toggle'

export default async function MyProfilePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  // Profil va ko'nikmalarni, hamda olingan baholarni tortish
  const { data: profile, error } = await supabase
    .from('profiles')
    .select(`
      id, full_name, username, is_anonymous, avatar_url, bio, reputation_score,
      user_skills(type, skill:skills(id, name, category)),
      reviews!reviews_reviewee_id_fkey(rating, comment, created_at, reviewer:profiles!reviews_reviewer_id_fkey(full_name, username, is_anonymous))
    `)
    .eq('id', user.id)
    .single()

  if (error || !profile) {
    return <div className="text-center p-12 text-[var(--neu-subtle-text)]">Foydalanuvchi topilmadi.</div>
  }

  const canTeach = profile.user_skills.filter((us: any) => us.type === 'teach' && us.skill).map((us: any) => us.skill)
  const wantsToLearn = profile.user_skills.filter((us: any) => us.type === 'learn' && us.skill).map((us: any) => us.skill)
  
  const reviews = profile.reviews || []
  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / reviews.length).toFixed(1) 
    : 0

  const displayName = profile.is_anonymous ? (profile.username || 'Anonim') : profile.full_name

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-6">
      <div className="flex items-center justify-between gap-2 mb-2">
        <h1 className="text-xl sm:text-2xl font-bold text-[var(--neu-text)]">Mening Profilim</h1>
        <Link href="/profile/edit">
          <Button variant="outline" size="sm" className="border-[var(--neu-border)] bg-[var(--neu-bg)] hover:bg-[var(--neu-muted)] text-[var(--neu-text)]">
            <Pencil className="w-3.5 h-3.5 mr-1.5" />
            Tahrirlash
          </Button>
        </Link>
      </div>

      <div className="bg-[var(--neu-surface)] p-5 sm:p-8 rounded-2xl border border-[var(--neu-border)] shadow-sm flex flex-col sm:flex-row gap-5 sm:gap-8 items-center sm:items-start relative">
        <AnonymousToggle initialStatus={profile.is_anonymous || false} />
        
        <Avatar className="w-32 h-32 border-4 border-[var(--neu-bg)] shadow-md">
          <AvatarImage src={profile.avatar_url} />
          <AvatarFallback className="text-4xl bg-indigo-100 text-indigo-700 font-bold">{displayName?.charAt(0) || 'U'}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1 text-center sm:text-left space-y-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-[var(--neu-text)]">{displayName}</h1>
            {profile.is_anonymous && (
              <span className="inline-block bg-emerald-500/10 text-emerald-600 text-xs px-2 py-1 rounded-md mb-2 font-medium">
                Siz hozir maxfiy (anonim) rejimdasiz.
              </span>
            )}
            <p className="text-[var(--neu-subtle-text)] text-base leading-relaxed">{profile.bio || "Foydalanuvchi o'zi haqida ma'lumot kiritmagan."}</p>
          </div>
          
          <div className="flex flex-wrap justify-center sm:justify-start gap-3 pt-1">
            <div className="flex items-center gap-2 bg-[var(--neu-bg)] px-3 py-2 rounded-lg border border-[var(--neu-border)]">
              <Star className="text-amber-400 fill-amber-400" size={20} />
              <div>
                <div className="font-bold text-base leading-none text-[var(--neu-text)]">{avgRating || 'N/A'}</div>
                <div className="text-xs text-[var(--neu-subtle-text)]">{reviews.length} ta sharh</div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-[var(--neu-bg)] px-3 py-2 rounded-lg border border-[var(--neu-border)]">
              <ShieldAlert className="text-emerald-500" size={20} />
              <div>
                <div className="font-bold text-base leading-none text-[var(--neu-text)]">{profile.reputation_score}</div>
                <div className="text-xs text-[var(--neu-subtle-text)]">Ishonch balli</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="text-xl font-bold flex items-center gap-2 text-[var(--neu-text)]">
            <span className="w-3 h-3 rounded-full bg-indigo-500"></span>
            O'rgata oladigan fanlarim
          </h3>
          <div className="bg-[var(--neu-surface)] p-6 rounded-xl border border-[var(--neu-border)] flex flex-wrap gap-2">
            {canTeach.length > 0 ? canTeach.map((skill: any) => (
              <Badge key={skill.id} className="bg-indigo-600/10 text-indigo-700 dark:text-indigo-400 border-indigo-200/50 py-1.5 px-3">
                {skill.name}
              </Badge>
            )) : <span className="text-[var(--neu-subtle-text)]">Ma'lumot yo'q</span>}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-bold flex items-center gap-2 text-[var(--neu-text)]">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            O'rganmoqchi bo'lgan fanlarim
          </h3>
          <div className="bg-[var(--neu-surface)] p-6 rounded-xl border border-[var(--neu-border)] flex flex-wrap gap-2">
            {wantsToLearn.length > 0 ? wantsToLearn.map((skill: any) => (
              <Badge key={skill.id} className="bg-emerald-600/10 text-emerald-700 dark:text-emerald-400 border-emerald-200/50 py-1.5 px-3">
                {skill.name}
              </Badge>
            )) : <span className="text-[var(--neu-subtle-text)]">Ma'lumot yo'q</span>}
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-4">
         <h3 className="text-xl font-bold text-[var(--neu-text)]">Mening haqimda fikrlar ({reviews.length})</h3>
         {reviews.length === 0 ? (
           <div className="bg-[var(--neu-bg)] p-8 rounded-xl border-dashed border-2 border-[var(--neu-border)] text-center text-[var(--neu-subtle-text)]">
             Sizga hali hech kim izoh yozmagan.
           </div>
         ) : (
           <div className="grid grid-cols-1 gap-4">
             {reviews.map((rev: any, idx: number) => (
               <div key={idx} className="bg-[var(--neu-surface)] p-5 rounded-xl border border-[var(--neu-border)] shadow-sm">
                 <div className="flex justify-between items-start mb-2">
                   <div className="font-semibold text-[var(--neu-text)]">
                     {rev.reviewer?.is_anonymous ? (rev.reviewer?.username || 'Anonim') : rev.reviewer?.full_name}
                   </div>
                   <div className="flex text-amber-400">
                     {[...Array(5)].map((_, i) => (
                       <Star key={i} size={16} className={i < rev.rating ? "fill-amber-400" : "text-[var(--neu-border)] fill-[var(--neu-border)]"} />
                     ))}
                   </div>
                 </div>
                 <p className="text-[var(--neu-subtle-text)] italic text-sm">{rev.comment || "Izohsiz qoldirilgan."}</p>
                 <div className="text-xs text-[var(--neu-border)] mt-3">{new Date(rev.created_at).toLocaleDateString()}</div>
               </div>
             ))}
           </div>
         )}
      </div>
    </div>
  )
}
