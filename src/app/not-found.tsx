import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { SearchX } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 text-center">
      <div className="bg-indigo-100 dark:bg-indigo-900/30 p-6 rounded-full mb-8">
        <SearchX size={64} className="text-indigo-600 dark:text-indigo-400" />
      </div>
      
      <h1 className="text-6xl font-black text-slate-900 dark:text-white tracking-tight mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200 mb-6">
        Sahifa topilmadi
      </h2>
      
      <p className="text-slate-500 dark:text-slate-400 max-w-md mb-8 text-lg">
        Siz qidirayotgan sahifa o'chirilgan, nomi o'zgargan yoki vaqtincha ishlamayapti. URL manzilni tekshirib ko'ring.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/discover">
          <Button size="lg" className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700">
            Bosh sahifaga qaytish
          </Button>
        </Link>
      </div>
    </div>
  )
}
