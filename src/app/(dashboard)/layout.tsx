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
          
          {/* Logo */}
          <Link href="/discover" className="flex items-center gap-2 shrink-0">
            <Image src="/logo-Photoroom.png" alt="SkillSwap Logo" width={36} height={36} className="object-contain" />
            <span className="text-lg font-black tracking-widest text-[var(--neu-text)] hidden sm:block">SkillSwap</span>
          </Link>

          {/* Desktop NavLinks — faqat md+ da ko'rinadi */}
          <NavLinks pendingSwapsCount={incomingPendingCount || 0} />

          {/* O'ng tomon: credits + logout */}
          <div className="flex items-center gap-2 shrink-0">
            <ThemeToggle />
            {/* Kreditlar — faqat sm+ da ko'rinadi */}
            <div className="hidden sm:flex items-center gap-2">
              <div className="flex flex-row items-center justify-center gap-1.5 text-xs font-bold text-[var(--neu-text)] bg-[var(--neu-muted)] px-2.5 py-1.5 rounded-full border border-[var(--neu-border)] whitespace-nowrap">
                <Gem className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                <span>{profile?.credits || 0}</span>
              </div>
              <div className="flex flex-row items-center justify-center gap-1.5 text-xs font-bold text-[var(--neu-text)] bg-[var(--neu-muted)] px-2.5 py-1.5 rounded-full border border-[var(--neu-border)] whitespace-nowrap">
                <Snowflake className="w-3.5 h-3.5 text-slate-500" />
                <span>{frozenCredits}</span>
              </div>
            </div>
            {/* Logout — faqat md+ da ko'rinadi */}
            <form action={logout}>
              <Button variant="ghost" size="sm" type="submit" className="hidden md:inline-flex">Chiqish</Button>
            </form>
          </div>

        </div>
      </header>

      {/* Pastdan bottom nav uchun pb-20 (telefonda), oddiy py-8 (desktopda) */}
      <main className="flex-1 w-full max-w-7xl mx-auto py-6 px-4 md:px-6 md:py-8 pb-24 md:pb-8">
        {children}
      </main>
    </div>
  )
}
