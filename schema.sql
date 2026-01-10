-- Create table
create table if not exists public.campsites (
  id uuid not null default gen_random_uuid() primary key,
  user_id uuid references auth.users not null default auth.uid(),
  name text not null,
  location text,
  visited_date date,
  price integer,
  rating integer,
  review text,
  surrounding_facilities text,
  status text check (status in ('visited', 'wishlist')) not null,
  image_urls text[],
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.campsites enable row level security;

-- Policies
create policy "Users can view their own data" on public.campsites
  for select using (auth.uid() = user_id);

create policy "Users can insert their own data" on public.campsites
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own data" on public.campsites
  for update using (auth.uid() = user_id);

create policy "Users can delete their own data" on public.campsites
  for delete using (auth.uid() = user_id);

-- Storage bucket setup (Requires Manual Creation in Dashboard usually, but SQL can try)
-- Note: Creating buckets via SQL in Supabase might require specific permissions or extensions.
-- It's often safer to ask user to create bucket 'campsite_images' and set public.

-- Storage policies (assuming bucket 'campsite_images' exists)
create policy "Authenticated users can upload images" on storage.objects
  for insert with check (bucket_id = 'campsite_images' and auth.role() = 'authenticated');

create policy "Users can view images" on storage.objects
  for select using (bucket_id = 'campsite_images');
