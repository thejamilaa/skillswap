'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export function ChatRoom({ swapId, currentUser, partner }: { swapId: string, currentUser: any, partner: any }) {
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const supabase = createClient()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // 1. Dastlabki xabarlarni yuklash
    const fetchMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('swap_id', swapId)
        .order('created_at', { ascending: true })
      if (data) setMessages(data)
    }
    fetchMessages()

    // 2. Realtime qabul qilish (Yangi xabar kelganda ushlab olish)
    const channel = supabase.channel(`swap_${swapId}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `swap_id=eq.${swapId}`
      }, (payload) => {
        setMessages(prev => {
          // O'zimiz jo'natgan optimistik xabar bilan takrorlanmasligi uchun tekshiramiz
          if (prev.some(m => m.id === payload.new.id || (m.content === payload.new.content && m.sender_id === payload.new.sender_id && new Date(payload.new.created_at).getTime() - new Date(m.created_at).getTime() < 5000))) {
            return prev
          }
          return [...prev, payload.new]
        })
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [swapId, supabase])

  // Yangi xabar kelsa avtomatik pastga tushirish
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const txt = newMessage
    setNewMessage('') // Jo'natilganda Inputni tozalash
    
    // 1. Optimistik UI: Serverni kutmasdan darhol ekranga chiqaramiz
    const optimisticMsg = {
      id: Math.random().toString(),
      swap_id: swapId,
      sender_id: currentUser.id,
      content: txt,
      created_at: new Date().toISOString()
    }
    setMessages(prev => [...prev, optimisticMsg])

    // 2. Serverga jo'natamiz
    await supabase.from('messages').insert({
      swap_id: swapId,
      sender_id: currentUser.id,
      content: txt
    })
  }

  return (
    <div className="flex flex-col h-full bg-[var(--neu-surface)]">
      {/* Header */}
      <div className="p-4 border-b border-[var(--neu-border)] flex items-center justify-between bg-[var(--neu-muted)]">
        <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-[var(--neu-border)] shadow-sm">
            <AvatarImage src={partner.avatar_url} />
            <AvatarFallback>{partner.full_name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
            <h3 className="font-semibold text-sm text-[var(--neu-text)]">{partner.full_name}</h3>
            <p className="text-xs text-emerald-500 dark:text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span> Jonli Chat
            </p>
            </div>
        </div>
      </div>

      {/* Messages List */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[var(--neu-bg)]">
        {messages.length === 0 && (
            <div className="h-full flex items-center justify-center text-[var(--neu-subtle-text)] text-sm text-center">
                Hozircha xabarlar yo'q.<br/>Birinchi bo'lib salom yo'llang!
            </div>
        )}
        {messages.map((msg, idx) => {
          const isMe = msg.sender_id === currentUser.id
          return (
            <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm shadow-sm ${isMe ? 'bg-indigo-600 dark:bg-indigo-600 text-white dark:text-white rounded-br-sm' : 'bg-[var(--neu-surface)] border border-[var(--neu-border)] rounded-bl-sm text-[var(--neu-text)]'}`}>
                {msg.content}
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={sendMessage} className="p-3 border-t border-[var(--neu-border)] bg-[var(--neu-surface)] flex gap-2 items-center">
        <Input 
          value={newMessage} 
          onChange={e => setNewMessage(e.target.value)}
          placeholder="Xabar yozing..." 
          className="flex-1 rounded-full h-10 bg-[var(--neu-bg)] border-[var(--neu-border)] text-[var(--neu-text)] focus-visible:ring-indigo-500"
          autoComplete="off"
        />
        <Button type="submit" size="icon" className="rounded-full h-10 w-10 bg-indigo-600 dark:bg-indigo-600 hover:bg-indigo-700 dark:hover:bg-indigo-700 text-white dark:text-white border-transparent shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
        </Button>
      </form>
    </div>
  )
}
