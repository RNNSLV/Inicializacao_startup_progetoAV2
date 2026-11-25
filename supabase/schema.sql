-- ============================================================================
-- AjeitaLar Fortaleza — Schema PostgreSQL + Supabase Auth + Row Level Security
-- Região: Fortaleza e Região Metropolitana (Ceará, Brasil)
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Tipos enumerados de domínio
CREATE TYPE public.user_role AS ENUM ('contractor', 'provider');

CREATE TYPE public.service_category AS ENUM (
  'faxina_completa',
  'limpeza_leve',
  'passadoria',
  'cozinha_diaria',
  'pos_obra',
  'cuidados_idosos'
);

CREATE TYPE public.work_shift AS ENUM ('manha', 'tarde', 'integral');

CREATE TYPE public.offer_status AS ENUM ('open', 'accepted', 'cancelled', 'completed');

CREATE TYPE public.booking_status AS ENUM ('confirmed', 'in_progress', 'completed', 'cancelled');

-- ----------------------------------------------------------------------------
-- 1. Perfis de Usuários (vinculados ao auth.users do Supabase)
-- ----------------------------------------------------------------------------
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.user_role NOT NULL,
  full_name TEXT NOT NULL CHECK (char_length(trim(full_name)) >= 3),
  phone_e164 TEXT NOT NULL UNIQUE CHECK (phone_e164 ~ '^\+5585[0-9]{8,9}$'),
  neighborhood TEXT NOT NULL CHECK (char_length(trim(neighborhood)) >= 2),
  bio TEXT DEFAULT '' NOT NULL,
  specialties public.service_category[] DEFAULT ARRAY['faxina_completa']::public.service_category[] NOT NULL,
  daily_rate_cents INTEGER CHECK (daily_rate_cents IS NULL OR daily_rate_cents >= 6000),
  is_available BOOLEAN DEFAULT TRUE NOT NULL,
  completed_services_count INTEGER DEFAULT 0 NOT NULL CHECK (completed_services_count >= 0),
  rating_average NUMERIC(3, 2) DEFAULT 5.00 NOT NULL CHECK (rating_average >= 1.00 AND rating_average <= 5.00),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL
);

CREATE INDEX idx_profiles_role_neighborhood
  ON public.profiles (role, neighborhood)
  WHERE is_available = TRUE;

CREATE INDEX idx_profiles_specialties
  ON public.profiles USING GIN (specialties);

-- ----------------------------------------------------------------------------
-- 2. Demandas / Ofertas de Serviço (Publicadas por Contratantes)
-- ----------------------------------------------------------------------------
CREATE TABLE public.service_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contractor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  category public.service_category NOT NULL,
  service_date DATE NOT NULL CHECK (service_date >= CURRENT_DATE),
  shift public.work_shift NOT NULL,
  offered_value_cents INTEGER NOT NULL CHECK (offered_value_cents >= 6000 AND offered_value_cents <= 200000),
  neighborhood TEXT NOT NULL CHECK (char_length(trim(neighborhood)) >= 2),
  address_reference TEXT DEFAULT '' NOT NULL,
  notes TEXT DEFAULT '' NOT NULL,
  status public.offer_status DEFAULT 'open' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL
);

CREATE INDEX idx_service_offers_status_neighborhood
  ON public.service_offers (status, neighborhood, service_date);

CREATE INDEX idx_service_offers_contractor
  ON public.service_offers (contractor_id, created_at DESC);

-- ----------------------------------------------------------------------------
-- 3. Agendamentos (Bookings entre Contratante e Prestadora)
-- ----------------------------------------------------------------------------
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  offer_id UUID REFERENCES public.service_offers(id) ON DELETE SET NULL,
  contractor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  category public.service_category NOT NULL,
  service_date DATE NOT NULL,
  shift public.work_shift NOT NULL,
  neighborhood TEXT NOT NULL,
  agreed_value_cents INTEGER NOT NULL CHECK (agreed_value_cents >= 6000),
  status public.booking_status DEFAULT 'confirmed' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL,
  CONSTRAINT bookings_distinct_participants CHECK (contractor_id <> provider_id)
);

CREATE INDEX idx_bookings_contractor ON public.bookings (contractor_id, service_date DESC);
CREATE INDEX idx_bookings_provider ON public.bookings (provider_id, service_date DESC);

-- ----------------------------------------------------------------------------
-- 4. Triggers de atualização automática de timestamp
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = timezone('utc', now());
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trg_service_offers_updated_at
  BEFORE UPDATE ON public.service_offers
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trg_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ----------------------------------------------------------------------------
-- 5. Segurança: Row Level Security (RLS)
-- ----------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- PROFILES: usuário lê o próprio perfil ou perfis de prestadoras disponíveis
CREATE POLICY "profiles_select_own_or_available_providers"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (
    auth.uid() = id
    OR (role = 'provider' AND is_available = TRUE)
  );

CREATE POLICY "profiles_insert_own"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- SERVICE OFFERS: contratante vê suas demandas; prestadoras veem demandas abertas
CREATE POLICY "offers_select_open_or_owner"
  ON public.service_offers FOR SELECT
  TO authenticated
  USING (
    contractor_id = auth.uid()
    OR status = 'open'
  );

CREATE POLICY "offers_insert_contractor_only"
  ON public.service_offers FOR INSERT
  TO authenticated
  WITH CHECK (
    contractor_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'contractor'
    )
  );

CREATE POLICY "offers_update_owner_or_accepting_provider"
  ON public.service_offers FOR UPDATE
  TO authenticated
  USING (
    contractor_id = auth.uid()
    OR (
      status = 'open'
      AND EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.id = auth.uid() AND p.role = 'provider'
      )
    )
  )
  WITH CHECK (
    contractor_id = auth.uid()
    OR status = 'accepted'
  );

-- BOOKINGS: apenas participantes (contratante ou prestadora) acessam seus agendamentos
CREATE POLICY "bookings_select_participants"
  ON public.bookings FOR SELECT
  TO authenticated
  USING (contractor_id = auth.uid() OR provider_id = auth.uid());

CREATE POLICY "bookings_insert_participants"
  ON public.bookings FOR INSERT
  TO authenticated
  WITH CHECK (contractor_id = auth.uid() OR provider_id = auth.uid());

CREATE POLICY "bookings_update_participants"
  ON public.bookings FOR UPDATE
  TO authenticated
  USING (contractor_id = auth.uid() OR provider_id = auth.uid())
  WITH CHECK (contractor_id = auth.uid() OR provider_id = auth.uid());
