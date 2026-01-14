-- 1. Create Projects Table (if not exists)
create table if not exists projects (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  category text not null,
  image_url text not null,
  width integer,
  height integer,
  description text,
  gallery text[] default array[]::text[]
);

-- 2. Enable RLS
alter table projects enable row level security;

-- 3. Projects Table Policies (Allow ALL for anon/public for now)
-- READ
create policy "Public Read Projects"
on projects for select
using (true);

-- INSERT
create policy "Public Insert Projects"
on projects for insert
with check (true);

-- UPDATE
create policy "Public Update Projects"
on projects for update
using (true);

-- DELETE
create policy "Public Delete Projects"
on projects for delete
using (true);


-- 4. STORAGE POLICIES (Access to 'projects' bucket)
-- We need to insert into storage.objects
-- NOTE: You must have created a public bucket named 'projects' in Supabase Dashboard first!

-- Allow public uploads to 'projects' bucket
create policy "Allow Public Uploads"
on storage.objects
for insert
with check ( bucket_id = 'projects' );

-- Allow public read of objects
create policy "Allow Public Read Objects"
on storage.objects
for select
using ( bucket_id = 'projects' );

-- Allow public delete (for admin cleanup)
create policy "Allow Public Delete Objects"
on storage.objects
for delete
using ( bucket_id = 'projects' );
