'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'

interface LoadingLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
}

export function LoadingLink({ href, children, className, ...props }: LoadingLinkProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    setLoading(true)
    router.push(href)
  }

  return (
    <a href={href} onClick={handleClick} className={className} {...props}>
      {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : children}
    </a>
  )
}
