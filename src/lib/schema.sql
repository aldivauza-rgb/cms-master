-- ============================================================
-- CMS Database Schema — Full Migration
-- Jalankan di Supabase Dashboard → SQL Editor
-- Aman dijalankan ulang (IF NOT EXISTS / ON CONFLICT)
-- ============================================================

-- ─── HELPER: auto-update updated_at ─────────────────────────
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ─── CMS PROFILES (linked ke Supabase Auth) ─────────────────
-- Menyimpan data profil untuk setiap user yang login via Auth.
create table if not exists cms_profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  name       text not null default '',
  role       text not null default 'administrator',
  foto_url   text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Trigger: auto-buat profil saat user baru dibuat di Auth
create or replace function handle_new_auth_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into cms_profiles (id, name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_auth_user();

create trigger trg_cms_profiles_updated_at
  before update on cms_profiles
  for each row execute function set_updated_at();

-- ─── SLIDES (Slideshow) ─────────────────────────────────────
create table if not exists slides (
  id         uuid primary key default gen_random_uuid(),
  title      text,
  image_url  text,
  "order"    integer not null default 0,
  is_active  boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_slides_updated_at
  before update on slides
  for each row execute function set_updated_at();

-- ─── BERITA (News) ──────────────────────────────────────────
create table if not exists berita_kategori (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  created_at timestamptz not null default now()
);

create table if not exists berita (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  content      text,
  cover_url    text,
  kategori_id  uuid references berita_kategori(id) on delete set null,
  status       text not null default 'draft' check (status in ('draft','published')),
  publisher    text,
  published_at date,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create trigger trg_berita_updated_at
  before update on berita
  for each row execute function set_updated_at();

-- ─── AGENDA ─────────────────────────────────────────────────
create table if not exists agenda (
  id         uuid primary key default gen_random_uuid(),
  title      text not null,
  tanggal    date,
  waktu      time,
  lokasi     text,
  deskripsi  text,
  status     text not null default 'draft' check (status in ('draft','published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_agenda_updated_at
  before update on agenda
  for each row execute function set_updated_at();

-- ─── DOKUMEN RILIS ──────────────────────────────────────────
create table if not exists dokumen (
  id         uuid primary key default gen_random_uuid(),
  title      text not null,
  publisher  text,
  tanggal    date,
  link_url   text,
  status     text not null default 'draft' check (status in ('draft','published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_dokumen_updated_at
  before update on dokumen
  for each row execute function set_updated_at();

-- ─── MAJALAH ────────────────────────────────────────────────
create table if not exists majalah (
  id         uuid primary key default gen_random_uuid(),
  title      text not null,
  edisi      text,
  publisher  text,
  tanggal    date,
  cover_url  text,
  link_url   text,
  status     text not null default 'draft' check (status in ('draft','published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_majalah_updated_at
  before update on majalah
  for each row execute function set_updated_at();

-- ─── FASILITAS ──────────────────────────────────────────────
create table if not exists fasilitas (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  deskripsi    text,
  publisher    text,
  tanggal      date,
  cover_index  integer not null default 0,
  status       text not null default 'draft' check (status in ('draft','published')),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table if not exists fasilitas_gallery (
  id           uuid primary key default gen_random_uuid(),
  fasilitas_id uuid not null references fasilitas(id) on delete cascade,
  image_url    text not null,
  "order"      integer not null default 0,
  is_cover     boolean not null default false,
  created_at   timestamptz not null default now()
);

create trigger trg_fasilitas_updated_at
  before update on fasilitas
  for each row execute function set_updated_at();

-- ─── PROFIL PAGES (block editor) ────────────────────────────
-- Menyimpan blok konten (JSON) untuk semua halaman menu Profil.
create table if not exists profil_pages (
  id         uuid primary key default gen_random_uuid(),
  page_key   text unique not null,
  blocks     jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

-- Seed semua halaman profil
insert into profil_pages (page_key) values
  ('sambutan'),
  ('tentang'),
  ('visimisi'),
  ('struktur'),
  ('akreditasi'),
  ('statistik')
on conflict (page_key) do nothing;

create trigger trg_profil_updated_at
  before update on profil_pages
  for each row execute function set_updated_at();

-- ─── GURU & STAFF ───────────────────────────────────────────
create table if not exists guru_staf (
  id                 uuid primary key default gen_random_uuid(),
  nama               text not null,
  jabatan            text not null,
  foto_url           text,
  riwayat_pendidikan jsonb not null default '[]'::jsonb,
  pengalaman_kerja   jsonb not null default '[]'::jsonb,
  prestasi           jsonb not null default '[]'::jsonb,
  status             text not null default 'draft' check (status in ('draft','published')),
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create trigger trg_guru_staf_updated_at
  before update on guru_staf
  for each row execute function set_updated_at();

-- ─── AKUN (Managed Accounts — Operator & User) ──────────────
-- Akun yang dikelola admin di menu "Kelola Akun".
-- Berbeda dari Supabase Auth — ini untuk sub-user CMS.
create table if not exists akun (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  username   text unique not null,
  password   text not null,
  role       text not null default 'user' check (role in ('operator','user')),
  is_active  boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_akun_updated_at
  before update on akun
  for each row execute function set_updated_at();

-- ─── ROW LEVEL SECURITY ─────────────────────────────────────
alter table cms_profiles    enable row level security;
alter table slides          enable row level security;
alter table berita_kategori enable row level security;
alter table berita          enable row level security;
alter table agenda          enable row level security;
alter table dokumen         enable row level security;
alter table majalah         enable row level security;
alter table fasilitas       enable row level security;
alter table fasilitas_gallery enable row level security;
alter table profil_pages    enable row level security;
alter table guru_staf       enable row level security;
alter table akun            enable row level security;

-- cms_profiles: hanya bisa dibaca/edit oleh user yang login
create policy "cms_profiles_select" on cms_profiles for select to authenticated using (auth.uid() = id);
create policy "cms_profiles_update" on cms_profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

-- Semua tabel konten: hanya authenticated user (CMS admin/operator)
do $$
declare
  tbl text;
begin
  foreach tbl in array array[
    'slides','berita_kategori','berita','agenda','dokumen',
    'majalah','fasilitas','fasilitas_gallery',
    'profil_pages','guru_staf','akun'
  ] loop
    execute format(
      'create policy "allow_authenticated_%s" on %I for all to authenticated using (true) with check (true)',
      tbl, tbl
    );
  end loop;
end $$;

-- ─── STORAGE BUCKETS ────────────────────────────────────────
-- Buat bucket berikut di Supabase Dashboard → Storage → New bucket
-- Centang "Public bucket" agar URL bisa diakses tanpa auth.
--
--   Bucket name     | Digunakan untuk
--   ─────────────── | ─────────────────────────────────────
--   slides          | Gambar slideshow
--   berita          | Cover foto berita
--   fasilitas       | Galeri foto fasilitas
--   majalah         | Cover majalah
--   profil          | Gambar/video di block editor halaman Profil
--   guru-staf       | Foto profil Guru & Staff
--
-- Setelah bucket dibuat, tambahkan policy di Storage → Policies:
--   Policy name  : allow_authenticated_uploads
--   Allowed ops  : SELECT, INSERT, UPDATE, DELETE
--   Target roles : authenticated
