# SkillSwap MVP — Kod Auditi: Topilgan Kamchiliklar

> Sana: 2026-08-22  
> Holat: Faqat aniqlash. Hech narsa o'zgartirish SHART EMAS.

---

## 🔴 KRITIK XATOLAR (3 ta)

---

### 1. `declineSwap` — Kredit qaytarilmaydi (Silent Failure)
**Fayl:** `src/app/actions/swaps.ts` — 107–118 qatorlar

Ustoz so'rovni rad etganda, o'quvchining muzlatilgan 1 ta krediti qaytarilmaydi. Sababi RLS qoidasi receiver tomonidan sender ning profilini yangilashga ruxsat bermaydi. Kod o'zi ham biladi (`console.error` orqali jim o'tadi), lekin foydalanuvchi kreditini yo'qotib qoladi.

**Yechim yo'li:** Supabase SQL Editorda `SECURITY DEFINER` belgili PostgreSQL funksiyasi yaratish — u RLS dan yuqorida ishlaydi va kreditni to'g'ri qaytaradi.

---

### 2. `createSwapRequest` — Race Condition
**Fayl:** `src/app/actions/swaps.ts` — 20–54 qatorlar

Kredit tekshiruvi va yechish 2 alohida SQL so'rovda. Foydalanuvchi bir vaqtda ikkita oynadan so'rov yuborse, ikkisi ham bir xil kredit qoldig'ini o'qib muvaffaqiyatli bajarilishi mumkin. Natijada 1 ta kreditda 2 ta so'rov yuboriladi.

**Yechim yo'li:** `UPDATE profiles SET credits = credits - 1 WHERE id = ? AND credits >= 1` — bitta atomik so'rov.

---

### 3. `middleware.ts` — `/leaderboard` himoyasiz
**Fayl:** `src/middleware.ts` — 9-qator

`isDashboardRoute` da faqat `/discover`, `/swaps`, `/profile` bor. `/leaderboard` qo'shilmagan. Tizimga kirmasdan ham reyting sahifasini ochish mumkin.

---

## 🟠 O'RTA DARAJALI MUAMMOLAR (5 ta)

---

### 4. `endClass` — Kredit qaytarish mantiqsiz
**Fayl:** `src/app/actions/reviews.ts` — 5–20 qatorlar

Darsni o'quvchi erta tugatsa, uning to'lagan krediti qaytarilmaydi. `endClass` faqat statusni `completed` ga o'tkazadi, kredit hisobi yo'q.

---

### 5. `swaps/page.tsx` — Tarix (History) yo'q
**Fayl:** `src/app/(dashboard)/swaps/page.tsx` — 32-qator

`completed` va `declined` statusdagi swaplar sahifada hech qayerda ko'rsatilmaydi. Foydalanuvchi o'tgan darslarini ko'ra olmaydi.

---

### 6. `chat-room.tsx` — Xabar duplikatsiyasi xavfi
**Fayl:** `src/components/custom/chat-room.tsx` — 35–42 qatorlar

Optimistik UI xabarini realtime bilan moslashtirish 5 soniya ichida bir xil matnli 2 ta xabar yuborilsa noto'g'ri ishlaydi — ikkinchi xabar bloklanib qoladi. Katta chatlarda `prev.some()` ishlash muammosi (performance) ham bor.

---

### 7. `video-room.tsx` — Mobilda iframe ko'rinmasligi
**Fayl:** `src/components/custom/video-room.tsx` — 27–33 qatorlar

`iframe` dagi `h-full` ota element balandligiga bog'liq. `min-height` yo'qligi sababli ba'zi mobil qurilmalarda iframe balandligi 0 px ga tushib qolishi mumkin.

---

### 8. `discover/page.tsx` — Takroriy so'rov yuborish
**Fayl:** `src/app/(dashboard)/discover/page.tsx`

