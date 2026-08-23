import Link from 'next/link'
import Image from 'next/image'
import { GraduationCap, Lightbulb, ShieldCheck } from 'lucide-react'
import { ThemeToggle } from '@/components/custom/theme-toggle'
import { LoadingLink } from '@/components/custom/loading-link'
import { Card } from '@/components/ui/card'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--neu-bg)] text-[var(--neu-text)] font-sans selection:bg-indigo-500/30">
      {/* HEADER */}
      <header className="px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <Image src="/logo-Photoroom.png" alt="SkillSwap Logo" width={44} height={44} className="object-contain" />
          <span className="text-xl sm:text-2xl font-black tracking-widest text-[var(--neu-text)]">
            SkillSwap
          </span>
        </div>
        <nav className="flex items-center gap-2 sm:gap-4">
          <ThemeToggle />
          <LoadingLink
            href="/login"
            className="px-3 sm:px-5 py-2 rounded-xl text-sm font-bold text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-all duration-300 flex items-center justify-center"
          >
            Kirish
          </LoadingLink>
          <LoadingLink
            href="/register"
            className="px-3 sm:px-5 py-2 rounded-xl text-sm font-bold text-white bg-indigo-600 shadow-sm hover:bg-indigo-700 transition-all duration-300 flex items-center justify-center"
          >
            Ro&apos;yxatdan o&apos;tish
          </LoadingLink>
        </nav>
      </header>

      {/* HERO SECTION */}
      <main className="flex flex-col items-center justify-center text-center px-4 sm:px-6 max-w-5xl mx-auto py-14 sm:py-20 md:py-28">
        
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight mb-6 sm:mb-8 text-[var(--neu-text)]">
          Bilim ulashing. <br className="hidden sm:block" />
          <span className="text-indigo-500 dark:text-indigo-400">Tekinga o&apos;rganing.</span>
        </h1>
        
        <p className="text-base sm:text-lg md:text-xl text-[var(--neu-subtle-text)] mb-10 sm:mb-14 max-w-2xl leading-relaxed font-medium px-2">
          O&apos;z tajribangizni boshqalarga o&apos;rgatib, &quot;kreditlar&quot; ishlang va istalgan fanni mutlaqo bepul o&apos;rganing.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto justify-center">
          <LoadingLink
            href="/register"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-lg text-white bg-indigo-600 shadow-md hover:bg-indigo-700 transition-all duration-200 flex items-center justify-center"
          >
            Hoziroq boshlash
          </LoadingLink>

          <LoadingLink
            href="/discover"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-lg text-slate-700 dark:text-gray-200 bg-[var(--neu-surface)] shadow-sm border border-[var(--neu-border)] hover:bg-slate-100 dark:hover:bg-white/5 transition-all duration-200 flex items-center justify-center"
          >
            Platformani ko&apos;rish
          </LoadingLink>
        </div>

        {/* Feature Cards */}
        <div className="mt-20 sm:mt-28 w-full grid grid-cols-1 sm:grid-cols-3 gap-5 text-left">
          
          <Card className="flex flex-col items-center text-center p-6 sm:p-8 bg-[var(--neu-surface)]">
            <div className="w-14 h-14 mb-5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-500 dark:text-indigo-400">
              <GraduationCap size={28} strokeWidth={2} />
            </div>
            <h3 className="text-lg font-bold mb-2 text-[var(--neu-text)]">O&apos;rganing</h3>
            <p className="text-sm text-[var(--neu-subtle-text)] font-medium leading-relaxed">
              Mutaxassislarni toping va ular bilan 1-ga-1 video darslar qiling.
            </p>
          </Card>

          <Card className="flex flex-col items-center text-center p-6 sm:p-8 bg-[var(--neu-surface)]">
            <div className="w-14 h-14 mb-5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-500 dark:text-indigo-400">
              <Lightbulb size={28} strokeWidth={2} />
            </div>
            <h3 className="text-lg font-bold mb-2 text-[var(--neu-text)]">O&apos;rgating</h3>
            <p className="text-sm text-[var(--neu-subtle-text)] font-medium leading-relaxed">
              O&apos;zingiz yaxshi bilgan fanni o&apos;rgatib ichki kreditlarni ishlating.
            </p>
          </Card>

          <Card className="flex flex-col items-center text-center p-6 sm:p-8 bg-[var(--neu-surface)]">
            <div className="w-14 h-14 mb-5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-500 dark:text-indigo-400">
              <ShieldCheck size={28} strokeWidth={2} />
            </div>
            <h3 className="text-lg font-bold mb-2 text-[var(--neu-text)]">Himoya</h3>
            <p className="text-sm text-[var(--neu-subtle-text)] font-medium leading-relaxed">
              Kreditlarni muzlatish orqali darsni bekor qiluvchilardan himoyalaning.
            </p>
          </Card>

        </div>
      </main>
      
      <footer className="mt-8 py-8 text-center font-medium text-gray-500 bg-[var(--neu-surface)] border-t border-[var(--neu-border)] text-sm">
        &copy; {new Date().getFullYear()} SkillSwap MVP. Barcha huquqlar himoyalangan.
      </footer>
    </div>
  )
}
