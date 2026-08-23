# SkillSwap — Design Audit
> Maqsad: Minimalist, aniq, sodda va enterprise-darajadagi UI/UX
> Standart: Linear.app, Vercel, Supabase, Notion kabi top platformalar

---

## 09 — Design Token (Ranglar tizimi) tartibsiz

**Sahifa:** Butun loyiha  
**Muammo:**  
- `--neu-bg`, `--neu-text`, `--neu-border` — 3 ta token yetarli emas. Saytda hamma joyda qo'shimcha inline ranglar (`bg-slate-50`, `bg-white`, `dark:bg-slate-950`, `#1e1e1e`) aralashib ketgan.  
- Dark: `#0a0a0a` juda absolut qora. Top platformalar `#09090b` yoki `#111111` ishlatadi.  
- Light: `#f8fafc` — yaxshi tanlov, saqlab qolsa bo'ladi.

**Yechim:** CSS tokenlar to'plamini kengaytirish: `--color-surface`, `--color-surface-raised`, `--color-muted`, `--color-subtle`.

---

## 10 — Border qalinligi (`border-2`) noqulay

**Sahifa:** Discover, Landing page feature cards  
**Muammo:**  
- `border-2` (2px) enterprise UI lar uchun qalin. Professional UI da `border` (1px) + to'qroq rang ishlatiladi.  
- `#64748b` (slate-500) + `border-2` kombinatsiyasi juda "qo'pol" ko'rinadi.  
- Dark mode da `rgba(255,255,255,0.1)` + `border-2` — oq rang yupqa, `border-2` sezilmaydi.

**Yechim:** `border` (1px) + `--neu-border: #cbd5e1` (slate-300) light mode uchun.

---

## 11 — Landing page sarlavha rangi Light mode da noto'g'ri

**Sahifa:** `/` (Landing page)  
**Muammo:**  
- `<h1>` da `text-gray-100` hardcoded — light mode da oq fon ustida deyarli ko'rinmaydi.  
- `<h3>` larda `text-gray-200` hardcoded — xuddi shu muammo.  
- `text-gray-400` paragraflar — light mode da kontrast past, WCAG standartini o'tmaydi.

**Yechim:** `text-[var(--neu-text)]` va `text-slate-500 dark:text-gray-400` formatiga o'tkazish.

---

## 12 — Landing page navigatsiyasida "Kirish" tugmasi yo'q

**Sahifa:** `/` (Landing page)  
**Muammo:**  
- Header da faqat "Ro'yxatdan o'tish" tugmasi bor. "Kirish" tugmasi yo'q.  
- Mavjud foydalanuvchi saytga kirib "Kirish" ni topa olmaydi — bu jiddiy UX xatosi.

**Yechim:** Header ga ikkita tugma: "Kirish" (ghost) va "Ro'yxatdan o'tish" (primary).

---

## 13 — Landing page Hero section CTA tugmalari vizual iyerarxiyasiz

**Sahifa:** `/` (Landing page), Hero section  
**Muammo:**  
- "Hoziroq boshlash" va "Platformani ko'rish" — ikkalasi bir xil uslubda. Foydalanuvchi qaysi tugma muhimroq ekanini bilmaydi.  
- UX qoidasi: Primary CTA — to'liq rang, Secondary CTA — chegarali yoki ghost.

**Yechim:** "Hoziroq boshlash" → `bg-indigo-600 text-white`. "Platformani ko'rish" → ghost/outline.

---

## 14 — Landing page Feature Cards global Card komponenti bilan mos emas

**Sahifa:** `/` (Landing page), 3 ta feature card  
**Muammo:**  
- Bu cardlar `<div>` bilan yozilgan, `<Card>` komponenti ishlatilmagan.  
- `rounded-3xl` — Dashboard da `rounded-2xl`. Bir saytda ikki xil radius.  
- Icon wrapper da `shadow-inner` — eski Neumorphism qoldig'i.

**Yechim:** `<Card>` ga o'tkazish, `rounded-2xl` birlashtirish, icon uchun `bg-indigo-50 dark:bg-indigo-950/50`.

---

## 15 — Dashboard Header logotipi hajmi ortiqcha

**Sahifa:** Dashboard layout (barcha dashboard sahifalari)  
**Muammo:**  
- Logo: `width={84} height={84}` — header uchun juda katta. Header `py-2` bilan kichraytirilgan lekin 84px logo uni kengaytirib yuboradi.  
- Enterprise UI da logo 32–40px balandlikda bo'ladi.

**Yechim:** `width={40} height={40}` ga tushirish.

---

## 16 — Dashboard Header kredit badgelari murakkab

**Sahifa:** Dashboard layout  
**Muammo:**  
- Snowflake badge faqat `frozenCredits > 0` da paydo bo'ladi — element "birdaniga paydo bo'lib qoladi", bu UX da layout shift muammosi.  
- `shadow-sm` hali ham qolgan.  
- `title` tooltip mobil da ko'rinmaydi.

**Yechim:** Ikkala badge ni har doim ko'rsatish (0 bo'lsa ham). `shadow-sm` olib tashlash.

---

## 17 — Discover page: Skill indicator dots

**Sahifa:** `/discover`  
**Muammo:**  
- `shadow-[0_0_10px_rgba(99,102,241,0.5)]` glow effekti qolgan — flat dizayn konsepsiyasiga zid.  
- Avatar `border` (1px) — Card `border-2` bilan mos emas.

**Yechim:** Glow olib tashlash. Avatar border ni Card bilan birlashtirish.

