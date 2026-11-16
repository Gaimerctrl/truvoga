-- =============================================================
--  Карта загроз: база даних Supabase
--  Встав увесь цей файл у Supabase → SQL Editor → New query → Run
-- =============================================================

create extension if not exists pgcrypto;

-- 1) Хто адмін
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;
grant execute on function public.is_admin() to anon, authenticated;

-- 2) Цілі на карті (шахеди, ракети тощо)
create table if not exists public.threats (
  id          uuid primary key default gen_random_uuid(),
  type        text not null,
  lon         double precision not null,
  lat         double precision not null,
  heading     double precision,
  count       integer not null default 1 check (count between 1 and 999),
  note        text not null default '' check (char_length(note) <= 300),
  reliability smallint not null default 2 check (reliability between 1 and 3),
  trail       jsonb not null default '[]'::jsonb,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- 3) Тривоги по районах (rid — код району, напр. "khr:5"; "kyc" — м. Київ)
create table if not exists public.alerts (
  rid        text primary key,
  level      smallint not null check (level in (1, 2)),   -- 1 загроза, 2 тривога
  started_at timestamptz not null default now(),
  source     text not null default 'manual'                -- 'manual' з адмінки, 'auto' з alerts.in.ua
);
alter table public.alerts add column if not exists source text not null default 'manual';

-- 4) Стрічка повідомлень
create table if not exists public.posts (
  id         uuid primary key default gen_random_uuid(),
  text       text not null check (char_length(text) between 1 and 1000),
  kind       text not null default 'info' check (kind in ('info','warn','danger','ok')),
  created_at timestamptz not null default now()
);

-- 5) Права доступу: читати можуть усі, змінювати — лише адміни
alter table public.admins  enable row level security;
alter table public.threats enable row level security;
alter table public.alerts  enable row level security;
alter table public.posts   enable row level security;

drop policy if exists "admins see self" on public.admins;
create policy "admins see self" on public.admins for select to authenticated using (user_id = auth.uid());

do $$
declare t text;
begin
  foreach t in array array['threats','alerts','posts'] loop
    execute format('drop policy if exists "public read" on public.%I', t);
    execute format('drop policy if exists "admin insert" on public.%I', t);
    execute format('drop policy if exists "admin update" on public.%I', t);
    execute format('drop policy if exists "admin delete" on public.%I', t);
    execute format('create policy "public read" on public.%I for select to anon, authenticated using (true)', t);
    execute format('create policy "admin insert" on public.%I for insert to authenticated with check (public.is_admin())', t);
    execute format('create policy "admin update" on public.%I for update to authenticated using (public.is_admin()) with check (public.is_admin())', t);
    execute format('create policy "admin delete" on public.%I for delete to authenticated using (public.is_admin())', t);
  end loop;
end $$;

-- 6) Миттєві оновлення (Realtime)
do $$
declare t text;
begin
  foreach t in array array['threats','alerts','posts'] loop
    if not exists (select 1 from pg_publication_tables
                   where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = t) then
      execute format('alter publication supabase_realtime add table public.%I', t);
    end if;
  end loop;
end $$;

-- =============================================================
--  7) ЗРОБИ СЕБЕ АДМІНОМ
--  Спершу створи користувача: Authentication → Users → Add user
--  (email + пароль, постав галочку Auto Confirm User).
--  Потім заміни email нижче на свій і виконай ці два рядки окремо:
-- =============================================================
-- insert into public.admins (user_id)
-- select id from auth.users where email = 'ТВІЙ_EMAIL@gmail.com';
