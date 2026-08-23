'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function endClass(swapId: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Iltimos tizimga kiring" }

  const { error } = await supabase.rpc('end_class_and_pay', {
    p_swap_id: swapId,
    p_user_id: user.id
  })

  if (error) return { error: "Xatolik yuz berdi: " + error.message }
  
  revalidatePath(`/swaps/${swapId}`)
  return { success: true }
}

export async function submitReview(formData: FormData) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Xatolik: Avtorizatsiya" }

  const swapId = formData.get('swapId') as string
  const revieweeId = formData.get('revieweeId') as string
  const rating = parseInt(formData.get('rating') as string)
  const comment = formData.get('comment') as string

  if (!rating || rating < 1 || rating > 5) return { error: "Baho 1-5 oralig'ida bo'lishi kerak" }

  // Check if review already exists
  const { data: existing } = await supabase
    .from('reviews')
    .select('id')
    .eq('swap_id', swapId)
    .eq('reviewer_id', user.id)
    .single()

  if (existing) {
    return { error: "Siz allaqachon baholagansiz!" }
  }

  const { error } = await supabase
    .from('reviews')
    .insert({
      swap_id: swapId,
      reviewer_id: user.id,
      reviewee_id: revieweeId,
      rating,
      comment
    })

  if (error) return { error: error.message }

  revalidatePath(`/swaps/${swapId}`)
  return { success: true }
}
