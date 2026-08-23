'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Star, ShieldAlert, Award, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

type Teacher = {
  id: string
  full_name: string
  avatar_url: string
  bio: string
  reputation_score: number
  teachSkills: { name: string, category: string }[]
  categories: string[]
  totalReviews: number
  avgRating: number
}

export function LeaderboardClient({ initialTeachers }: { initialTeachers: Teacher[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [sortBy, setSortBy] = useState<'rating' | 'reviews' | 'reputation'>('rating')

  // Barcha mavjud kategoriyalarni yig'ish
  const allCategories = ['All', ...Array.from(new Set(initialTeachers.flatMap(t => t.categories)))]

  // Filterlash va Saralash (Sort)
  const filteredAndSorted = initialTeachers
    .filter(t => selectedCategory === 'All' || t.categories.includes(selectedCategory))
    .sort((a, b) => {
      if (sortBy === 'rating') {
        if (b.avgRating === a.avgRating) return b.totalReviews - a.totalReviews // agar baho teng bo'lsa, sharhlar soni ko'pi oldinga
        return b.avgRating - a.avgRating
      }
      if (sortBy === 'reviews') return b.totalReviews - a.totalReviews
      if (sortBy === 'reputation') return b.reputation_score - a.reputation_score
      return 0
    })

  return (
    <div className="space-y-6">
      
      {/* Boshqaruv paneli (Filter va Sort) */}
      <div className="flex flex-col sm:flex-row gap-4 bg-[var(--neu-surface)] p-4 rounded-xl border border-[var(--neu-border)] items-center justify-between shadow-sm">
        
        {/* Kategoriyalar (Dropdown) */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <span className="text-sm font-medium text-[var(--neu-subtle-text)] hidden sm:inline-block">Yo'nalish:</span>
          <select 
            className="bg-[var(--neu-surface)] border border-[var(--neu-border)] text-[var(--neu-text)] text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 outline-none w-full sm:w-[200px]"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {allCategories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'All' ? 'Barcha Yo\'nalishlar' : cat}
              </option>
            ))}
          </select>
        </div>

        {/* Saralash (Select) */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[var(--neu-subtle-text)]">Saralash:</span>
          <select 
            className="bg-[var(--neu-surface)] border border-[var(--neu-border)] text-[var(--neu-text)] text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 outline-none"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
          >
            <option value="rating">Eng yuqori baho (Rating)</option>
            <option value="reviews">Eng ko'p dars o'tgan (Reviews)</option>
            <option value="reputation">Eng ishonchli (Reputation)</option>
          </select>
        </div>
      </div>

      {/* Reyting Ro'yxati */}
      <div className="flex flex-col gap-4">
        {filteredAndSorted.map((teacher, index) => (
          <Card key={teacher.id} className={`overflow-hidden transition-all ${index < 3 ? 'border-indigo-500/30 dark:border-indigo-400/30' : ''}`}>
            <CardContent className="p-0">
              <div className="flex flex-col sm:flex-row items-center sm:items-stretch">
                
                {/* O'rin / Rank (Top 3 gets special colors) */}
                <div className={`w-full sm:w-16 flex items-center justify-center p-4 sm:p-0 font-bold text-2xl border-b border-[var(--neu-border)] sm:border-b-0 sm:border-r ${
                  index === 0 ? 'bg-indigo-600 text-white' :
                  index === 1 ? 'bg-indigo-500 text-white' :
                  index === 2 ? 'bg-indigo-400 text-white' :
                  'bg-[var(--neu-muted)] text-[var(--neu-subtle-text)]'
                }`}>
                  #{index + 1}
                </div>

                {/* Profil ma'lumotlari */}
                <div className="flex-1 p-5 flex flex-col sm:flex-row gap-5 items-center sm:items-start">
                  <Avatar className="w-20 h-20 border border-[var(--neu-border)] shadow-sm">
                    <AvatarImage src={teacher.avatar_url} />
                    <AvatarFallback className="text-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">{teacher.full_name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 text-center sm:text-left space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-center sm:justify-start">
                      <Link href={`/profile/${teacher.id}`} className="font-bold text-xl hover:text-indigo-600 transition-colors">
                        {teacher.full_name}
                      </Link>
                      {index === 0 && <Badge className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 shadow-none border-none">Eng zo'r ustoz</Badge>}
                    </div>
                    
                    <p className="text-sm text-[var(--neu-subtle-text)] line-clamp-2">{teacher.bio || 'Ma\'lumot kiritilmagan'}</p>
                    
                    <div className="flex flex-wrap justify-center sm:justify-start gap-1.5 pt-1">
                      {teacher.teachSkills.map(s => (
                        <Badge key={s.name} variant="secondary" className="shadow-none">
                          {s.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Statistikalar (Rating, Reviews, Rep) */}
                <div className="w-full sm:w-48 bg-[var(--neu-muted)] p-5 flex flex-row sm:flex-col justify-around sm:justify-center border-t border-[var(--neu-border)] sm:border-t-0 sm:border-l">
                  <div className="flex items-center gap-2 mb-0 sm:mb-3">
                    <Star className="text-indigo-500 fill-indigo-500 dark:text-indigo-400 dark:fill-indigo-400" size={20} />
                    <span className="font-bold text-lg">{teacher.avgRating > 0 ? teacher.avgRating : 'N/A'}</span>
                    <span className="text-xs text-[var(--neu-subtle-text)]">({teacher.totalReviews})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="text-indigo-500 dark:text-indigo-400" size={18} />
                    <span className="font-medium text-sm text-[var(--neu-text)]">{teacher.reputation_score} ball</span>
                  </div>
                </div>

              </div>
            </CardContent>
          </Card>
        ))}

        {filteredAndSorted.length === 0 && (
          <div className="text-center p-12 bg-[var(--neu-surface)] rounded-xl border border-dashed border-[var(--neu-border)]">
            <Award className="mx-auto h-12 w-12 text-[var(--neu-subtle-text)] mb-3" />
            <h3 className="text-lg font-medium text-[var(--neu-text)]">Ustozlar topilmadi</h3>
            <p className="text-[var(--neu-subtle-text)] mt-1">Bu yo'nalishda hali hech kim dars o'tmagan.</p>
          </div>
        )}
      </div>

    </div>
  )
}
