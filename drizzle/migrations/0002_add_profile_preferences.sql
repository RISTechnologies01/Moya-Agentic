ALTER TABLE public.profiles
  ADD COLUMN preferred_route text NOT NULL DEFAULT 'balanced',
  ADD COLUMN preferred_payout_method text NOT NULL DEFAULT 'Mobile money';