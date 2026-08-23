import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request)

  const url = request.nextUrl.pathname
  const isAuthRoute = url.startsWith('/login') || url.startsWith('/register')
  const isDashboardRoute = url.startsWith('/discover') || url.startsWith('/swaps') || url.startsWith('/profile') || url.startsWith('/leaderboard')

  if (isDashboardRoute && !user) {
    // Redirect unauthenticated users to login
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (isAuthRoute && user) {
    // Redirect authenticated users away from auth pages
    return NextResponse.redirect(new URL('/discover', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
