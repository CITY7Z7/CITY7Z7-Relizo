
-- Add expanded track metadata columns
ALTER TABLE public.tracks
  ADD COLUMN IF NOT EXISTS album_artist text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS year integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS track_number integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS disc_number integer NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS publisher text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS composer text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS conductor text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS comment text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS grouping text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS audio_file_type text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS file_size bigint NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS channels text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS bitrate text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS sample_rate text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS loudness_level text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS encoder text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS play_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_played_at timestamp with time zone,
  ADD COLUMN IF NOT EXISTS musicians text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS additional_contributors text NOT NULL DEFAULT '';

-- Social links table for dashboard sidebar
CREATE TABLE IF NOT EXISTS public.social_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text NOT NULL,
  url text NOT NULL DEFAULT '',
  icon text NOT NULL DEFAULT '',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all access to social_links" ON public.social_links
  FOR ALL TO public USING (true) WITH CHECK (true);

-- Insert default social links
INSERT INTO public.social_links (platform, url, icon) VALUES
  ('Instagram', '', 'instagram'),
  ('X (Twitter)', '', 'twitter'),
  ('YouTube', '', 'youtube'),
  ('TikTok', '', 'tiktok'),
  ('Spotify', '', 'spotify'),
  ('SoundCloud', '', 'soundcloud');

-- Storage bucket for audio files
INSERT INTO storage.buckets (id, name, public) VALUES ('audio', 'audio', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policy for audio bucket
CREATE POLICY "Allow public read on audio" ON storage.objects
  FOR SELECT TO public USING (bucket_id = 'audio');

CREATE POLICY "Allow public upload to audio" ON storage.objects
  FOR INSERT TO public WITH CHECK (bucket_id = 'audio');

CREATE POLICY "Allow public update on audio" ON storage.objects
  FOR UPDATE TO public USING (bucket_id = 'audio');
