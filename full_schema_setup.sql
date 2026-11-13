-- ==============================================================================
-- SKILLSWAP - SUPABASE TO'LIQ MA'LUMOTLAR BAZASI STRUKTURASI VA SOZLAMALARI
-- Ushbu skript Supabase Dashboard avto-RLS injeksiyalariga to'liq moslashtirilgan.
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. ENUM TURLARINI YARATISH
-- ==============================================================================
DO $body$ BEGIN
    CREATE TYPE skill_type AS ENUM ('teach', 'learn');
EXCEPTION
    WHEN duplicate_object THEN null;
END $body$;

DO $body$ BEGIN
    CREATE TYPE swap_status AS ENUM ('pending', 'accepted', 'active', 'completed', 'declined', 'ghosted');
EXCEPTION
    WHEN duplicate_object THEN null;
END $body$;

-- ==============================================================================
-- 3. JADVALLARNI YARATISH
-- ==============================================================================

-- 3.1. PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    username TEXT UNIQUE,
    avatar_url TEXT,
    bio TEXT,
    resume_text TEXT,
    credits INTEGER DEFAULT 1,
    reputation_score INTEGER DEFAULT 100,
    is_anonymous BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.2. SKILLS
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.3. USER_SKILLS
CREATE TABLE IF NOT EXISTS public.user_skills (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    skill_id UUID REFERENCES public.skills(id) ON DELETE CASCADE,
    type skill_type NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT user_skills_user_id_skill_id_type_key UNIQUE(user_id, skill_id, type)
);

-- 3.4. SWAP_REQUESTS
CREATE TABLE IF NOT EXISTS public.swap_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sender_id UUID NOT NULL,
    receiver_id UUID NOT NULL,
    requested_skill_id UUID,
    status swap_status DEFAULT 'pending',
    message TEXT,
    credits_frozen INTEGER DEFAULT 1,
    ai_lesson_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT swap_requests_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
    CONSTRAINT swap_requests_receiver_id_fkey FOREIGN KEY (receiver_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
    CONSTRAINT swap_requests_requested_skill_id_fkey FOREIGN KEY (requested_skill_id) REFERENCES public.skills(id) ON DELETE SET NULL
);

-- 3.5. MESSAGES
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    swap_id UUID NOT NULL,
    sender_id UUID NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT messages_swap_id_fkey FOREIGN KEY (swap_id) REFERENCES public.swap_requests(id) ON DELETE CASCADE,
    CONSTRAINT messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.profiles(id) ON DELETE CASCADE
);

-- 3.6. REVIEWS
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    swap_id UUID NOT NULL,
    reviewer_id UUID NOT NULL,
    reviewee_id UUID NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT reviews_swap_id_fkey FOREIGN KEY (swap_id) REFERENCES public.swap_requests(id) ON DELETE CASCADE,
    CONSTRAINT reviews_reviewer_id_fkey FOREIGN KEY (reviewer_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
    CONSTRAINT reviews_reviewee_id_fkey FOREIGN KEY (reviewee_id) REFERENCES public.profiles(id) ON DELETE CASCADE
);

-- ==============================================================================
-- 4. REALTIME YOQISH
-- ==============================================================================
DO $body$ BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
EXCEPTION
    WHEN duplicate_object THEN null;
END $body$;

-- ==============================================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.swap_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Eski siyosatlarni tozalash
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile." ON public.profiles;

DROP POLICY IF EXISTS "Skills are publicly viewable." ON public.skills;
DROP POLICY IF EXISTS "Authenticated users can insert skills." ON public.skills;

DROP POLICY IF EXISTS "User skills are publicly viewable." ON public.user_skills;
DROP POLICY IF EXISTS "Users can insert own skills." ON public.user_skills;
DROP POLICY IF EXISTS "Users can update own skills." ON public.user_skills;
DROP POLICY IF EXISTS "Users can delete own skills." ON public.user_skills;

DROP POLICY IF EXISTS "Users can view own swaps." ON public.swap_requests;
DROP POLICY IF EXISTS "Users can insert swaps." ON public.swap_requests;
DROP POLICY IF EXISTS "Users can update own swaps." ON public.swap_requests;

