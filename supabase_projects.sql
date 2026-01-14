-- Create the table for projects
create table if not exists projects (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  category text not null,
  image_url text not null,
  width integer,
  height integer
);

-- Enable RLS
alter table projects enable row level security;

-- Allow public read access
create policy "Allow public read projects"
  on projects
  for select
  using (true);

-- Allow authenticated (or anon for now if relying on client key for admin) insert/delete
-- IMPORTANT: In a real prod app, you'd lock this down to authenticated users only.
-- Since the Admin Panel is behind a client-side password, we will use the same 'anon' key 
-- but rely on the frontend to gate access. 
-- Ideally, we'd use Supabase Auth, but to keep it simple as per previous flow:
create policy "Allow insert for everyone"
  on projects
  for insert
  with check (true);

create policy "Allow delete for everyone"
  on projects
  for delete
  using (true);
