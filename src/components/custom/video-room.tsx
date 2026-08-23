'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

export function VideoRoom({ swapId, userName }: { swapId: string, userName: string }) {
  const [joined, setJoined] = useState(false)
  
  const roomName = `skillswap-room-${swapId}`

  if (!joined) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-[var(--neu-muted)] rounded-full flex items-center justify-center text-4xl mb-6 shadow-sm border border-[var(--neu-border)]">📹</div>
        <h2 className="text-2xl font-bold mb-2 text-[var(--neu-text)]">Video dars xonasi</h2>
        <p className="text-[var(--neu-subtle-text)] mb-8 max-w-md">Ushbu xona faqat siz va sherigingiz uchun ajratilgan. Darsni boshlash uchun quyidagi tugmani bosing.</p>
        <Button size="lg" onClick={() => setJoined(true)} className="bg-emerald-600 dark:bg-emerald-600 hover:bg-emerald-700 dark:hover:bg-emerald-700 text-white dark:text-white border-transparent px-8 h-12 text-lg rounded-full font-semibold">
          Kamerani yoqish va Qo&apos;shilish
        </Button>
      </div>
    )
  }

  // Mutlaqo bepul, ochiq kodli va reklamasiz MiroTalk P2P WebRTC
  const videoUrl = `https://p2p.mirotalk.com/join/${roomName}?name=${encodeURIComponent(userName)}`

  return (
    <div className="w-full h-full min-h-[500px] relative bg-black rounded-xl overflow-hidden">
      <iframe
        src={videoUrl}
        allow="camera; microphone; display-capture; autoplay; clipboard-write"
        className="w-full h-full min-h-[500px] border-0 absolute inset-0"
      />
    </div>
  )
}
