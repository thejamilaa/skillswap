import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { resetPassword } from "@/app/actions/auth"
import { SubmitButton } from "@/components/custom/submit-button"

export default function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: { message?: string }
}) {
  const isSuccess = searchParams.message?.includes("yuborildi");

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold tracking-tight">Parolni tiklash</CardTitle>
        <CardDescription>
          Elektron pochta manzilingizni kiriting va biz sizga parolni tiklash havolasini yuboramiz.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {searchParams?.message && (
          <div className={`p-3 text-sm text-white rounded-md ${isSuccess ? 'bg-green-500/80' : 'bg-red-500'}`}>
            {searchParams.message}
          </div>
        )}
        
        <form action={resetPassword} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Elektron pochta</Label>
            <Input id="email" name="email" type="email" placeholder="m@example.com" required />
          </div>
          <SubmitButton className="w-full">Havola yuborish</SubmitButton>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4 pt-4 border-t border-white/5">
        <div className="text-sm text-center text-slate-500 dark:text-gray-400">
          Esladingizmi?{" "}
          <Link href="/login" className="text-indigo-400 hover:text-indigo-300 hover:underline">
            Tizimga kirish
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}
