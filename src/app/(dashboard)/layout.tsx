import Link from 'next/link'
import { logout } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import { ThemeToggle } from '@/components/custom/theme-toggle'
import { NavLinks } from '@/components/custom/nav-links'
import Image from 'next/image'
import { Gem, Snowflake } from 'lucide-react'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('credits').eq('id', user.id).single()
  
  const { data: pendingSwaps } = await supabase
    .from('swap_requests')
    .select('credits_frozen')
    .eq('sender_id', user.id)
    .eq('status', 'pending')
  
  const frozenCredits = pendingSwaps?.reduce((acc, curr) => acc + (curr.credits_frozen || 0), 0) || 0

  const { count: incomingPendingCount } = await supabase
    .from('swap_requests')
    .select('*', { count: 'exact', head: true })
    .eq('receiver_id', user.id)
    .eq('status', 'pending')

  return (
    <div className="flex min-h-screen flex-col bg-[var(--neu-bg)] text-[var(--neu-text)]">
      <header className="sticky top-0 z-50 w-full border-b border-[var(--neu-border)] bg-[var(--neu-surface)] shadow-sm">
        <div className="w-full max-w-7xl mx-auto flex py-3 items-center justify-between px-4 md:px-6">
          
          <div className="flex items-center gap-4 md:gap-8 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
            <Link href="/discover" className="flex items-center gap-3 shrink-0">
              <div className="relative flex items-center justify-center">
                <Image src="/logo-Photoroom.png" alt="SkillSwap Logo" width={40} height={40} className="object-contain" />
              </div>
              <span className="text-xl font-black tracking-widest text-[var(--neu-text)] hidden md:block">SkillSwap</span>
            </Link>
            <NavLinks pendingSwapsCount={incomingPendingCount || 0} />
          </div>

          <div className="flex items-center gap-3 shrink-0 ml-4">
             <ThemeToggle />
             <div className="flex items-center gap-2">
               <div className="flex flex-row items-center justify-center gap-1.5 text-xs sm:text-sm font-bold text-[var(--neu-text)] bg-[var(--neu-muted)] px-3 py-1.5 rounded-full border border-[var(--neu-border)] whitespace-nowrap">
                 <Gem className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                 <span>{profile?.credits || 0}</span>
               </div>
               <div className="flex flex-row items-center justify-center gap-1.5 text-xs sm:text-sm font-bold text-[var(--neu-text)] bg-[var(--neu-muted)] px-3 py-1.5 rounded-full border border-[var(--neu-border)] whitespace-nowrap">
                 <Snowflake className="w-3.5 h-3.5 text-slate-500" />
                 <span>{frozenCredits}</span>
               </div>
             </div>
             <form action={logout}>
               <Button variant="ghost" size="sm" type="submit" className="hidden sm:inline-flex">Chiqish</Button>
             </form>
          </div>

        </div>
      </header>
      <main className="flex-1 w-full max-w-7xl mx-auto py-8 px-4 md:px-6">
        {children}
      </main>
    </div>
  )
}
