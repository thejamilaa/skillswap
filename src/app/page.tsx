import Link from 'next/link'
import Image from 'next/image'
import { GraduationCap, Lightbulb, ShieldCheck } from 'lucide-react'
import { ThemeToggle } from '@/components/custom/theme-toggle'
import { LoadingLink } from '@/components/custom/loading-link'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--neu-bg)] text-[var(--neu-text)] font-sans selection:bg-indigo-500/30">
      {/* HEADER */}
      <header className="px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative flex items-center justify-center">
            <Image src="/logo-Photoroom.png" alt="SkillSwap Logo" width={108} height={108} className="object-contain" />
          </div>
          <span className="text-3xl font-black tracking-widest text-[var(--neu-text)]">
            SkillSwap
          </span>
        </div>
        <nav className="flex items-center gap-8">
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <LoadingLink 
              href="/login" 
              className="px-6 py-3 rounded-xl font-bold text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-all duration-300 flex items-center justify-center"
            >
              Kirish
            </LoadingLink>
            <LoadingLink 
              href="/register" 
              className="px-6 py-3 rounded-xl font-bold text-white bg-indigo-600 shadow-sm hover:bg-indigo-700 transition-all duration-300 flex items-center justify-center"
            >
              Ro'yxatdan o'tish
            </LoadingLink>
          </div>
        </nav>
      </header>

      {/* HERO SECTION */}
      <main className="flex flex-col items-center justify-center text-center px-6 max-w-5xl mx-auto py-20 md:py-32">
        
        {/* Main Title - Dark Embossed look */}
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-[var(--neu-text)]" 
           >
          Bilim ulashing. <br className="hidden md:block"/>
          <span className="text-indigo-500 dark:text-indigo-400">Tekinga o'rganing.</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-[var(--neu-subtle-text)] mb-14 max-w-3xl leading-relaxed font-medium">
          O'z tajribangizni boshqalarga o'rgatib, "kreditlar" ishlang va istalgan fanni mutlaqo bepul o'rganing.
        </p>

        {/* Big CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
          <LoadingLink 
            href="/register" 
            className="relative px-10 py-4 rounded-2xl font-bold text-xl text-white bg-indigo-600 shadow-md hover:bg-indigo-700 transition-all duration-200 flex items-center justify-center min-w-[240px]"
          >
            Hoziroq boshlash
          </LoadingLink>

          <LoadingLink 
            href="/discover" 
            className="px-10 py-4 rounded-2xl font-bold text-xl text-slate-700 dark:text-gray-200 bg-[var(--neu-surface)] shadow-sm border border-[var(--neu-border)] hover:bg-slate-100 dark:hover:bg-white/5 transition-all duration-200 flex items-center justify-center min-w-[240px]"
          >
            Platformani ko'rish
          </LoadingLink>
        </div>

        {/* Feature Cards in Dark Skeuomorphic style */}
        <div className="mt-32 w-full grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          
          {/* Card 1 */}
          <Card className="flex flex-col items-center text-center p-8 bg-[var(--neu-surface)]">
            <div className="w-16 h-16 mb-6 rounded-full bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-500 dark:text-indigo-400">
              <GraduationCap size={32} strokeWidth={2} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-[var(--neu-text)]">O'rganing</h3>
            <p className="text-sm text-[var(--neu-subtle-text)] font-medium leading-relaxed">
              Mutaxassislarni toping va ular bilan 1-ga-1 video darslar qiling.
            </p>
          </Card>

          {/* Card 2 */}
          <Card className="flex flex-col items-center text-center p-8 bg-[var(--neu-surface)]">
            <div className="w-16 h-16 mb-6 rounded-full bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-500 dark:text-indigo-400">
              <Lightbulb size={32} strokeWidth={2} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-[var(--neu-text)]">O'rgating</h3>
            <p className="text-sm text-[var(--neu-subtle-text)] font-medium leading-relaxed">
              O'zingiz yaxshi bilgan fanni o'rgatib ichki kreditlarni ishlating.
            </p>
          </Card>

          {/* Card 3 */}
          <Card className="flex flex-col items-center text-center p-8 bg-[var(--neu-surface)]">
            <div className="w-16 h-16 mb-6 rounded-full bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-500 dark:text-indigo-400">
              <ShieldCheck size={32} strokeWidth={2} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-[var(--neu-text)]">Himoya</h3>
            <p className="text-sm text-[var(--neu-subtle-text)] font-medium leading-relaxed">
              Kreditlarni muzlatish orqali darsni bekor qiluvchilardan himoyalaning.
            </p>
          </Card>

        </div>
      </main>
      
      <footer className="mt-12 py-10 text-center font-medium text-gray-500 bg-[var(--neu-surface)] border-t border-[var(--neu-border)]">
        &copy; {new Date().getFullYear()} SkillSwap MVP. Barcha huquqlar himoyalangan.
      </footer>
    </div>
  )
}
