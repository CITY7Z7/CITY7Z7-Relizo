
-- Add missing columns to tracks table
ALTER TABLE public.tracks
  ADD COLUMN IF NOT EXISTS upc text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS release_type text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS release_date text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS id3_metadata text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS riff_metadata text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS track_notes text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS catalog_tags text NOT NULL DEFAULT '';

-- Create track_audio_files table for multiple audio formats
CREATE TABLE IF NOT EXISTS public.track_audio_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  track_id uuid NOT NULL REFERENCES public.tracks(id) ON DELETE CASCADE,
  file_url text NOT NULL DEFAULT '',
  file_format text NOT NULL DEFAULT '',
  file_size bigint NOT NULL DEFAULT 0,
  is_primary boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.track_audio_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all access to track_audio_files"
  ON public.track_audio_files
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);
