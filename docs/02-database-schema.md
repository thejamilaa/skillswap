# Database Schema & RLS Policies

## 1. Table Definitions

### `profiles`
Stores user profile information, including their Skill Credits and Reputation for the Anti-Ghosting system.
```sql
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    resume_text TEXT, -- For AI Matching
    credits INTEGER DEFAULT 1, -- Start with 1 credit to learn
    reputation_score INTEGER DEFAULT 100, -- Decreases if they ghost
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### `skills`
Master list of available skills. Focuses initially on Tech, Design, and Languages.
```sql
CREATE TABLE public.skills (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### `user_skills`
Mapping of users to skills, categorized by whether they can teach or want to learn.
```sql
CREATE TYPE skill_type AS ENUM ('teach', 'learn');

CREATE TABLE public.user_skills (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    skill_id UUID REFERENCES public.skills(id) ON DELETE CASCADE,
    type skill_type NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, skill_id, type)
);
```

### `swap_requests`
Tracks the lifecycle of a skill exchange. Includes the frozen credit system and AI notes.
```sql
CREATE TYPE swap_status AS ENUM ('pending', 'accepted', 'active', 'completed', 'declined', 'ghosted');

CREATE TABLE public.swap_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE, -- Learner (spending credit)
    receiver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE, -- Mentor (earning credit)
    requested_skill_id UUID REFERENCES public.skills(id) ON DELETE SET NULL,
    status swap_status DEFAULT 'pending',
    message TEXT,
    credits_frozen INTEGER DEFAULT 1, -- Anti-ghosting deposit
    ai_lesson_notes TEXT, -- Generated after Jitsi call
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### `messages`
Real-time chat messages between users in a swap.
```sql
CREATE TABLE public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    swap_id UUID REFERENCES public.swap_requests(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### `reviews`
Post-swap reviews and ratings.
```sql
CREATE TABLE public.reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    swap_id UUID REFERENCES public.swap_requests(id) ON DELETE CASCADE,
    reviewer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    reviewee_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 2. Row-Level Security (RLS) Policies

Enable RLS on all tables:
```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE swap_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
```

### Profiles
```sql
-- Public can read all profiles
CREATE POLICY "Public profiles are viewable by everyone." 
ON profiles FOR SELECT USING (true);

-- Users can update own profile (but should not be able to manually edit credits or reputation via UI)
CREATE POLICY "Users can update own profile." 
ON profiles FOR UPDATE USING (auth.uid() = id);
```

### Skills
```sql
-- Skills are publicly readable
CREATE POLICY "Skills are publicly viewable." 
ON skills FOR SELECT USING (true);
```

### User Skills
```sql
-- Public can view user skills
CREATE POLICY "User skills are publicly viewable." 
ON user_skills FOR SELECT USING (true);

-- Users can manage their own skills
CREATE POLICY "Users can insert own skills." 
ON user_skills FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own skills." 
ON user_skills FOR DELETE USING (auth.uid() = user_id);
```

### Swap Requests
```sql
-- Users can see swaps they are involved in
CREATE POLICY "Users can view own swaps." 
ON swap_requests FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- Users can create a swap request
CREATE POLICY "Users can insert swaps." 
ON swap_requests FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Users can update swaps they are involved in (e.g., accept/decline)
CREATE POLICY "Users can update own swaps." 
ON swap_requests FOR UPDATE USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
```

### Messages
```sql
-- Users can read messages in their swaps
CREATE POLICY "Users can view messages of their swaps." 
ON messages FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM swap_requests sr 
        WHERE sr.id = messages.swap_id 
        AND (sr.sender_id = auth.uid() OR sr.receiver_id = auth.uid())
    )
);

-- Users can send messages to their swaps
CREATE POLICY "Users can insert messages to their swaps." 
ON messages FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
        SELECT 1 FROM swap_requests sr 
        WHERE sr.id = swap_id 
        AND (sr.sender_id = auth.uid() OR sr.receiver_id = auth.uid())
        AND sr.status IN ('accepted', 'active')
    )
);
```

## 3. Initial Seed Data
```sql
INSERT INTO public.skills (name, category) VALUES
('React', 'Tech'),
('TypeScript', 'Tech'),
('Python', 'Tech'),
('UI/UX Design', 'Design'),
('Figma', 'Design'),
('Frontend Mock Interview', 'Professional'),
('System Design Interview', 'Professional'),
('English Speaking', 'Languages'),
('IELTS Prep', 'Languages');
```
