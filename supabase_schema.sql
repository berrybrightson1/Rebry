-- Create the table for requests
create table requests (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  business_name text,
  service_type text,
  budget text,
  whatsapp text,
  email text,
  description text,
  status text default 'New'
);

-- (Optional) Enable Row Level Security (RLS) if you want to restrict access
-- For now, we leave it open or you can set policies later.
alter table requests enable row level security;

-- Allow public insert (since it's a contact form)
create policy "Allow public insert"
  on requests
  for insert
  with check (true);

-- Allow public read (for your admin panel to see them)
create policy "Allow public read"
  on requests
  for select
  using (true);
