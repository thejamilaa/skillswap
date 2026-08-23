import { createClient } from '@/lib/supabase/server'
import ProfileForm from '../profile-form'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function ProfileEditPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, bio, credits, reputation_score, avatar_url')
    .eq('id', user.id)
    .single()

  // Fetch current user skills
  const { data: userSkills } = await supabase
    .from('user_skills')
    .select('skill_id, type')
    .eq('user_id', user.id)

  // Fetch all available skills
  const { data: allSkills } = await supabase
    .from('skills')
    .select('*')
    .order('category', { ascending: true })

  const initialTeachSkills = userSkills?.filter(s => s.type === 'teach').map(s => s.skill_id) || []
  const initialLearnSkills = userSkills?.filter(s => s.type === 'learn').map(s => s.skill_id) || []

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Link href="/profile" className="text-sm text-[var(--neu-subtle-text)] hover:text-indigo-600 hover:underline transition-colors">
          ← Profilga qaytish
        </Link>
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--neu-text)]">Profil sozlamalari</h1>
        <p className="text-[var(--neu-subtle-text)]">O'zingiz haqingizdagi ma'lumotlarni va qaysi ko'nikmalarni almashmoqchi ekanligingizni tanlang.</p>
      </div>
      
      <ProfileForm 
        profile={profile} 
        allSkills={allSkills || []} 
        initialTeach={initialTeachSkills} 
        initialLearn={initialLearnSkills} 
      />
    </div>
  )
}
