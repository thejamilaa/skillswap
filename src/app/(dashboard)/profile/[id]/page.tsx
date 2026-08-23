import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Star, ShieldAlert } from 'lucide-react'
import { SwapRequestModal } from '@/components/custom/swap-request-modal'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function PublicProfilePage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user && user.id === params.id) {
    return redirect('/profile')
  }

  // Profil va ko'nikmalarni, hamda olingan baholarni tortish
  const { data: profile, error } = await supabase
    .from('profiles')
    .select(`
      id, full_name, username, is_anonymous, avatar_url, bio, reputation_score,
      user_skills(type, skill:skills(id, name, category)),
      reviews!reviews_reviewee_id_fkey(rating, comment, created_at, reviewer:profiles!reviews_reviewer_id_fkey(full_name, username, is_anonymous))
    `)
    .eq('id', params.id)
    .single()

  if (error || !profile) {
    return <div className="text-center p-12 text-slate-500">Foydalanuvchi topilmadi.</div>
  }

  const canTeach = profile.user_skills.filter((us: any) => us.type === 'teach' && us.skill).map((us: any) => us.skill)
  const wantsToLearn = profile.user_skills.filter((us: any) => us.type === 'learn' && us.skill).map((us: any) => us.skill)
  
  const reviews = profile.reviews || []
  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / reviews.length).toFixed(1) 
    : 0

  const displayName = profile.is_anonymous ? (profile.username || 'Anonim') : profile.full_name

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex items-center gap-2 mb-4">
        <Link href="/discover" className="text-sm text-indigo-600 hover:underline">← Orqaga</Link>
      </div>

      <div className="bg-white dark:bg-slate-950 p-8 rounded-2xl border shadow-sm flex flex-col md:flex-row gap-8 items-center md:items-start">
        <Avatar className="w-32 h-32 border-4 border-slate-50 shadow-md">
          <AvatarImage src={profile.avatar_url} />
          <AvatarFallback className="text-4xl bg-indigo-100 text-indigo-700 font-bold">{displayName?.charAt(0) || 'U'}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1 text-center md:text-left space-y-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{displayName}</h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">{profile.bio || "Foydalanuvchi o'zi haqida ma'lumot kiritmagan."}</p>
          </div>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-6 pt-2">
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 px-4 py-2 rounded-lg border">
              <Star className="text-amber-400 fill-amber-400" size={24} />
              <div>
                <div className="font-bold text-lg leading-none">{avgRating || 'N/A'}</div>
                <div className="text-xs text-slate-500">{reviews.length} ta sharh</div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 px-4 py-2 rounded-lg border">
              <ShieldAlert className="text-emerald-500" size={24} />
              <div>
                <div className="font-bold text-lg leading-none">{profile.reputation_score}</div>
                <div className="text-xs text-slate-500">Ishonch balli</div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full md:w-64 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 md:border-l md:pl-8 flex flex-col justify-center">
            {canTeach.length > 0 ? (
                <SwapRequestModal receiver={profile} skills={canTeach} />
            ) : (
                <Button disabled className="w-full bg-slate-100 text-slate-400">Dars bera olmaydi</Button>
            )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-indigo-500"></span>
            O'rgata oladigan fanlari
          </h3>
          <div className="bg-white dark:bg-slate-950 p-6 rounded-xl border flex flex-wrap gap-2">
            {canTeach.length > 0 ? canTeach.map((skill: any) => (
              <Badge key={skill.id} className="bg-indigo-100 text-indigo-800 border-indigo-200 py-1.5 px-3">
                {skill.name}
              </Badge>
            )) : <span className="text-slate-500">Ma'lumot yo'q</span>}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-slate-400"></span>
            O'rganmoqchi bo'lgan fanlari
          </h3>
          <div className="bg-white dark:bg-slate-950 p-6 rounded-xl border flex flex-wrap gap-2">
            {wantsToLearn.length > 0 ? wantsToLearn.map((skill: any) => (
              <Badge key={skill.id} variant="outline" className="text-slate-600 border-slate-300 py-1.5 px-3">
                {skill.name}
              </Badge>
            )) : <span className="text-slate-500">Ma'lumot yo'q</span>}
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-4">
         <h3 className="text-xl font-bold">O'quvchilar fikrlari ({reviews.length})</h3>
         {reviews.length === 0 ? (
           <div className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-xl border-dashed border-2 text-center text-slate-500">
             Hali hech kim izoh yozmagan.
           </div>
         ) : (
           <div className="grid grid-cols-1 gap-4">
             {reviews.map((rev: any, idx: number) => (
               <div key={idx} className="bg-white dark:bg-slate-950 p-5 rounded-xl border shadow-sm">
                 <div className="flex justify-between items-start mb-2">
                   <div className="font-semibold">
                     {rev.reviewer?.is_anonymous ? (rev.reviewer?.username || 'Anonim') : rev.reviewer?.full_name}
                   </div>
                   <div className="flex text-amber-400">
                     {[...Array(5)].map((_, i) => (
                       <Star key={i} size={16} className={i < rev.rating ? "fill-amber-400" : "text-slate-200 fill-slate-200"} />
                     ))}
                   </div>
                 </div>
                 <p className="text-slate-600 dark:text-slate-400 italic text-sm">{rev.comment || "Izohsiz qoldirilgan."}</p>
                 <div className="text-xs text-slate-400 mt-3">{new Date(rev.created_at).toLocaleDateString()}</div>
               </div>
             ))}
           </div>
         )}
      </div>
    </div>
  )
}
