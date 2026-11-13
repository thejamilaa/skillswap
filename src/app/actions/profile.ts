'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { uploadToR2 } from '@/lib/r2'

export async function updateProfile(formData: FormData) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const fullName = formData.get('fullName') as string
  let username = formData.get('username') as string
  if (username && !username.startsWith('@')) {
    username = '@' + username
  }
  const bio = formData.get('bio') as string
  const avatarFile = formData.get('avatar') as File | null
  
  // JSON stringified arrays from hidden inputs
  const teachSkills = JSON.parse((formData.get('teachSkills') as string) || '[]')
  const learnSkills = JSON.parse((formData.get('learnSkills') as string) || '[]')

  let avatar_url = undefined

  // Agar rasm yuklangan bo'lsa, Cloudflare R2 (yoki fallback sifatida Supabase Storage)'ga saqlaymiz
  if (avatarFile && avatarFile.size > 0) {
    if (process.env.CLOUDFLARE_R2_ACCOUNT_ID) {
      const uploadResult = await uploadToR2(avatarFile, 'avatars')
      if (uploadResult.error) return { error: uploadResult.error }
      avatar_url = uploadResult.url
    } else {
      const fileExt = avatarFile.name.split('.').pop()
      const fileName = `${user.id}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, avatarFile)

      if (uploadError) return { error: 'Rasm yuklashda xatolik: ' + uploadError.message }

      const { data } = supabase.storage.from('avatars').getPublicUrl(fileName)
      avatar_url = data.publicUrl
    }
  }

  // Update profile basic info
  const updatePayload: any = { full_name: fullName, bio, username: username || null }
  if (avatar_url) updatePayload.avatar_url = avatar_url

  const { error: profileError } = await supabase
    .from('profiles')
    .update(updatePayload)
    .eq('id', user.id)

  if (profileError) return { error: profileError.message }

  // Update skills: easiest is to delete all existing and re-insert
  await supabase.from('user_skills').delete().eq('user_id', user.id)

  const newSkillsToInsert = [
    ...teachSkills.map((skillId: string) => ({ user_id: user.id, skill_id: skillId, type: 'teach' })),
    ...learnSkills.map((skillId: string) => ({ user_id: user.id, skill_id: skillId, type: 'learn' }))
  ]

  if (newSkillsToInsert.length > 0) {
    const { error: skillsError } = await supabase
      .from('user_skills')
      .insert(newSkillsToInsert)
      
    if (skillsError) return { error: skillsError.message }
  }

  revalidatePath('/profile')
  revalidatePath('/discover')
  return { success: true }
}

 export async function toggleAnonymousMode(isAnonymous: boolean) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  await supabase
    .from('profiles')
    .update({ is_anonymous: isAnonymous })
    .eq('id', user.id)

  revalidatePath('/profile')
  revalidatePath('/discover')
}