---

## 18 — Discover page: CardFooter background xira

**Sahifa:** `/discover`  
**Muammo:**  
- `bg-[var(--neu-bg)]/50` — 50% shaffoflik light mode da noaniq "xiralik" effekti beradi.

**Yechim:** `bg-[var(--neu-bg)]/50` olib tashlab, faqat `border-t border-[var(--neu-border)]` qoldirish.

---

## 19 — Swaps page: Butun sahifa dizayn tizimidan tashqarida

**Sahifa:** `/swaps`  
**Muammo:**  
- `bg-white dark:bg-slate-950`, `bg-slate-50`, `border-dashed`, `bg-emerald-50 dark:bg-emerald-900/20` — bular boshqa sahifalar bilan mos kelmaydi.  
- `shadow-md` soyalar qolgan.  
- `animate-pulse` "Faol" badge da — professional UI da animatsiya faqat loading uchun.  
- `h-2 bg-gradient-to-r from-indigo-500 to-purple-500` gradient accent — boshqa sahifada uchramaydi, uslub to'satdan o'zgaradi.  
- `Gem` va `Video` import qilinmagan (runtime xato mumkin).

**Yechim:** Butun sahifani `--neu-*` tokenlariga o'tkazish. Gradient va pulse olib tashlash. Import qo'shish.

---

## 20 — Leaderboard page: Butun sahifa dizayn tizimidan tashqarida

**Sahifa:** `/leaderboard`  
**Muammo:**  
- Filter panel: `bg-white dark:bg-slate-950` — token ishlatilmagan.  
- Filter tugmalar: `bg-slate-100 dark:bg-slate-800` — hardcoded.  
- `<select>` element Input komponenti bilan uslubda farqli.  
- Rank ustun: amber, slate, orange — uchta boshqa rang, saytning indigo palitrasi bilan uyg'un emas.  
- Avatar: `border-2 border-white` — dark mode da qalqib ko'rinadi.  
- `hover:shadow-md` — shadow qolgan.  
- "Eng zo'r ustoz 👑" — emoji, Lucide icon emas.

**Yechim:** Butun sahifani token ga o'tkazish. Rank uchun indigo palitrasi. `Crown` ikoni Lucide dan.

---

## 21 — Auth sahifalar: Separator chizig'i ko'rinmaydi

**Sahifa:** `/login`, `/register`  
**Muammo:**  
- `border-t border-white/10` — `white/10` faqat dark mode uchun ishlaydi. Light mode da oq fon ustida ko'rinmaydi.

**Yechim:** `border-[var(--neu-border)]` ga o'zgartirish.

---

## 22 — Auth sahifalar: CardFooter border

**Sahifa:** `/login`, `/register`  
**Muammo:**  
- `border-t border-white/5` — eski dark mode qoldig'i. Light mode da ko'rinmaydi.

**Yechim:** `border-t border-[var(--neu-border)]` ga o'zgartirish.

---

## 23 — Auth sahifalar: Asosiy tugma (Primary action) ko'zga tashlanmaydi

**Sahifa:** `/login`, `/register`  
**Muammo:**  
- "Kirish" va "Ro'yxatdan o'tish" submit tugmalari `default` variant — `bg-[var(--neu-bg)] text-indigo-500`. Bu secondary ko'rinish.  
- Login ning primary action bu "Kirish" — u aniq, to'q, birinchi darajali bo'lishi kerak.

**Yechim:** Submit tugmalarga `bg-indigo-600 hover:bg-indigo-700 text-white` qo'llash.

---

## 24 — Navigatsiya: Mobil responsive holat noaniq

**Sahifa:** Dashboard layout  
**Muammo:**  
- Kichik ekranda header `flex-col` bo'lib juda baland bo'ladi.  
- Kredit badgelari `hidden sm:flex` — mobil foydalanuvchi kreditini ko'ra olmaydi.  
- Mobil uchun alohida navigatsiya yechimi yo'q.

**Yechim:** Mobil uchun sticky bottom navigation yoki hamburger menu.

---

## 25 — Typography (Yozuv uslubi) bir xil emas

**Sahifa:** Butun loyiha  
**Muammo:**  
- Sarlavhalar: `text-3xl font-bold`, `text-4xl font-extrabold`, `text-2xl font-semibold` — har sahifada har xil.  
- Subtitle lar: `text-slate-500`, `text-gray-400`, `text-muted-foreground` — bir xil elementlar uchun 3 xil class.

**Yechim — Typography Scale:**
```
Page title:    text-2xl font-bold tracking-tight
Page subtitle: text-sm text-slate-500 dark:text-gray-400
Section title: text-lg font-semibold
Body:          text-sm text-[var(--neu-text)]
Muted:         text-sm text-slate-500 dark:text-gray-400
```

---

## 26 — `transition-colors` barcha elementlarda performance muammosi

**Sahifa:** Butun loyiha  
**Muammo:**  
- `* { transition-colors duration-300 }` — universal selector bilan barcha elementga transition qo'yilgan. Bu browser uchun juda og'ir: har bir element har bir rang o'zgarishida animatsiya hisoblaydi.  
- Bu ayniqsa ro'yxat elementlari ko'p bo'lganda (Discover, Leaderboard) sezilarli sekinlashuvga olib keladi.

**Yechim:** `*` dan olib tashlash. Faqat kerakli elementlarga (`body`, `Card`, `Button`, `Input`) qo'llash.

---

*Hujjat yaratildi: 2026-08-23 | Muammolar soni: 18 ta (09–26)*
