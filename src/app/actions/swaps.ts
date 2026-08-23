'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createSwapRequest(formData: FormData) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Iltimos tizimga kiring" }

  const receiverId = formData.get('receiverId') as string
  const requestedSkillId = formData.get('requestedSkillId') as string
  const message = formData.get('message') as string

  if (!requestedSkillId) {
    return { error: "Fanni tanlash majburiy!" }
  }

  // RPC funksiyani chaqirish orqali atomik operatsiyani bajaramiz (Race condition'ning oldini oladi)
  const { data, error: rpcError } = await supabase.rpc('create_swap_request_atomic', {
    p_sender_id: user.id,
    p_receiver_id: receiverId,
    p_requested_skill_id: requestedSkillId,
    p_message: message
  })

  if (rpcError) {
    return { error: "Xatolik yuz berdi: " + rpcError.message }
  }

  // Postgres JSONB qaytaradi, uni tahlil qilamiz
  if (data && data.error) {
    return { error: data.error }
  }

  revalidatePath('/discover')
  revalidatePath('/swaps')
  return { success: true }
}

export async function acceptSwap(swapId: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Iltimos tizimga kiring" }

  const { data: swap } = await supabase
    .from('swap_requests')
    .select('id, receiver_id, status')
    .eq('id', swapId)
    .single()

  if (!swap || swap.receiver_id !== user.id || swap.status !== 'pending') {
    return { error: "So'rovni qabul qilib bo'lmaydi" }
  }

  const { error: updateError } = await supabase.from('swap_requests').update({ status: 'accepted' }).eq('id', swapId)
  if (updateError) return { error: "Holatni yangilashda xatolik: " + updateError.message }

  revalidatePath('/swaps')
  return { success: true }
}

export async function declineSwap(swapId: string, senderId: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Iltimos tizimga kiring" }

  const { data: swap } = await supabase
    .from('swap_requests')
    .select('id, receiver_id, status, credits_frozen')
    .eq('id', swapId)
    .single()

  if (!swap || swap.receiver_id !== user.id || swap.status !== 'pending') {
    return { error: "Xatolik" }
  }

  const { error: rpcError } = await supabase.rpc('decline_swap_and_refund', {
    p_swap_id: swapId,
    p_sender_id: senderId,
    p_receiver_id: user.id
  })

  if (rpcError) {
    return { error: "Rad etishda xatolik: " + rpcError.message }
  }

  revalidatePath('/swaps')
  return { success: true }
}
