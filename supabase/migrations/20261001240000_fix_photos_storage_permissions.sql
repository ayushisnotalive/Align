-- Fix Supabase Storage bucket and RLS policies for 'photos'
-- Ensure photos bucket is completely public and allows uploads from both authenticated users and onboarding clients

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('photos', 'photos', true, 52428800, null)
on conflict (id) do update set 
  public = true,
  file_size_limit = 52428800,
  allowed_mime_types = null;

-- Drop any conflicting or restrictive policies for photos bucket
drop policy if exists "Public Photo Access" on storage.objects;
drop policy if exists "Auth Users Upload Photos" on storage.objects;
drop policy if exists "Auth Users Update Photos" on storage.objects;
drop policy if exists "Auth Users Delete Photos" on storage.objects;
drop policy if exists "Allow Photo Selects" on storage.objects;
drop policy if exists "Allow Photo Uploads" on storage.objects;
drop policy if exists "Allow Photo Updates" on storage.objects;
drop policy if exists "Allow Photo Deletes" on storage.objects;

-- Create wide-open policies for the photos bucket
create policy "Allow Photo Selects"
on storage.objects for select
using (bucket_id = 'photos');

create policy "Allow Photo Uploads"
on storage.objects for insert
with check (bucket_id = 'photos');

create policy "Allow Photo Updates"
on storage.objects for update
using (bucket_id = 'photos')
with check (bucket_id = 'photos');

create policy "Allow Photo Deletes"
on storage.objects for delete
using (bucket_id = 'photos');
