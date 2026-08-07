
-- Junction table: track_distributors
CREATE TABLE public.track_distributors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  track_id uuid NOT NULL REFERENCES public.tracks(id) ON DELETE CASCADE,
  distributor_id uuid NOT NULL REFERENCES public.distributors(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(track_id, distributor_id)
);
ALTER TABLE public.track_distributors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to track_distributors" ON public.track_distributors FOR ALL TO public USING (true) WITH CHECK (true);

-- Junction table: track_promotions
CREATE TABLE public.track_promotions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  track_id uuid NOT NULL REFERENCES public.tracks(id) ON DELETE CASCADE,
  promo_task_id uuid NOT NULL REFERENCES public.promo_tasks(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(track_id, promo_task_id)
);
ALTER TABLE public.track_promotions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to track_promotions" ON public.track_promotions FOR ALL TO public USING (true) WITH CHECK (true);

-- Add waveform_data column to tracks for storing peaks
ALTER TABLE public.tracks ADD COLUMN IF NOT EXISTS waveform_peaks jsonb DEFAULT '[]'::jsonb;
