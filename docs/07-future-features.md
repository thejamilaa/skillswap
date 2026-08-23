# Kelajakda qo'shilishi kerak bo'lgan texnologiyalar va rejalar

Ushbu hujjat loyihaning MVP (Dastlabki versiyasi) ga kiritilmagan, ammo loyiha o'sishi bilan qo'shilishi kerak bo'lgan ilg'or xususiyatlarni saqlash uchun mo'ljallangan.

## 1. 100% Custom Video SDK (Daily.co)

Hozirgi MVP versiyasida dars xonasi bepul va reklamasiz MiroTalk Iframe orqali ishlaydi. Bu startapni tez va xarajatsiz ishga tushirish uchun qilingan. Ammo foydalanuvchilar soni oshgach, videoning har bir tugmasini o'zimiz chizishimiz (Custom UI) uchun WebRTC SDK ga o'tishimiz rejalashtirilgan.

### Nima uchun bekor qilindi?
Daily.co orqali maxsus (Custom) SDK xonasi yaratilganda, tizim `account-missing-payment-method` xatoligini berdi. Garchi xizmat har oy 10,000 daqiqa bepul bersa-da, botlar va firibgarlarning oldini olish maqsadida API orqali xona yaratish uchun hisobga bank kartasi ulangan bo'lishini talab qiladi. Shuning uchun MVP da vaqt yo'qotmaslik uchun Iframe'ga qaytildi.

### Qanday qilib qayta ulanadi?
Kelajakda shu tizimni qayta tiklash uchun amalga oshiriladigan qadamlar:

1. **Kutubxonalarni o'rnatish:**
   ```bash
   npm install @daily-co/daily-js @daily-co/daily-react
   ```

2. **API Kalitini kiritish:**
   `.env.local` fayliga Daily.co dan olingan kalit qo'shiladi:
   `DAILY_API_KEY="sizning_kalitingiz"`

3. **Backend API yozish (`src/app/actions/video.ts`):**
   ```typescript
   'use server'
   export async function getOrCreateDailyRoom(swapId: string) {
     const roomName = `swap_${swapId.replace(/-/g, '_')}`;
     const apiKey = process.env.DAILY_API_KEY;
     // Daily.co API orqali POST/GET so'rovlari yuborib xona manzili (url) olinadi.
   }
   ```

4. **React SDK orqali Custom UI chizish:**
   `@daily-co/daily-react` kutubxonasidan `DailyProvider`, `useCallObject`, `useLocalSessionId`, `useParticipantIds` kabi Hook'lar yordamida to'liq shaxsiy boshqaruv paneli (`<button onClick={toggleMic}>`) va video ekranlar (`useVideoTrack`) chizib chiqiladi.
