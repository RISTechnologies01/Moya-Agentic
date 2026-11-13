CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL DEFAULT '',
  phone text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read their own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE TABLE public.recipients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL,
  name text NOT NULL,
  country text NOT NULL DEFAULT 'Zimbabwe',
  city text NOT NULL DEFAULT 'Harare',
  payout_method text NOT NULL DEFAULT 'Mobile money',
  contact text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.recipients TO authenticated;
GRANT ALL ON public.recipients TO service_role;
ALTER TABLE public.recipients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage their own recipients" ON public.recipients FOR ALL TO authenticated USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);

CREATE TABLE public.transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL,
  recipient_id uuid REFERENCES public.recipients(id) ON DELETE SET NULL,
  recipient_name text NOT NULL,
  destination_country text NOT NULL DEFAULT 'Zimbabwe',
  destination_city text NOT NULL DEFAULT 'Harare',
  payout_method text NOT NULL DEFAULT 'Mobile money',
  amount numeric(14,2) NOT NULL CHECK (amount > 0),
  currency text NOT NULL DEFAULT 'ZAR',
  payout_amount numeric(14,2) NOT NULL CHECK (payout_amount >= 0),
  payout_currency text NOT NULL DEFAULT 'USD',
  transfer_fee numeric(14,2) NOT NULL DEFAULT 0 CHECK (transfer_fee >= 0),
  exchange_rate numeric(18,8) NOT NULL CHECK (exchange_rate > 0),
  provider text NOT NULL,
  settlement_minutes integer NOT NULL DEFAULT 60 CHECK (settlement_minutes > 0),
  status text NOT NULL DEFAULT 'Initiated' CHECK (status IN ('Initiated','Route selected','Processing','Settlement confirmed','Payout completed','Failed')),
  purpose_allocations jsonb NOT NULL DEFAULT '[]'::jsonb,
  proof_hash text,
  proof_network text,
  proof_mode text NOT NULL DEFAULT 'Simulation',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.transactions TO authenticated;
GRANT ALL ON public.transactions TO service_role;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage their own transactions" ON public.transactions FOR ALL TO authenticated USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);

CREATE TABLE public.purpose_allocations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id uuid NOT NULL REFERENCES public.transactions(id) ON DELETE CASCADE,
  owner_id uuid NOT NULL,
  label text NOT NULL,
  amount numeric(14,2) NOT NULL CHECK (amount >= 0),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.purpose_allocations TO authenticated;
GRANT ALL ON public.purpose_allocations TO service_role;
ALTER TABLE public.purpose_allocations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage their own purpose allocations" ON public.purpose_allocations FOR ALL TO authenticated USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);

CREATE OR REPLACE FUNCTION public.handle_new_moya_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (
    NEW.id,
    COALESCE(NULLIF(NEW.raw_user_meta_data ->> 'display_name', ''), NULLIF(NEW.raw_user_meta_data ->> 'full_name', ''), split_part(COALESCE(NEW.email, ''), '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_moya_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_moya_profile();