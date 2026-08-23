import { Loader2 } from 'lucide-react'

export default function DashboardLoading() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] w-full">
      <div className="flex flex-col items-center gap-4 text-[var(--neu-subtle-text)]">
        <div className="relative">
          <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full" />
          <Loader2 className="h-10 w-10 animate-spin text-indigo-500 relative z-10" />
        </div>
        <p className="text-sm font-medium tracking-wider uppercase opacity-70 animate-pulse">
          Ma'lumotlar yuklanmoqda...
        </p>
      </div>
    </div>
  )
}