Bir kishiga allaqachon `pending` so'rov yuborilgan bo'lsa ham, "Almashuv so'rash" tugmasi aktiv ko'rinadi. Natijada bitta odamga bir nechta so'rov yuborib bo'ladi.

---

## 🟡 MAYDA KAMCHILIKLAR (9 ta)

---

### 9. Chat — "Online" doim yashil
**Fayl:** `src/components/custom/chat-room.tsx` — 91–93 qatorlar

Sherik offline bo'lsa ham "🟢 Online" ko'rsatiladi. Haqiqiy holat uchun Supabase `presence` kerak.

---

### 10. `swap-action-buttons.tsx` — `alert()` ishlatilgan
**Fayl:** `src/components/custom/swap-action-buttons.tsx` — 17, 29 qatorlar

Xato chiqganda brauzerning eski `alert()` oynasi ishlatilgan. Professional ko'rinish uchun `toast` yoki inline xabar kerak.

---

### 11. `end-class-button.tsx` — `confirm()` ishlatilgan
**Fayl:** `src/components/custom/end-class-button.tsx` — 8-qator

"Darsni yakunlash" tasdiqlovi uchun brauzerning eski `confirm()` oynasi ishlatilgan. O'rniga `Dialog` modal kerak.

---

### 12. Leaderboard — Profil havolasi bo'sh sahifaga olib boradi
**Fayl:** `src/app/(dashboard)/leaderboard/leaderboard-client.tsx` — 88-qator

`/profile/${teacher.id}` havolasi bosilganda 404 xatosi chiqadi. Chunki `/profile/[id]` dinamik sahifasi yaratilmagan, faqat `/profile` (o'z profil) bor.

---

### 13. `profile/page.tsx` — `avatar_url` yuklanmaydi
**Fayl:** `src/app/(dashboard)/profile/page.tsx` — 12–15 qatorlar

Profil so'rovida `avatar_url` so'ralmagan. Foydalanuvchi profilida o'z rasmini ko'ra va o'zgartira olmaydi.

---

### 14. `auth.ts` — GitHub xatosi ko'rsatilmaydi
**Fayl:** `src/app/actions/auth.ts` — 68–79 qatorlar

`signInWithGithub` da `error` o'zgaruvchisi yaratilgan lekin ishlatilmagan. GitHub OAuth xato bersa, foydalanuvchiga hech narsa ko'rsatilmaydi.

---

### 15. `discover/page.tsx` — Keraksiz maydonlar yuklanadi
**Fayl:** `src/app/(dashboard)/discover/page.tsx` — 17–26 qatorlar

`credits` va `reputation_score` maydonlari yuklanadi, lekin kartada ko'rsatilmaydi. Keraksiz ma'lumot — kichik ishlash (performance) muammosi.

---

### 16. Mobil menyusi yo'q
**Fayl:** `src/app/(dashboard)/layout.tsx` — 33-qator

Nav da `hidden md:flex` — mobil qurilmalarda navigatsiya ko'rinmaydi. "Hamburger menu" yoki pastki navigatsiya yo'q. Mobil foydalanuvchilar sahifalar o'rtasida o'ta olmaydi.

---

### 17. `swaps/[id]/page.tsx` — `partner` null crash
**Fayl:** `src/app/(dashboard)/swaps/[id]/page.tsx` — 47–48, 74–75 qatorlar

Agar sender yoki receiver profili o'chirilgan bo'lsa, `partner` null bo'ladi. 74-qatorda `partner.id`, 75-qatorda `partner.full_name` null tekshiruvsiz ishlatilgan — sahifa crash bo'lib ketishi mumkin.

---

## ✅ XULOSA

| Daraja | Soni |
|---|---|
| 🔴 Kritik (Ishga ta'sir qiladi) | 3 ta |
| 🟠 O'rta (UX va Mantiq xatolari) | 5 ta |
| 🟡 Mayda (Kod sifati va UX) | 9 ta |
| **Jami** | **17 ta** |
