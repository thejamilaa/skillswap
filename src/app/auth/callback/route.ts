import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // Odatda tasdiqlashdan so'ng /discover sahifasiga yo'naltiriladi
  const next = searchParams.get('next') ?? '/discover'

  if (code) {
    const supabase = createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Agar xato bo'lsa yoki kod yaroqsiz bo'lsa
  return NextResponse.redirect(`${origin}/login?message=Pochtani tasdiqlashda xatolik yuz berdi`)
}
