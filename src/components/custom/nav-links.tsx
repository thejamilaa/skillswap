"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function NavLinks({ pendingSwapsCount = 0 }: { pendingSwapsCount?: number }) {
  const pathname = usePathname()

  const links = [
    { href: "/discover", label: "Kashf etish" },
    { href: "/swaps", label: "Almashuvlar", badge: pendingSwapsCount },
    { href: "/leaderboard", label: "Reyting" },
    { href: "/profile", label: "Profil" },
  ]

  return (
    <nav className="flex gap-4 sm:gap-6 overflow-x-auto pb-1 md:pb-0 w-full no-scrollbar items-center">
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
  )
}
