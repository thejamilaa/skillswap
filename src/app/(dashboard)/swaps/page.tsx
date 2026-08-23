import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { SwapActionButtons } from '@/components/custom/swap-action-buttons'
import Link from 'next/link'
import { Gem, Video } from 'lucide-react'

export default async function SwapsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  // Fetch all swaps for user
  const { data: swaps, error } = await supabase
    .from('swap_requests')
    .select(`
      id, status, message, created_at, sender_id, receiver_id, credits_frozen,
      sender:profiles!swap_requests_sender_id_fkey(id, full_name, avatar_url),
      receiver:profiles!swap_requests_receiver_id_fkey(id, full_name, avatar_url),
      skill:skills(name)
    `)
    .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
    .order('created_at', { ascending: false })

  if (error) {
    console.error(error)
  }

  const incomingPending = swaps?.filter(s => s.receiver_id === user.id && s.status === 'pending') || []
  const outgoingPending = swaps?.filter(s => s.sender_id === user.id && s.status === 'pending') || []
  const activeSwaps = swaps?.filter(s => s.status === 'accepted' || s.status === 'active') || []

  return (
    <div className="space-y-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-[var(--neu-text)]">Almashuvlar paneli</h1>
        <p className="text-sm text-[var(--neu-subtle-text)]">Bu yerda sizning barcha darslaringiz va so'rovlaringiz ko'rsatiladi.</p>
      </div>

      {/* Incoming Requests */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold border-b border-[var(--neu-border)] pb-2 text-[var(--neu-text)]">Sizga kelgan so'rovlar ({incomingPending.length})</h2>
        {incomingPending.length === 0 ? (
          <div className="text-[var(--neu-subtle-text)] py-8 bg-[var(--neu-surface)] rounded-lg border border-[var(--neu-border)] text-center text-sm">Hozircha sizga o'quvchilardan so'rovlar kelmagan.</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {incomingPending.map(swap => (
              <Card key={swap.id}>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 border border-[var(--neu-border)]">
                      <AvatarImage src={swap.sender?.avatar_url} />
                      <AvatarFallback>{swap.sender?.full_name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg text-[var(--neu-text)]">{swap.sender?.full_name}</CardTitle>
                      <CardDescription>Sizdan dars so'rayapti</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-[var(--neu-text)]">
                    <span className="font-semibold">Qaysi fandan:</span> <Badge variant="outline" className="ml-2 border-[var(--neu-border)] text-[var(--neu-text)]">{swap.skill?.name}</Badge>
                  </div>
                  {swap.message && (
                    <div className="text-sm bg-[var(--neu-muted)] p-4 rounded-md border border-[var(--neu-border)] text-[var(--neu-text)] italic">
                      "{swap.message}"
                    </div>
                  )}
                  <div className="text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 p-3 rounded-md flex items-center gap-2">
                    <Gem className="w-4 h-4" /> Agar qabul qilsangiz, siz 1 kredit ishlaysiz.
                  </div>
                </CardContent>
                <CardFooter className="gap-3 pt-2">
                  <SwapActionButtons swapId={swap.id} senderId={swap.sender_id} />
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Active Swaps */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold border-b border-[var(--neu-border)] pb-2 text-[var(--neu-text)]">Faol darslar ({activeSwaps.length})</h2>
        {activeSwaps.length === 0 ? (
          <div className="text-[var(--neu-subtle-text)] py-8 bg-[var(--neu-surface)] rounded-lg border border-[var(--neu-border)] text-center text-sm">Hozircha faol darslar yo'q.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeSwaps.map(swap => {
              const isTeacher = swap.receiver_id === user.id
              const partner = isTeacher ? swap.sender : swap.receiver
              
              return (
                <Card key={swap.id} className="overflow-hidden">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Avatar className="border border-[var(--neu-border)]">
                        <AvatarImage src={partner?.avatar_url} />
                        <AvatarFallback>{partner?.full_name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg text-[var(--neu-text)]">{partner?.full_name}</CardTitle>
                        <CardDescription className={isTeacher ? "text-indigo-600 dark:text-indigo-400" : "text-emerald-600 dark:text-emerald-400"}>
                          {isTeacher ? "Sizning o'quvchingiz" : "Sizning o'qituvchingiz"}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm flex items-center justify-between border-t border-[var(--neu-border)] pt-4 mt-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[var(--neu-subtle-text)]">Fan:</span> 
                        <Badge variant="outline" className="border-[var(--neu-border)]">{swap.skill?.name}</Badge>
                      </div>
                      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-900/30 shadow-none border-none">Faol</Badge>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-[var(--neu-muted)] pt-4 border-t border-[var(--neu-border)]">
                    <Link href={`/swaps/${swap.id}`} className="w-full">
                      <Button className="w-full bg-indigo-600 dark:bg-indigo-600 hover:bg-indigo-700 dark:hover:bg-indigo-700 text-white dark:text-white border-transparent dark:border-transparent gap-2">
                        <Video className="w-5 h-5" /> Video xonaga kirish
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        )}
      </section>

      {/* Outgoing Requests */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold border-b border-[var(--neu-border)] pb-2 text-[var(--neu-text)]">Siz yuborgan so'rovlar ({outgoingPending.length})</h2>
        {outgoingPending.length === 0 ? (
          <div className="text-[var(--neu-subtle-text)] py-2 text-sm">Hozircha siz hech kimga so'rov yubormagansiz.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {outgoingPending.map(swap => (
              <Card key={swap.id} className="opacity-80">
                <CardHeader className="pb-3 pt-4">
                  <div className="flex items-center gap-2 mb-2">
                     <Avatar className="h-6 w-6 border border-[var(--neu-border)]">
                        <AvatarImage src={swap.receiver?.avatar_url} />
                        <AvatarFallback>{swap.receiver?.full_name?.charAt(0)}</AvatarFallback>
                     </Avatar>
                     <CardTitle className="text-sm font-medium text-[var(--neu-text)]">{swap.receiver?.full_name}</CardTitle>
                  </div>
                  <CardDescription className="text-xs">Fan: {swap.skill?.name}</CardDescription>
                </CardHeader>
                <CardFooter className="pt-0">
                  <Badge variant="outline" className="w-full justify-center py-1 border-[var(--neu-border)] text-[var(--neu-subtle-text)]">Kutilyapti...</Badge>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* History (Tarix) */}
      <section className="space-y-4 pb-8">
        <h2 className="text-lg font-semibold border-b border-[var(--neu-border)] pb-2 text-[var(--neu-text)]">Tarix (Tugallangan va Rad etilganlar)</h2>
        {(() => {
          const historySwaps = swaps?.filter(s => s.status === 'completed' || s.status === 'declined') || []
          if (historySwaps.length === 0) {
            return <div className="text-[var(--neu-subtle-text)] py-2 text-sm">Hozircha tarix yo'q.</div>
          }
          return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {historySwaps.map(swap => {
                const isTeacher = swap.receiver_id === user.id
                const partner = isTeacher ? swap.sender : swap.receiver
                return (
                  <Card key={swap.id} className="opacity-70">
                    <CardHeader className="pb-3 pt-4">
                      <div className="flex items-center gap-2 mb-2">
                         <Avatar className="h-6 w-6 border border-[var(--neu-border)]">
                            <AvatarImage src={partner?.avatar_url} />
                            <AvatarFallback>{partner?.full_name?.charAt(0)}</AvatarFallback>
                         </Avatar>
                         <CardTitle className="text-sm font-medium text-[var(--neu-text)]">{partner?.full_name}</CardTitle>
                      </div>
                      <CardDescription className="text-xs">Fan: {swap.skill?.name}</CardDescription>
                    </CardHeader>
                    <CardFooter className="pt-0">
                      {swap.status === 'completed' ? (
                        <Badge className="bg-[var(--neu-muted)] text-[var(--neu-text)] w-full justify-center shadow-none border border-[var(--neu-border)] py-1">Yakunlangan</Badge>
                      ) : (
                        <Badge variant="outline" className="text-red-500 border-red-200 dark:border-red-900/50 w-full justify-center py-1">Rad etilgan</Badge>
                      )}
                    </CardFooter>
                  </Card>
                )
              })}
            </div>
          )
        })()}
      </section>
    </div>
  )
}
