-- ============================================================
-- CMS Database Schema
-- Jalankan file ini di Supabase Dashboard → SQL Editor
-- ============================================================

-- ─── SLIDES (Slideshow) ─────────────────────────────────────
create table if not exists slides (
  id          uuid primary key default gen_random_uuid(),
  title       text,
  image_url   text,
  "order"     integer not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

-- ─── BERITA (News) ──────────────────────────────────────────
create table if not exists berita_kategori (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  created_at  timestamptz not null default now()
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

-- ─── AGENDA ─────────────────────────────────────────────────
create table if not exists agenda (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  tanggal     date,
  waktu       time,
  lokasi      text,
  deskripsi   text,
  status      text not null default 'draft' check (status in ('draft','published')),
  created_at  timestamptz not null default now()
);

-- ─── DOKUMEN RILIS ──────────────────────────────────────────
create table if not exists dokumen (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  publisher   text,
  tanggal     date,
  link_url    text,
  status      text not null default 'draft' check (status in ('draft','published')),
  created_at  timestamptz not null default now()
);

-- ─── MAJALAH ────────────────────────────────────────────────
create table if not exists majalah (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  edisi       text,
  publisher   text,
  tanggal     date,
  cover_url   text,
  link_url    text,
  status      text not null default 'draft' check (status in ('draft','published')),
  created_at  timestamptz not null default now()
);

-- ─── FASILITAS ──────────────────────────────────────────────
create table if not exists fasilitas (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  deskripsi     text,
  publisher     text,
  tanggal       date,
  cover_index   integer not null default 0,
  status        text not null default 'draft' check (status in ('draft','published')),
  created_at    timestamptz not null default now()
);

create table if not exists fasilitas_gallery (
  id            uuid primary key default gen_random_uuid(),
  fasilitas_id  uuid not null references fasilitas(id) on delete cascade,
  image_url     text not null,
  "order"       integer not null default 0,
  is_cover      boolean not null default false,
  created_at    timestamptz not null default now()
);

-- ─── PROFIL PAGES (block editor) ────────────────────────────
-- Menyimpan semua blok konten untuk 6 halaman profil sebagai JSON
create table if not exists profil_pages (
  id          uuid primary key default gen_random_uuid(),
  page_key    text unique not null,
  blocks      jsonb not null default '[]'::jsonb,
  updated_at  timestamptz not null default now()
);

-- Seed 6 halaman profil dengan konten kosong
insert into profil_pages (page_key) values
  ('sambutan'),
  ('tentang'),
  ('visimisi'),
  ('struktur'),
  ('akreditasi'),
  ('statistik')
on conflict (page_key) do nothing;

-- ─── GURU & STAFF ───────────────────────────────────────────
create table if not exists guru_staf (
  id                uuid primary key default gen_random_uuid(),
  nama              text not null,
  jabatan           text not null,
  foto_url          text,
  riwayat_pendidikan jsonb not null default '[]'::jsonb,
  pengalaman_kerja  jsonb not null default '[]'::jsonb,
  prestasi          jsonb not null default '[]'::jsonb,
  status            text not null default 'draft' check (status in ('draft','published')),
  created_at        timestamptz not null default now()
);

alter table guru_staf enable row level security;
create policy "allow_all_guru_staf" on guru_staf for all to anon using (true) with check (true);

-- ─── AKUN (Managed Accounts) ────────────────────────────────
create table if not exists akun (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  username    text unique not null,
  password    text not null,
  role        text not null default 'user' check (role in ('operator','user')),
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

-- ─── RLS (Row Level Security) ───────────────────────────────
-- Aktifkan RLS tapi izinkan semua operasi via anon key untuk saat ini.
-- Perketat setelah implementasi auth Supabase ditambahkan.
alter table slides          enable row level security;
alter table berita_kategori enable row level security;
alter table berita          enable row level security;
alter table agenda          enable row level security;
alter table dokumen         enable row level security;
alter table majalah         enable row level security;
alter table fasilitas       enable row level security;
alter table fasilitas_gallery enable row level security;
alter table profil_pages    enable row level security;
alter table akun            enable row level security;

-- Policy: izinkan semua operasi dari anon key (CMS internal)
do $$
declare
  tbl text;
begin
  foreach tbl in array array[
    'slides','berita_kategori','berita','agenda','dokumen',
    'majalah','fasilitas','fasilitas_gallery','profil_pages','akun'
  ] loop
    execute format(
      'create policy "allow_all_%s" on %I for all to anon using (true) with check (true)',
      tbl, tbl
    );
  end loop;
end $$;

-- ─── STORAGE BUCKETS ────────────────────────────────────────
-- Buat bucket berikut di Supabase Dashboard → Storage:
--   • slides       → gambar slideshow
--   • berita       → cover berita
--   • fasilitas    → galeri foto fasilitas
--   • majalah      → cover majalah
--   • profil       → gambar/video di block editor halaman profil
-- Semua bucket set sebagai Public agar URL bisa langsung diakses.

-- ─── HELPER: auto-update updated_at ─────────────────────────
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

create trigger trg_berita_updated_at
  before update on berita
  for each row execute function set_updated_at();

create trigger trg_profil_updated_at
  before update on profil_pages
  for each row execute function set_updated_at();
