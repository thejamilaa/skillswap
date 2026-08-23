import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MailOpen } from "lucide-react"
import { ResendButton } from "@/components/custom/resend-button"

export default function VerifyEmailPage({
  searchParams,
}: {
  searchParams: { email?: string }
}) {
  const email = searchParams.email || ""
  
  // Agar gmail bo'lsa, to'g'ridan-to'g'ri gmail ilovasiga yo'naltiramiz
  const isGmail = email.endsWith('@gmail.com')
  const mailLink = isGmail ? "https://mail.google.com" : "mailto:"

  return (
    <Card className="w-full text-center">
      <CardHeader className="space-y-4">
        <div className="mx-auto bg-indigo-100 dark:bg-indigo-900/30 p-4 rounded-full w-16 h-16 flex items-center justify-center">
          <MailOpen className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">Pochtani tasdiqlang</CardTitle>
        <CardDescription>
          Biz tasdiqlash havolasini quyidagi manzilga yubordik:<br/>
          <span className="font-semibold text-slate-900 dark:text-slate-100">{email}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-slate-500 mb-6">
          Iltimos, elektron pochtangizni tekshiring va yuborilgan havolaga bosing. Havolaga bosganingizdan so'ng hisobingiz faollashadi.
        </p>
        <div className="space-y-3">
          <Button asChild className="w-full bg-indigo-600 hover:bg-indigo-700">
            <a href={mailLink} target="_blank" rel="noopener noreferrer">
              {isGmail ? 'Gmail\'ni ochish' : 'Pochtani ochish'}
            </a>
          </Button>
          <ResendButton email={email} />
        </div>
      </CardContent>
      <CardFooter className="justify-center">
        <div className="text-sm text-slate-500">
          Tasdiqlab bo'ldingizmi?{" "}
          <Link href="/login" className="text-indigo-600 hover:underline">
            Tizimga kirish
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}
