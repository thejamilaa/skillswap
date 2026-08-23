import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { updatePassword } from "@/app/actions/auth"
import { SubmitButton } from "@/components/custom/submit-button"
import { PasswordInput } from "@/components/custom/password-input"

export default function UpdatePasswordPage({
  searchParams,
}: {
  searchParams: { message?: string }
}) {
  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold tracking-tight">Yangi parol o'rnatish</CardTitle>
        <CardDescription>
          Iltimos, hisobingiz uchun yangi parolni kiriting.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {searchParams?.message && (
          <div className="p-3 text-sm text-white bg-red-500 rounded-md">
            {searchParams.message}
          </div>
        )}
        
        <form action={updatePassword} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Yangi parol</Label>
            <PasswordInput id="password" name="password" required />
          </div>
          <SubmitButton className="w-full">Parolni yangilash</SubmitButton>
        </form>
      </CardContent>
    </Card>
  )
}