DROP POLICY IF EXISTS "Users can view messages of their swaps." ON public.messages;
DROP POLICY IF EXISTS "Users can insert messages to their swaps." ON public.messages;

DROP POLICY IF EXISTS "Reviews are viewable by everyone." ON public.reviews;
DROP POLICY IF EXISTS "Users can insert reviews." ON public.reviews;
DROP POLICY IF EXISTS "Users can update own reviews." ON public.reviews;

-- PROFILES
CREATE POLICY "Public profiles are viewable by everyone."
ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert own profile."
ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile."
ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- SKILLS
CREATE POLICY "Skills are publicly viewable."
ON public.skills FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert skills."
ON public.skills FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- USER_SKILLS
CREATE POLICY "User skills are publicly viewable."
ON public.user_skills FOR SELECT USING (true);

CREATE POLICY "Users can insert own skills."
ON public.user_skills FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own skills."
ON public.user_skills FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own skills."
ON public.user_skills FOR DELETE USING (auth.uid() = user_id);

-- SWAP_REQUESTS
CREATE POLICY "Users can view own swaps."
ON public.swap_requests FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can insert swaps."
ON public.swap_requests FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update own swaps."
ON public.swap_requests FOR UPDATE USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- MESSAGES
CREATE POLICY "Users can view messages of their swaps."
ON public.messages FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.swap_requests sr
        WHERE sr.id = swap_id
        AND (sr.sender_id = auth.uid() OR sr.receiver_id = auth.uid())
    )
);

CREATE POLICY "Users can insert messages to their swaps."
ON public.messages FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
        SELECT 1 FROM public.swap_requests sr
        WHERE sr.id = swap_id
        AND (sr.sender_id = auth.uid() OR sr.receiver_id = auth.uid())
    )
);

-- REVIEWS
CREATE POLICY "Reviews are viewable by everyone."
ON public.reviews FOR SELECT USING (true);

CREATE POLICY "Users can insert reviews."
ON public.reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

CREATE POLICY "Users can update own reviews."
ON public.reviews FOR UPDATE USING (auth.uid() = reviewer_id);

-- ==============================================================================
-- 6. STORAGE: AVATARS BUCKET VA RUXSATLAR
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Avatar images are publicly accessible." ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload an avatar." ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar." ON storage.objects;

CREATE POLICY "Avatar images are publicly accessible."
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'avatars' );

CREATE POLICY "Anyone can upload an avatar."
  ON storage.objects FOR INSERT
  WITH CHECK ( bucket_id = 'avatars' );

CREATE POLICY "Users can update their own avatar."
  ON storage.objects FOR UPDATE
  USING ( auth.uid() = owner )
  WITH CHECK ( bucket_id = 'avatars' );

-- ==============================================================================
-- 7. GOOGLE & EMAIL AUTH TRIGGER
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $func$
DECLARE
    v_raw_username TEXT;
    v_full_name TEXT;
    v_avatar TEXT;
BEGIN
    v_full_name := COALESCE(
        new.raw_user_meta_data->>'full_name',
        new.raw_user_meta_data->>'name',
        split_part(new.email, '@', 1),
        'Foydalanuvchi'
    );

    v_avatar := COALESCE(
        new.raw_user_meta_data->>'avatar_url',
        new.raw_user_meta_data->>'picture',
        NULL
    );

    v_raw_username := COALESCE(
        new.raw_user_meta_data->>'username',
        split_part(new.email, '@', 1)
    );

    IF v_raw_username IS NOT NULL AND NOT v_raw_username LIKE '@%' THEN
        v_raw_username := '@' || v_raw_username;
    END IF;

    IF EXISTS (SELECT 1 FROM public.profiles WHERE username = v_raw_username) THEN
        v_raw_username := v_raw_username || '_' || substring(new.id::text from 1 for 4);
    END IF;

    INSERT INTO public.profiles (
        id,
        full_name,
        username,
        avatar_url,
        bio,
        credits,
        reputation_score,
        is_anonymous
    )
    VALUES (
        new.id,
        v_full_name,
        v_raw_username,
        v_avatar,
        '',
        1,
        100,
        false
    )
    ON CONFLICT (id) DO UPDATE SET
        full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
        avatar_url = COALESCE(EXCLUDED.avatar_url, public.profiles.avatar_url);

    RETURN NEW;
