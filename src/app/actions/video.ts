'use server'

import { createClient } from '@/lib/supabase/server'

export async function getOrCreateDailyRoom(swapId: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const roomName = `swap_${swapId.replace(/-/g, '_')}`
  const apiKey = process.env.DAILY_API_KEY
  
  if (!apiKey) {
    return { error: 'DAILY_API_KEY .env.local faylida topilmadi' }
  }

  try {
    // 1. Avval bunday xona bor-yo'qligini tekshiramiz (GET)
    let res = await fetch(`https://api.daily.co/v1/rooms/${roomName}`, {
      headers: { Authorization: `Bearer ${apiKey}` }
    })
    
    if (res.ok) {
      const data = await res.json()
      return { url: data.url }
    }

    // 2. Agar yo'q bo'lsa, yangi xona yaratamiz (POST)
    res = await fetch('https://api.daily.co/v1/rooms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        name: roomName,
        privacy: 'public',
        properties: { exp: Math.round(Date.now() / 1000) + (86400 * 7) } // 1 hafta yashaydi
      })
    })
    
    if (res.ok) {
      const data = await res.json()
      return { url: data.url }
    }
    
    return { error: 'Daily serveri xonani yarata olmadi' }
  } catch (err: any) {
    return { error: err.message }
  }
}
