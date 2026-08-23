'use client'

import { useFormStatus } from 'react-dom'
import { Button, type ButtonProps } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

interface SubmitButtonProps extends ButtonProps {
  loadingText?: string
}

export function SubmitButton({ children, loadingText, className, ...props }: SubmitButtonProps) {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending || props.disabled} className={className} {...props}>
      {pending ? <Loader2 className="h-5 w-5 animate-spin" /> : children}
    </Button>
  )
}
