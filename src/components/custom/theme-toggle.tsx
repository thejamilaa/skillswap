'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <Button variant="outline" size="icon" className="rounded-full w-9 h-9 opacity-0"></Button>
  }

  return (
    <Button
      variant="outline"
      size="icon"
      className="rounded-full w-9 h-9 bg-transparent border-[var(--neu-border)]"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      {theme === 'dark' ? (
        <Moon className="h-4 w-4 text-slate-100" />
      ) : (
        <Sun className="h-4 w-4 text-slate-600" />
      )}
      <span className="sr-only">Tema almashtirish</span>
    </Button>
  )
}
