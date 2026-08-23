import { ThemeToggle } from '@/components/custom/theme-toggle'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--neu-bg)] text-[var(--neu-text)] p-4 font-sans selection:bg-indigo-500/30">
      <div className="flex justify-end w-full max-w-7xl mx-auto pt-4">
        <ThemeToggle />
      </div>
      <div className="flex-1 flex items-center justify-center w-full max-w-md mx-auto">
        {children}
      </div>
    </div>
  )
}
