# API Integration & Realtime Architecture

## 1. Supabase Initialization (`@supabase/ssr`)

Strict separation of server and client Supabase instances to prevent context leakage.

### Server Client (`lib/supabase/server.ts`)
```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Context might be read-only (e.g., in a Server Component)
          }
        },
      },
    }
  )
}
```

### Browser Client (`lib/supabase/client.ts`)
```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

## 2. Realtime Chat Architecture

Messages require low-latency delivery. We use Supabase Realtime subscriptions.

### Event Subscription Pattern (`components/custom/chat-interface.tsx`)
```typescript
"use client"
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Message } from '@/types/app.types'

export function ChatInterface({ swapId, initialMessages }: { swapId: string, initialMessages: Message[] }) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const supabase = createClient()

  useEffect(() => {
    // Subscribe to new messages for this specific swap
    const channel = supabase
      .channel(`swap_chat_${swapId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `swap_id=eq.${swapId}`
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [swapId, supabase])

  // ... render UI and send message logic
}
```

## 3. Peer-to-Peer Video Classroom (Jitsi Meet)

To avoid complex WebRTC signaling server management for the MVP, we integrate Jitsi Meet via an iframe. It is open-source, free, and secure.

### Room Naming Convention
To ensure privacy and uniqueness, the room name is deterministically generated based on the `swap_id` (UUID).
Format: `SkillSwap-${swap_id}`

### Embedded iframe Logic (`components/custom/jitsi-classroom.tsx`)
```typescript
"use client"

export function JitsiClassroom({ swapId, userName }: { swapId: string, userName: string }) {
  const domain = "meet.jit.si";
  const roomName = `SkillSwap-${swapId}`;

  // Use the Jitsi Iframe API or a direct iframe embed
  return (
    <div className="w-full h-full min-h-[600px] rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800">
      <iframe
        src={`https://${domain}/${roomName}#userInfo.displayName="${encodeURIComponent(userName)}"&config.prejoinPageEnabled=false`}
        allow="camera; microphone; fullscreen; display-capture"
        className="w-full h-full border-0"
      />
    </div>
  )
}
```
