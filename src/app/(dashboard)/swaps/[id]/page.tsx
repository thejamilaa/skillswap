import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ChatRoom } from '@/components/custom/chat-room'
import { VideoRoom } from '@/components/custom/video-room'
import { ReviewForm } from '@/components/custom/review-form'
import { EndClassButton } from '@/components/custom/end-class-button'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function SwapWorkspacePage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return redirect('/login')

  const { data, error } = await supabase
    .from('swap_requests')
    .select(`
      id, status, sender_id, receiver_id, requested_skill_id,
      sender:profiles!swap_requests_sender_id_fkey(id, full_name, avatar_url),
      receiver:profiles!swap_requests_receiver_id_fkey(id, full_name, avatar_url),
      skill:skills(name)
    `)
    .eq('id', params.id)
    .single()

  const swap = data as any

  if (error || !swap) {
    return <div className="p-8 text-center text-red-500">So'rov topilmadi yoki xatolik yuz berdi.</div>
  }

  if (swap.sender_id !== user.id && swap.receiver_id !== user.id) {
    return <div className="p-8 text-center text-red-500">Sizda bu xonaga kirish huquqi yo'q.</div>
  }

  if (swap.status !== 'accepted' && swap.status !== 'active' && swap.status !== 'completed') {
    return (
        <div className="p-12 text-center flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-2">Bu dars hozircha faol emas</h2>
            <p className="text-slate-500 mb-6">Status: {swap.status}</p>
            <Link href="/swaps">
                <Button variant="outline">Ortga qaytish</Button>
            </Link>
        </div>
    )
  }

  const isTeacher = swap.receiver_id === user.id
  const partner = isTeacher ? swap.sender : swap.receiver
  const currentUser = isTeacher ? swap.receiver : swap.sender

  // Agar dars yakunlangan bo'lsa, baholash formasini ko'rsatamiz
  if (swap.status === 'completed') {
    // Check if current user already submitted a review
    const { data: existingReview } = await supabase
      .from('reviews')
      .select('id')
      .eq('swap_id', swap.id)
      .eq('reviewer_id', user.id)
      .single()

    return (
      <div className="flex flex-col h-[calc(100vh-8rem)]">
        <div className="flex items-center justify-between mb-4 bg-[var(--neu-surface)] p-4 rounded-xl border border-[var(--neu-border)]">
          <div>
              <h1 className="text-xl font-bold text-[var(--neu-text)]">1-ga-1 Dars Xonasi <span className="text-sm font-normal text-emerald-600 dark:text-emerald-400 bg-[var(--neu-muted)] px-2 py-1 rounded-md ml-2 border border-[var(--neu-border)]">Yakunlangan</span></h1>
              <p className="text-sm text-[var(--neu-subtle-text)]">Fan: <span className="font-semibold text-[var(--neu-text)]">{swap.skill?.name}</span></p>
          </div>
          <Link href="/swaps">
              <Button variant="outline" size="sm">Bosh sahifaga qaytish</Button>
          </Link>
        </div>
        
        <ReviewForm 
          swapId={swap.id} 
          revieweeId={partner?.id || ''} 
          partnerName={partner?.full_name || 'Foydalanuvchi'} 
          existingReview={existingReview}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Header Info */}
      <div className="flex items-center justify-between mb-4 bg-[var(--neu-surface)] p-4 rounded-xl border border-[var(--neu-border)]">
        <div>
            <h1 className="text-xl font-bold flex items-center gap-2 text-[var(--neu-text)]">
              <span className="w-2 h-2 bg-emerald-500 rounded-full inline-block"></span> 
              Jonli Dars
            </h1>
            <p className="text-sm text-[var(--neu-subtle-text)]">Fan: <span className="font-semibold text-[var(--neu-text)]">{swap.skill?.name}</span></p>
        </div>
        <div className="flex items-center gap-3">
          <EndClassButton swapId={swap.id} />
          <Link href="/swaps">
              <Button variant="outline" size="sm">Chiqish</Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col md:flex-row flex-1 gap-4 overflow-hidden">
        {/* Video Call Column (Takes up more space) */}
        <div className="flex-grow flex flex-col rounded-xl overflow-hidden border border-[var(--neu-border)] bg-[var(--neu-surface)] shadow-sm relative">
            <VideoRoom swapId={swap.id} userName={currentUser?.full_name || 'Talaba'} />
        </div>

        {/* Chat Column */}
        <div className="w-full md:w-[400px] flex flex-col border border-[var(--neu-border)] rounded-xl overflow-hidden bg-[var(--neu-surface)] shadow-sm shrink-0">
            <ChatRoom swapId={swap.id} currentUser={currentUser} partner={partner} />
        </div>
      </div>
    </div>
  )
}