END;
$func$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 8. DATABASE FUNCTIONS (RPC)
-- ==============================================================================

-- 8.1. create_swap_request_atomic
CREATE OR REPLACE FUNCTION public.create_swap_request_atomic(
    p_sender_id UUID,
    p_receiver_id UUID,
    p_requested_skill_id UUID,
    p_message TEXT
)
RETURNS JSONB AS $func$
DECLARE
    v_current_credits INT;
    v_new_swap_id UUID;
BEGIN
    IF p_sender_id = p_receiver_id THEN
        RETURN jsonb_build_object('error', 'O''zingizga so''rov yubora olmaysiz!');
    END IF;

    IF EXISTS (
        SELECT 1 FROM public.swap_requests
        WHERE sender_id = p_sender_id 
          AND receiver_id = p_receiver_id 
          AND status IN ('pending', 'accepted', 'active')
    ) THEN
        RETURN jsonb_build_object('error', 'Ushbu foydalanuvchiga allaqachon dars so''rovi yuborgansiz!');
    END IF;

    UPDATE public.profiles
    SET credits = credits - 1
    WHERE id = p_sender_id AND credits >= 1
    RETURNING credits INTO v_current_credits;

    IF v_current_credits IS NULL THEN
        RETURN jsonb_build_object('error', 'Kreditingiz yetarli emas! Dars olish uchun kamida 1 ta kredit kerak.');
    END IF;

    INSERT INTO public.swap_requests (
        sender_id,
        receiver_id,
        requested_skill_id,
        message,
        status,
        credits_frozen
    )
    VALUES (
        p_sender_id,
        p_receiver_id,
        p_requested_skill_id,
        p_message,
        'pending',
        1
    )
    RETURNING id INTO v_new_swap_id;

    RETURN jsonb_build_object('success', true, 'swap_id', v_new_swap_id);
END;
$func$ LANGUAGE plpgsql SECURITY DEFINER;


-- 8.2. decline_swap_and_refund
CREATE OR REPLACE FUNCTION public.decline_swap_and_refund(
    p_swap_id UUID,
    p_sender_id UUID,
    p_receiver_id UUID
)
RETURNS VOID AS $func$
DECLARE
    v_status swap_status;
    v_frozen INT;
BEGIN
    SELECT status, credits_frozen INTO v_status, v_frozen
    FROM public.swap_requests
    WHERE id = p_swap_id AND receiver_id = p_receiver_id;

    IF v_status IS NULL THEN
        RAISE EXCEPTION 'So''rov topilmadi yoki sizga tegishli emas';
    END IF;

    IF v_status <> 'pending' THEN
        RAISE EXCEPTION 'Faqat kutilyotgan (pending) so''rovni rad etish mumkin';
    END IF;

    IF v_frozen > 0 THEN
        UPDATE public.profiles
        SET credits = credits + v_frozen
        WHERE id = p_sender_id;
    END IF;

    UPDATE public.swap_requests
    SET status = 'declined',
        credits_frozen = 0,
        updated_at = NOW()
    WHERE id = p_swap_id;
END;
$func$ LANGUAGE plpgsql SECURITY DEFINER;


-- 8.3. end_class_and_pay
-- Eslatma: SELECT * INTO emas, alohida o'zgaruvchilarga olinadi (Supabase RLS linter adashmasligi uchun)
CREATE OR REPLACE FUNCTION public.end_class_and_pay(
    p_swap_id UUID,
    p_user_id UUID
)
RETURNS VOID AS $func$
DECLARE
    t_sender_id UUID;
    t_receiver_id UUID;
    t_status swap_status;
    t_credits_frozen INT;
BEGIN
    SELECT sender_id, receiver_id, status, credits_frozen
    INTO t_sender_id, t_receiver_id, t_status, t_credits_frozen
    FROM public.swap_requests
    WHERE id = p_swap_id;

    IF t_sender_id IS NULL THEN
        RAISE EXCEPTION 'Dars topilmadi';
    END IF;

    IF t_sender_id <> p_user_id AND t_receiver_id <> p_user_id THEN
        RAISE EXCEPTION 'Siz ushbu darsning ishtirokchisi emassiz';
    END IF;

    IF t_status = 'completed' THEN
        RETURN;
    END IF;

    IF t_credits_frozen > 0 THEN
        UPDATE public.profiles
        SET credits = credits + t_credits_frozen
        WHERE id = t_receiver_id;
    END IF;

    UPDATE public.swap_requests
    SET status = 'completed',
        credits_frozen = 0,
        updated_at = NOW()
    WHERE id = p_swap_id;
