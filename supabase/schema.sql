-- Run once in the Supabase SQL Editor. Re-running is safe for portfolio data.
begin;
create table if not exists public.portfolio_admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);
alter table public.portfolio_admins enable row level security;
revoke all on public.portfolio_admins from anon, authenticated;

create or replace function public.is_portfolio_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.portfolio_admins where user_id = (select auth.uid()));
$$;
revoke all on function public.is_portfolio_admin() from public, anon;
grant execute on function public.is_portfolio_admin() to authenticated;

create table if not exists public.portfolio_projects (
  id text primary key check (id ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and length(id) <= 80),
  data jsonb not null check (
    jsonb_typeof(data) = 'object' and
    data ?& array['id','title','visible','image','imageAlt','category','description','group','order','wide','isNew','problem','approach','outcome','limitations','links'] and
    data->>'id' = id and jsonb_typeof(data->'visible') = 'boolean' and
    jsonb_typeof(data->'links') = 'array' and jsonb_typeof(data->'order') = 'number'
  ),
  updated_at timestamptz not null default now()
);
create table if not exists public.portfolio_site (
  id text primary key check (id = 'main'),
  data jsonb not null check (jsonb_typeof(data) = 'object'),
  updated_at timestamptz not null default now()
);
alter table public.portfolio_projects enable row level security;
alter table public.portfolio_site enable row level security;
revoke all on public.portfolio_projects, public.portfolio_site from anon, authenticated;
grant select on public.portfolio_projects, public.portfolio_site to anon, authenticated;
grant insert, update, delete on public.portfolio_projects, public.portfolio_site to authenticated;
drop policy if exists "Read published projects" on public.portfolio_projects;
create policy "Read published projects" on public.portfolio_projects for select to anon, authenticated using (data->'visible' = 'true'::jsonb);
drop policy if exists "Admins manage projects" on public.portfolio_projects;
create policy "Admins manage projects" on public.portfolio_projects for all to authenticated using ((select public.is_portfolio_admin())) with check ((select public.is_portfolio_admin()));
drop policy if exists "Read public profile" on public.portfolio_site;
create policy "Read public profile" on public.portfolio_site for select to anon, authenticated using (true);
drop policy if exists "Admins manage profile" on public.portfolio_site;
create policy "Admins manage profile" on public.portfolio_site for all to authenticated using ((select public.is_portfolio_admin())) with check ((select public.is_portfolio_admin()));

create or replace function public.portfolio_touch_updated_at() returns trigger
language plpgsql set search_path = '' as $$ begin new.updated_at = clock_timestamp(); return new; end; $$;
drop trigger if exists portfolio_project_updated on public.portfolio_projects;
create trigger portfolio_project_updated before update on public.portfolio_projects for each row execute function public.portfolio_touch_updated_at();
drop trigger if exists portfolio_site_updated on public.portfolio_site;
create trigger portfolio_site_updated before update on public.portfolio_site for each row execute function public.portfolio_touch_updated_at();

insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('portfolio-media','portfolio-media',true,47185920,array['image/png','image/jpeg','image/webp','application/octet-stream'])
on conflict (id) do nothing;
drop policy if exists "Portfolio admin upload" on storage.objects;
create policy "Portfolio admin upload" on storage.objects for insert to authenticated with check (bucket_id='portfolio-media' and (select public.is_portfolio_admin()));
drop policy if exists "Portfolio admin update files" on storage.objects;
create policy "Portfolio admin update files" on storage.objects for update to authenticated using (bucket_id='portfolio-media' and (select public.is_portfolio_admin())) with check (bucket_id='portfolio-media' and (select public.is_portfolio_admin()));
drop policy if exists "Portfolio admin list files" on storage.objects;
create policy "Portfolio admin list files" on storage.objects for select to authenticated using (bucket_id='portfolio-media' and (select public.is_portfolio_admin()));
drop policy if exists "Portfolio admin delete files" on storage.objects;
create policy "Portfolio admin delete files" on storage.objects for delete to authenticated using (bucket_id='portfolio-media' and (select public.is_portfolio_admin()));
commit;
