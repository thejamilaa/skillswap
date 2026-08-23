# Application Architecture

## 1. Directory Structure (Next.js 14+ App Router)

```text
SkillSwap/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   ├── discover/page.tsx
│   │   ├── swaps/
│   │   │   ├── page.tsx
│   │   │   └── [swapId]/page.tsx       # Chat & classroom UI
│   │   ├── profile/page.tsx
│   │   └── layout.tsx                  # Authenticated sidebar/nav
│   ├── (marketing)/
│   │   ├── page.tsx                    # Landing page
│   │   └── layout.tsx
│   ├── api/
│   │   └── auth/callback/route.ts      # Supabase Auth callback
│   ├── layout.tsx                      # Root layout, Providers
│   └── globals.css
├── components/
│   ├── ui/                             # shadcn/ui generic components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── ...
│   └── custom/                         # App-specific components
│       ├── swap-request-modal.tsx
│       ├── chat-interface.tsx
│       ├── jitsi-classroom.tsx
│       └── skill-badge.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts                   # Browser client
│   │   ├── server.ts                   # Server component client
│   │   └── middleware.ts               # Auth middleware logic
│   └── utils.ts                        # Tailwind merge, formatting
├── types/
│   ├── database.types.ts               # Supabase generated types
│   └── app.types.ts                    # Custom application interfaces
├── middleware.ts                       # Next.js middleware
├── tailwind.config.ts
└── next.config.mjs
```

## 2. Server Components vs Client Components

### Server Components (Default)
Used for data fetching, SEO, and minimizing client bundle size.
- **`app/(dashboard)/discover/page.tsx`**: Fetches the directory of users and their skills from Supabase directly on the server.
- **`app/(dashboard)/swaps/page.tsx`**: Fetches the list of active/pending swaps for the authenticated user.
- **`app/(marketing)/page.tsx`**: Static landing page content.

### Client Components (`"use client"`)
Used for interactivity, state management, and real-time features.
- **`components/custom/chat-interface.tsx`**: Manages real-time Supabase subscriptions and local message state.
- **`components/custom/jitsi-classroom.tsx`**: Embeds the Jitsi iframe and handles browser APIs.
- **`components/custom/swap-request-modal.tsx`**: Form handling, validation (Zod + React Hook Form), and interactive UI states.
- **`app/(auth)/*/page.tsx`**: Authentication forms handling user input and Supabase client-side auth methods.

## 3. Authentication Flow & Middleware

### Supabase SSR Flow
1. User submits login form -> Client component calls `supabase.auth.signInWithPassword()`.
2. Supabase sets an HTTP-only cookie with the session token.
3. Next.js `middleware.ts` intercepts incoming requests, reads the cookie using `@supabase/ssr`, and refreshes the session if expired.

### Route Protection Logic (`middleware.ts`)
```typescript
import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  // Update session and retrieve auth status
  const { response, user } = await updateSession(request)

  const isAuthRoute = request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/register')
  const isDashboardRoute = request.nextUrl.pathname.startsWith('/discover') || request.nextUrl.pathname.startsWith('/swaps') || request.nextUrl.pathname.startsWith('/profile')

  if (isDashboardRoute && !user) {
    // Redirect unauthenticated users to login
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (isAuthRoute && user) {
    // Redirect authenticated users away from auth pages
    return NextResponse.redirect(new URL('/discover', request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```
