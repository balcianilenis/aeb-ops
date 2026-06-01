-- ============================================================
-- AEB Operations Intelligence™ — Master Database Schema
-- Son güncelleme: 2026-06
-- Sıfırdan kurmak için bu dosyayı Supabase SQL Editor'a yapıştır
-- ============================================================

-- ── EXTENSIONS ───────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── CORE TABLES ──────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS clients (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text NOT NULL UNIQUE,
  status     text DEFAULT 'Active' CHECK (status IN ('Active','InActive')),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS contracts (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text NOT NULL,
  client_id  uuid REFERENCES clients(id),
  status     text DEFAULT 'Active' CHECK (status IN ('Active','InActive')),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS projects (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  status      text DEFAULT 'Active' CHECK (status IN ('Active','InActive')),
  client_id   uuid REFERENCES clients(id),
  contract_id uuid REFERENCES contracts(id),
  location    text,
  created_at  timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS drills (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text NOT NULL UNIQUE,
  status        text DEFAULT 'Active' CHECK (status IN ('Active','InActive')),
  drill_type    text,
  make          text,
  model         text,
  year          int,
  serial_number text,
  created_at    timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS employees (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id      int UNIQUE,
  first_name       text NOT NULL,
  last_name        text,
  employee_type    text DEFAULT 'Field' CHECK (employee_type IN ('Field','Office')),
  payroll_category text,
  status           text DEFAULT 'Active' CHECK (status IN ('Active','InActive')),
  created_at       timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS holes (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name               text NOT NULL,
  status             text DEFAULT 'Active' CHECK (status IN ('Active','Complete','Abandoned','Cancelled','Planned')),
  client_id          uuid REFERENCES clients(id),
  contract_id        uuid REFERENCES contracts(id),
  project_id         uuid REFERENCES projects(id),
  max_depth          numeric(10,2),
  last_activity_date date,
  created_at         timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS bits (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  serial_number  text NOT NULL UNIQUE,
  status         text DEFAULT 'Active'
                 CHECK (status IN ('Active','Complete-Damaged','Complete-Worn Flat','Complete-Left in Hole','Complete-Worn Inner')),
  model          text,
  contract_id    uuid REFERENCES contracts(id),
  project_id     uuid REFERENCES projects(id),
  client_id      uuid REFERENCES clients(id),
  bit_size       text,
  total_distance numeric(10,2) DEFAULT 0,
  created_at     timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS bit_usage_records (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bit_id     uuid NOT NULL REFERENCES bits(id) ON DELETE CASCADE,
  hole_id    uuid REFERENCES holes(id),
  hole_name  text,
  depth_from numeric(10,2) DEFAULT 0,
  depth_to   numeric(10,2) DEFAULT 0,
  distance   numeric(10,2) GENERATED ALWAYS AS (depth_to - depth_from) STORED,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS consumable_categories (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text NOT NULL UNIQUE,
  status     text DEFAULT 'Active' CHECK (status IN ('Active','InActive')),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS consumables (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name              text NOT NULL,
  status            text DEFAULT 'Active' CHECK (status IN ('Active','InActive')),
  category_id       uuid REFERENCES consumable_categories(id),
  rate              numeric(12,2),
  rate_type         text,
  currency          text DEFAULT 'USD',
  rate_entered_date date,
  created_at        timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS daily_shift_reports (
  id                     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_date            date NOT NULL,
  shift                  text NOT NULL CHECK (shift IN ('DAY','NIGHT')),
  status                 text DEFAULT 'PENDING APPROVAL'
                         CHECK (status IN ('PENDING APPROVAL','APPROVED','VALIDATED','REJECTED')),
  drill_id               uuid REFERENCES drills(id),
  contract_id            uuid REFERENCES contracts(id),
  project_id             uuid REFERENCES projects(id),
  client_id              uuid REFERENCES clients(id),
  total_man_hours        numeric DEFAULT 0,
  total_activity_hours   numeric DEFAULT 0,
  total_distance_drilled numeric DEFAULT 0,
  created_at             timestamptz DEFAULT now()
);

-- ── USER PROFILES ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_profiles (
  id         uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email      text NOT NULL,
  full_name  text,
  role       text NOT NULL DEFAULT 'Viewer'
             CHECK (role IN ('Admin','Supervisor','Viewer')),
  is_active  boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- ── DISABLE RLS (geliştirme aşaması) ─────────────────────────
ALTER TABLE clients                DISABLE ROW LEVEL SECURITY;
ALTER TABLE contracts              DISABLE ROW LEVEL SECURITY;
ALTER TABLE projects               DISABLE ROW LEVEL SECURITY;
ALTER TABLE drills                 DISABLE ROW LEVEL SECURITY;
ALTER TABLE employees              DISABLE ROW LEVEL SECURITY;
ALTER TABLE holes                  DISABLE ROW LEVEL SECURITY;
ALTER TABLE bits                   DISABLE ROW LEVEL SECURITY;
ALTER TABLE bit_usage_records      DISABLE ROW LEVEL SECURITY;
ALTER TABLE consumable_categories  DISABLE ROW LEVEL SECURITY;
ALTER TABLE consumables            DISABLE ROW LEVEL SECURITY;
ALTER TABLE daily_shift_reports    DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles          DISABLE ROW LEVEL SECURITY;

-- ── PERMISSIONS ───────────────────────────────────────────────
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

-- ── AUTO PROFILE ON SIGNUP ────────────────────────────────────
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'Viewer')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ── SEED DATA ─────────────────────────────────────────────────
INSERT INTO consumable_categories (name) VALUES
  ('HQ'),('NQ'),('PQ'),('BQ'),('CORE BOX'),('RC-MATERIAL')
ON CONFLICT (name) DO NOTHING;

-- ============================================================
-- TAMAMLANDI
-- ============================================================
