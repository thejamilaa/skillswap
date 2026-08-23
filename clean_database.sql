-- SkillSwap - Baza tozalash skripti (Loyiha topshirishdan oldin)
-- DIQQAT: Bu skript faqat test ma'lumotlarini (akkauntlar, so'rovlar, sharhlar) o'chiradi. 
-- Asosiy fanlar (skills) ro'yxati saqlanib qoladi!

-- 1. Tranzaksiyalarni (sharhlar, so'rovlar, foydalanuvchi skillari) tozalash
TRUNCATE TABLE public.swap_requests CASCADE;
TRUNCATE TABLE public.reviews CASCADE;
TRUNCATE TABLE public.user_skills CASCADE;
TRUNCATE TABLE public.profiles CASCADE;

-- 2. Authentication (Ro'yxatdan o'tgan test foydalanuvchilarni) tozalash
DELETE FROM auth.users;

-- BAZA TOZALANDI! Yop-yangi holatga qaytdi.
