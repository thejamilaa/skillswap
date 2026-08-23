import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

import { SwapRequestModal } from '@/components/custom/swap-request-modal'

export default async function DiscoverPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  // Barcha foydalanuvchilarni va ularning ko'nikmalarini yuklash
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select(`
      id, full_name, username, is_anonymous, avatar_url, bio,
      user_skills (
        type,
        skills ( id, name, category )
      )
    `)
    .neq('id', user.id)

  // O'zimiz jo'natgan aktiv yoki kutilyotgan so'rovlarni tortamiz (Spam'ni bloklash uchun)
  const { data: myRequests } = await supabase
    .from('swap_requests')
    .select('receiver_id, status')
    .eq('sender_id', user.id)
    .in('status', ['pending', 'accepted', 'active'])
    
  // Qaysi ID larga so'rov yubora olmasligimizni ro'yxati
  const blockedReceiverIds = myRequests?.map(req => req.receiver_id) || []

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--neu-text)]">Kashf etish</h1>
        <p className="text-[var(--neu-subtle-text)] text-sm sm:text-base font-medium">Yangi bilimlarni o&apos;rganing yoki o&apos;z tajribangiz bilan ulashing.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {profiles?.map((profile: any) => {
          // Ko'nikmalarni ajratib olamiz
          const canTeach = (profile.user_skills || [])
            .filter((us: any) => us.type === 'teach' && us.skills)
            .map((us: any) => us.skills)
          
          const wantsToLearn = (profile.user_skills || [])
            .filter((us: any) => us.type === 'learn' && us.skills)
            .map((us: any) => us.skills)

          const displayName = profile.is_anonymous ? (profile.username || 'Anonim') : profile.full_name
          const displayInitial = displayName?.charAt(0) || 'U'

          return (
            <Card key={profile.id} className="flex flex-col h-full overflow-hidden transition-all duration-300 border-[var(--neu-border)]">
              <CardHeader className="flex flex-row items-center gap-4 pb-2 border-b border-[var(--neu-border)]">
                <Avatar className="h-14 w-14 shadow-sm border border-[var(--neu-border)]">
                  <AvatarImage src={profile.avatar_url} />
                  <AvatarFallback className="bg-[var(--neu-bg)] text-indigo-500 dark:text-indigo-400 font-bold">
                    {displayInitial}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <CardTitle className="text-xl text-[var(--neu-text)]">{displayName}</CardTitle>
                  <p className="text-sm text-[var(--neu-subtle-text)] line-clamp-1">{profile.bio || 'Dasturchi va izlanuvchi'}</p>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 space-y-5 pt-5">
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-[var(--neu-text)] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                    O'rgata oladi:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {canTeach.length > 0 ? canTeach.map((skill: any) => (
                      <Badge key={skill.id} className="text-indigo-600 dark:text-indigo-400 bg-[var(--neu-muted)] border-transparent shadow-none hover:bg-[var(--neu-muted)]">
                        {skill.name}
                      </Badge>
                    )) : (
                      <span className="text-sm text-[var(--neu-subtle-text)]">Hech qanday</span>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-[var(--neu-text)] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    O'rganmoqchi:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {wantsToLearn.length > 0 ? wantsToLearn.map((skill: any) => (
                      <Badge key={skill.id} className="text-[var(--neu-text)] bg-[var(--neu-bg)] border-[var(--neu-border)] shadow-none hover:bg-[var(--neu-bg)]">
                        {skill.name}
                      </Badge>
                    )) : (
                      <span className="text-sm text-[var(--neu-subtle-text)]">Hech qanday</span>
                    )}
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="pt-4 border-t border-[var(--neu-border)] bg-[var(--neu-muted)]">
                {blockedReceiverIds.includes(profile.id) ? (
                  <Button disabled className="w-full bg-[var(--neu-bg)] text-[var(--neu-subtle-text)] shadow-none border border-[var(--neu-border)] opacity-70">
                    So'rov yuborilgan
                  </Button>
                ) : canTeach.length > 0 ? (
                  <SwapRequestModal receiver={profile} skills={canTeach} />
                ) : (
                  <Button disabled className="w-full bg-[var(--neu-bg)] text-[var(--neu-subtle-text)] shadow-none border border-[var(--neu-border)] opacity-70">
                    O'rganish uchun fan yo'q
                  </Button>
                )}
              </CardFooter>
            </Card>
          )
        })}
        
        {(!profiles || profiles.length === 0) && (
          <div className="col-span-full text-center py-16 bg-[var(--neu-bg)] border border-[var(--neu-border)] rounded-2xl shadow-inner">
            <h3 className="text-lg font-bold text-[var(--neu-text)]">Hech kim topilmadi</h3>
            <p className="text-[var(--neu-subtle-text)] mt-2">Hozircha platformada sizdan boshqa foydalanuvchilar yo'q.</p>
          </div>
        )}
      </div>
    </div>
  )
}