END;
$func$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- 9. INITIAL SKILLS SEED DATA
-- ==============================================================================
INSERT INTO public.skills (name, category) VALUES
  ('React', 'Frontend Dasturlash'),
  ('Next.js', 'Frontend Dasturlash'),
  ('Vue.js', 'Frontend Dasturlash'),
  ('Angular', 'Frontend Dasturlash'),
  ('Svelte', 'Frontend Dasturlash'),
  ('HTML & CSS', 'Frontend Dasturlash'),
  ('Tailwind CSS', 'Frontend Dasturlash'),
  ('TypeScript', 'Frontend Dasturlash'),
  ('JavaScript', 'Frontend Dasturlash'),
  ('Redux', 'Frontend Dasturlash'),
  ('Node.js', 'Backend Dasturlash'),
  ('Express.js', 'Backend Dasturlash'),
  ('NestJS', 'Backend Dasturlash'),
  ('Django', 'Backend Dasturlash'),
  ('FastAPI', 'Backend Dasturlash'),
  ('Spring Boot', 'Backend Dasturlash'),
  ('Laravel', 'Backend Dasturlash'),
  ('Go', 'Backend Dasturlash'),
  ('Rust', 'Backend Dasturlash'),
  ('Ruby on Rails', 'Backend Dasturlash'),
  ('PHP', 'Backend Dasturlash'),
  ('C#', 'Backend Dasturlash'),
  ('MERN Stack', 'Fullstack Dasturlash'),
  ('PERN Stack', 'Fullstack Dasturlash'),
  ('T3 Stack', 'Fullstack Dasturlash'),
  ('React Native', 'Mobil Dasturlash (Mobile)'),
  ('Flutter', 'Mobil Dasturlash (Mobile)'),
  ('Swift', 'Mobil Dasturlash (Mobile)'),
  ('Kotlin', 'Mobil Dasturlash (Mobile)'),
  ('Android Development', 'Mobil Dasturlash (Mobile)'),
  ('iOS Development', 'Mobil Dasturlash (Mobile)'),
  ('Figma', 'UI/UX Dizayn'),
  ('Adobe XD', 'UI/UX Dizayn'),
  ('Sketch', 'UI/UX Dizayn'),
  ('Prototyping', 'UI/UX Dizayn'),
  ('Wireframing', 'UI/UX Dizayn'),
  ('TensorFlow', 'Sun''iy Intellekt (AI) & ML'),
  ('PyTorch', 'Sun''iy Intellekt (AI) & ML'),
  ('Scikit-Learn', 'Sun''iy Intellekt (AI) & ML'),
  ('Keras', 'Sun''iy Intellekt (AI) & ML'),
  ('NLP', 'Sun''iy Intellekt (AI) & ML'),
  ('Computer Vision', 'Sun''iy Intellekt (AI) & ML'),
  ('Generative AI', 'Sun''iy Intellekt (AI) & ML'),
  ('Python', 'Data Science (Ma''lumotlar Ilmi)'),
  ('Pandas', 'Data Science (Ma''lumotlar Ilmi)'),
  ('NumPy', 'Data Science (Ma''lumotlar Ilmi)'),
  ('Docker', 'DevOps va Bulutli Texnologiyalar (Cloud)'),
  ('Kubernetes', 'DevOps va Bulutli Texnologiyalar (Cloud)'),
  ('AWS', 'DevOps va Bulutli Texnologiyalar (Cloud)'),
  ('CI/CD', 'DevOps va Bulutli Texnologiyalar (Cloud)'),
  ('GitHub Actions', 'DevOps va Bulutli Texnologiyalar (Cloud)'),
  ('PostgreSQL', 'Ma''lumotlar Bazasi (Database)'),
  ('MySQL', 'Ma''lumotlar Bazasi (Database)'),
  ('MongoDB', 'Ma''lumotlar Bazasi (Database)'),
  ('Redis', 'Ma''lumotlar Bazasi (Database)'),
  ('Ethical Hacking', 'Kiberxavfsizlik (Cybersecurity)'),
  ('Penetration Testing', 'Kiberxavfsizlik (Cybersecurity)'),
  ('Unity', 'O''yin Dasturlash (Game Dev)'),
  ('Unreal Engine', 'O''yin Dasturlash (Game Dev)'),
  ('Solidity', 'Blokcheyn va Web3'),
  ('Ethereum', 'Blokcheyn va Web3'),
  ('Smart Contracts', 'Blokcheyn va Web3'),
  ('Apache Spark', 'Data Engineering'),
  ('Kafka', 'Data Engineering'),
  ('Selenium', 'QA va Dasturni Testlash'),
  ('Cypress', 'QA va Dasturni Testlash'),
  ('Jest', 'QA va Dasturni Testlash'),
  ('C', 'Tizim Dasturlash (Systems)'),
  ('C++', 'Tizim Dasturlash (Systems)'),
  ('Agile', 'Mahsulot Boshqaruvi (Product)'),
  ('Scrum', 'Mahsulot Boshqaruvi (Product)'),
  ('Jira', 'Mahsulot Boshqaruvi (Product)'),
  ('SEO', 'Raqamli Marketing (Digital Marketing)'),
  ('SMM', 'Raqamli Marketing (Digital Marketing)'),
  ('B2B Sales', 'Sotuv va Biznes (Sales)'),
  ('CRM', 'Sotuv va Biznes (Sales)'),
  ('Adobe Photoshop', 'Grafik Dizayn'),
  ('Adobe Illustrator', 'Grafik Dizayn'),
  ('Video Editing', 'Video Montaj va Animatsiya'),
  ('Adobe Premiere Pro', 'Video Montaj va Animatsiya'),
  ('Music Production', 'Ovoz va Musiqa (Audio)'),
  ('English Speaking', 'Xorijiy Tillar (Languages)'),
  ('IELTS Prep', 'Xorijiy Tillar (Languages)'),
  ('Russian Speaking', 'Xorijiy Tillar (Languages)'),
  ('Copywriting', 'Tarjima va Koping (Copywriting)'),
  ('Calculus', 'Matematika'),
  ('Linear Algebra', 'Matematika'),
  ('Probability', 'Statistika va Ehtimollar'),
  ('Financial Modeling', 'Moliya va Buxgalteriya'),
  ('Crypto Trading', 'Kripto va Investitsiya'),
  ('Public Speaking', 'Shaxsiy Rivojlanish'),
  ('Time Management', 'Shaxsiy Rivojlanish'),
  ('Arduino', 'Elektronika va IoT'),
  ('Augmented Reality', 'AR / VR Texnologiyalari'),
  ('Webflow', 'Low-Code / No-Code'),
  ('Blogging', 'Kontent Yaratish (Blogging/Vlogging)'),
  ('AutoCAD', 'Arxitektura va Chizmachilik'),
  ('First Aid', 'Tibbiyot va Salomatlik'),
  ('Biology', 'Tabiiy Fanlar'),
  ('Recruiting', 'Inson Resurslari (HR)'),
  ('PMP', 'Loyihalar Boshqaruvi (Project Management)'),
  ('Business Law', 'Huquqshunoslik (Law)'),
  ('Logistics', 'Logistika va Ta''minot'),
  ('Customer Support', 'Mijozlarga Xizmat Ko''rsatish (Customer Service)'),
  ('Cooking', 'Pazandachilik (Culinary)'),
  ('Painting', 'San''at va Hunarmandchilik'),
  ('Fashion Design', 'Moda va Tikuvchilik (Fashion)'),
  ('Personal Training', 'Sport va Murabbiylik'),
  ('Event Management', 'Tadbir Tashkil Etish (Event Planning)'),
  ('Bioinformatics', 'Biotexnologiya va Bioinformatika'),
  ('Agronomy', 'Qishloq Xo''jaligi (Agriculture)'),
  ('Journalism', 'Jurnalistika va Media'),
  ('Nanotechnology', 'Rivojlanayotgan Texnologiyalar'),
  ('Business Analysis', 'Biznes Tahlil (Business Analysis)')
ON CONFLICT (name) DO NOTHING;
