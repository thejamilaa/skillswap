'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

import { headers } from 'next/headers'

const getSiteUrl = () => {
  // NEXT_PUBLIC_SITE_URL must be set in Vercel environment variables
  // For local dev: http://localhost:3000
  // For production: https://skillswap-jamila.vercel.app
  return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
}

export async function login(formData: FormData) {
  const supabase = createClient()
  
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return redirect(`/login?message=${error.message}`)
  }

  revalidatePath('/', 'layout')
  redirect('/discover')
}

export async function signup(formData: FormData) {
  const supabase = createClient()
  
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('fullName') as string
  const username = formData.get('username') as string

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        username: username,
      },
      emailRedirectTo: `${getSiteUrl()}/auth/callback`,
    },
  })

  if (error) {
    return redirect(`/register?message=${error.message}`)
  }

  // Pochtani tasdiqlash sahifasiga yo'naltiramiz
  redirect(`/verify-email?email=${encodeURIComponent(email)}`)
}

export async function loginWithPhone(formData: FormData) {
  const supabase = createClient()
  
  const phone = formData.get('phone') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    phone: phone.replace(/[^0-9+]/g, ''),
    password,
  })

  if (error) {
    return redirect(`/login?message=${error.message}&method=phone`)
  }

  revalidatePath('/', 'layout')
  redirect('/discover')
}

export async function signupWithPhone(formData: FormData) {
  const supabase = createClient()
  
  const phone = formData.get('phone') as string
  const password = formData.get('password') as string
  const fullName = formData.get('fullName') as string
  const username = formData.get('username') as string

  const cleanPhone = phone.replace(/[^0-9+]/g, '');
  const { error } = await supabase.auth.signUp({
    phone: cleanPhone,
    password,
    options: {
      data: {
        full_name: fullName,
        username: username,
      }
    },
  })

  if (error) {
    return redirect(`/register?message=${error.message}&method=phone`)
  }

  return redirect(`/login?message=Muvaffaqiyatli ro'yxatdan o'tdingiz. Tizimga kirishingiz mumkin.&method=phone`)
}

export async function signInWithGoogle() {
  const supabase = createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${getSiteUrl()}/auth/callback`,
    },
  })

  if (data.url) {
    redirect(data.url)
  }
}

export async function signInWithGithub() {
  const supabase = createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: `${getSiteUrl()}/auth/callback`,
    },
  })

  if (error) {
    return redirect(`/login?message=${error.message}`)
  }

  if (data?.url) {
    redirect(data.url)
  }
}

export async function logout() {
  const supabase = createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export async function resendVerificationEmail(email: string) {
  const supabase = createClient()
  
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email,
    options: {
      emailRedirectTo: `${getSiteUrl()}/auth/callback`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function resetPassword(formData: FormData) {
  const supabase = createClient()
  
  const email = formData.get('email') as string

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${getSiteUrl()}/auth/callback?next=/update-password`,
  })

  if (error) {
    return redirect(`/forgot-password?message=${error.message}`)
  }

  redirect(`/forgot-password?message=Parolni tiklash havolasi elektron pochtangizga yuborildi. Pochtani tekshiring.`)
}

export async function updatePassword(formData: FormData) {
  const supabase = createClient()
  
  const password = formData.get('password') as string

  const { error } = await supabase.auth.updateUser({
    password,
  })

  if (error) {
    return redirect(`/update-password?message=${error.message}`)
  }

  redirect(`/login?message=Parolingiz muvaffaqiyatli yangilandi. Yangi parol bilan kiring.`)
}
