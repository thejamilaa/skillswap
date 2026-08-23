import { createClient } from '@/lib/supabase/server'
import { LeaderboardClient } from './leaderboard-client'

export const dynamic = 'force-dynamic'

export default async function LeaderboardPage() {
  const supabase = createClient()
  
  // O'qituvchilarni, ularning baholarini va qaysi fanlarni o'tishini tortib olamiz
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select(`
      id, full_name, avatar_url, bio, reputation_score,
      reviews!reviews_reviewee_id_fkey(rating),
      user_skills(type, skill:skills(name, category))
    `)

  if (error || !profiles) {
    return <div className="p-8 text-red-500 text-center">Ma'lumotlarni yuklashda xatolik yuz berdi.</div>
  }

  // Ma'lumotlarni JavaScript yordamida hisoblab, to'g'rilab olamiz
  const teachers = profiles
    .map(p => {
      // 1. Faqat o'rgata oladigan fanlarini ajratib olish
      const teachSkills = p.user_skills
        .filter((us: any) => us.type === 'teach' && us.skill)
        .map((us: any) => us.skill)

      // 2. Qaysi yo'nalishlarda (kategoriyalarda) dars berishini topish
      const categories = Array.from(new Set(teachSkills.map((s: any) => s.category)))

      // 3. O'rtacha bahoni hisoblash
      const ratings = p.reviews.map((r: any) => r.rating)
      const totalReviews = ratings.length
      const avgRating = totalReviews > 0 ? ratings.reduce((a, b) => a + b, 0) / totalReviews : 0

      return {
        id: p.id,
        full_name: p.full_name,
        avatar_url: p.avatar_url,
        bio: p.bio,
        reputation_score: p.reputation_score,
        teachSkills,
        categories,
        totalReviews,
        avgRating: Number(avgRating.toFixed(1))
      }
    })
    .filter(t => t.teachSkills.length > 0) // Faqat nimadir o'rgata oladiganlarni ro'yxatga qo'shamiz

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight">Top Ustozlar Reytingi 🏆</h1>
        <p className="text-slate-500 mt-2 text-lg">Platformamizdagi eng yaxshi o'qituvchilar va ularning reytingi.</p>
      </div>

      <LeaderboardClient initialTeachers={teachers} />
    </div>
  )
}
