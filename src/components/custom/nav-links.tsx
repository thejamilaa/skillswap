"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Compass, ArrowLeftRight, Trophy, User } from "lucide-react"

export function NavLinks({ pendingSwapsCount = 0 }: { pendingSwapsCount?: number }) {
  const pathname = usePathname()

  const links = [
    { href: "/discover", label: "Kashf etish", icon: Compass },
    { href: "/swaps", label: "Almashuvlar", icon: ArrowLeftRight, badge: pendingSwapsCount },
    { href: "/leaderboard", label: "Reyting", icon: Trophy },
    { href: "/profile", label: "Profil", icon: User },
  ]

  return (
    <>
      {/* Desktop nav — header ichida */}
      <nav className="hidden md:flex gap-4 lg:gap-6 items-center">
        {links.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`)
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative text-sm font-medium whitespace-nowrap transition-colors flex items-center py-1 pr-1",
                isActive
                  ? "text-indigo-600 dark:text-indigo-400"
                  : "text-[var(--neu-subtle-text)] hover:text-indigo-600 dark:hover:text-indigo-300"
              )}
            >
              {link.label}
              {link.badge && link.badge > 0 ? (
                <span className="absolute top-1 -right-2.5 h-1.5 w-1.5 rounded-full bg-[var(--neu-text)] shadow-sm"></span>
              ) : null}
            </Link>
          )
        })}
      </nav>

      {/* Mobile bottom nav bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-[var(--neu-border)] bg-[var(--neu-surface)] shadow-[0_-2px_12px_rgba(0,0,0,0.07)] pb-safe">
        {links.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`)
          const Icon = link.icon
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative flex flex-col items-center justify-center gap-0.5 py-3 px-4 text-[10px] font-medium transition-colors min-w-[56px]",
                isActive
                  ? "text-indigo-600 dark:text-indigo-400"
                  : "text-[var(--neu-subtle-text)]"
              )}
            >
              <Icon size={22} strokeWidth={isActive ? 2.2 : 1.8} />
              <span>{link.label}</span>
              {link.badge && link.badge > 0 ? (
                <span className="absolute top-2 right-4 h-2 w-2 rounded-full bg-indigo-500 border-2 border-[var(--neu-surface)]"></span>
              ) : null}
            </Link>
          )
        })}
      </nav>
    </>
  )
}
