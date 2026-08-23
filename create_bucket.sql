-- 'avatars' nomli public (ochiq) bucket yaratamiz
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Hamma rasmlarni ko'ra olishi uchun ruxsat
create policy "Avatar images are publicly accessible."
  on storage.objects for select
  using ( bucket_id = 'avatars' );

-- Rasmlarni yuklash uchun ruxsat
create policy "Anyone can upload an avatar."
  on storage.objects for insert
  with check ( bucket_id = 'avatars' );

-- Foydalanuvchilar o'z rasmlarini yangilashi uchun ruxsat
create policy "Users can update their own avatar."
  on storage.objects for update
  using ( auth.uid() = owner )
  with check ( bucket_id = 'avatars' );
