
-- Create enums
CREATE TYPE public.track_status AS ENUM ('Draft', 'Scheduled', 'Submitted', 'Ready', 'Released');
CREATE TYPE public.track_type AS ENUM ('Original', 'Remix', 'VIP Remix', 'Edit', 'Extended Mix', 'Radio Edit', 'Instrumental', 'Acapella', 'Live');
CREATE TYPE public.relationship_type AS ENUM ('remix_of', 'cover_of', 'sampled_from', 'interpolation_of');
CREATE TYPE public.release_type AS ENUM ('Album', 'EP', 'Single');
CREATE TYPE public.production_phase AS ENUM ('writing', 'recording', 'mixing', 'mastering', 'review');
CREATE TYPE public.subtask_type AS ENUM ('production', 'release_prep', 'marketing', 'distribution');

-- Works table
CREATE TABLE public.works (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  composer TEXT NOT NULL DEFAULT '',
  lyricist TEXT NOT NULL DEFAULT '',
  publisher TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tracks table
CREATE TABLE public.tracks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  work_id UUID REFERENCES public.works(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  version_name TEXT NOT NULL DEFAULT '',
  track_type public.track_type NOT NULL DEFAULT 'Original',
  parent_track_id UUID REFERENCES public.tracks(id) ON DELETE SET NULL,
  remixer_artist TEXT NOT NULL DEFAULT '',
  artist TEXT NOT NULL,
  featured_artists TEXT NOT NULL DEFAULT '',
  genre TEXT NOT NULL DEFAULT '',
  subgenre TEXT NOT NULL DEFAULT '',
  bpm INTEGER NOT NULL DEFAULT 0,
  musical_key TEXT NOT NULL DEFAULT '',
  duration TEXT NOT NULL DEFAULT '',
  isrc TEXT NOT NULL DEFAULT '',
  language TEXT NOT NULL DEFAULT '',
  explicit_flag BOOLEAN NOT NULL DEFAULT false,
  audio_file TEXT,
  cover_art TEXT,
  description TEXT NOT NULL DEFAULT '',
  lyrics TEXT NOT NULL DEFAULT '',
  status public.track_status NOT NULL DEFAULT 'Draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Track relationships
CREATE TABLE public.track_relationships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source_track_id UUID NOT NULL REFERENCES public.tracks(id) ON DELETE CASCADE,
  target_track_id UUID NOT NULL REFERENCES public.tracks(id) ON DELETE CASCADE,
  relationship_type public.relationship_type NOT NULL,
  notes TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Albums
CREATE TABLE public.albums (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  release_type public.release_type NOT NULL DEFAULT 'Album',
  release_date TEXT NOT NULL DEFAULT '',
  label TEXT NOT NULL DEFAULT '',
  catalog_number TEXT NOT NULL DEFAULT '',
  upc TEXT NOT NULL DEFAULT '',
  cover_art TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Album tracks (join table)
CREATE TABLE public.album_tracks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  album_id UUID NOT NULL REFERENCES public.albums(id) ON DELETE CASCADE,
  track_id UUID NOT NULL REFERENCES public.tracks(id) ON DELETE CASCADE,
  track_number INTEGER NOT NULL DEFAULT 1,
  UNIQUE(album_id, track_id)
);

-- Releases
CREATE TABLE public.releases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'track',
  reference_id TEXT NOT NULL DEFAULT '',
  planned_release_date TEXT NOT NULL DEFAULT '',
  distributor_submission_date TEXT NOT NULL DEFAULT '',
  marketing_start_date TEXT NOT NULL DEFAULT '',
  status public.track_status NOT NULL DEFAULT 'Draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Distributors
CREATE TABLE public.distributors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  contact_email TEXT NOT NULL DEFAULT '',
  submission_format TEXT NOT NULL DEFAULT '',
  delivery_method TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  distribution_status TEXT NOT NULL DEFAULT 'Active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Promotion channels
CREATE TABLE public.promotion_channels (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  platform TEXT NOT NULL,
  contact_person TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Promo tasks
CREATE TABLE public.promo_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_name TEXT NOT NULL,
  track_or_album TEXT NOT NULL DEFAULT '',
  platform TEXT NOT NULL DEFAULT '',
  scheduled_date TEXT NOT NULL DEFAULT '',
  content_type TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'Draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Production tasks
CREATE TABLE public.production_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  track_title TEXT NOT NULL DEFAULT '',
  release_id UUID REFERENCES public.releases(id) ON DELETE SET NULL,
  phase public.production_phase NOT NULL DEFAULT 'writing',
  start_date TEXT NOT NULL DEFAULT '',
  end_date TEXT NOT NULL DEFAULT '',
  progress INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Production subtasks
CREATE TABLE public.production_subtasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  production_task_id UUID NOT NULL REFERENCES public.production_tasks(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  start_date TEXT NOT NULL DEFAULT '',
  end_date TEXT NOT NULL DEFAULT '',
  type public.subtask_type NOT NULL DEFAULT 'production',
  completed BOOLEAN NOT NULL DEFAULT false
);

-- Enable RLS on all tables
ALTER TABLE public.works ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.track_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.album_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.releases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.distributors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotion_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promo_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.production_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.production_subtasks ENABLE ROW LEVEL SECURITY;

-- Public access policies (no auth required for this app)
CREATE POLICY "Allow all access to works" ON public.works FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to tracks" ON public.tracks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to track_relationships" ON public.track_relationships FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to albums" ON public.albums FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to album_tracks" ON public.album_tracks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to releases" ON public.releases FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to distributors" ON public.distributors FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to promotion_channels" ON public.promotion_channels FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to promo_tasks" ON public.promo_tasks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to production_tasks" ON public.production_tasks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to production_subtasks" ON public.production_subtasks FOR ALL USING (true) WITH CHECK (true);

-- Timestamp trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for updated_at
CREATE TRIGGER update_works_updated_at BEFORE UPDATE ON public.works FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_tracks_updated_at BEFORE UPDATE ON public.tracks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_albums_updated_at BEFORE UPDATE ON public.albums FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_releases_updated_at BEFORE UPDATE ON public.releases FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_production_tasks_updated_at BEFORE UPDATE ON public.production_tasks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes
CREATE INDEX idx_tracks_work_id ON public.tracks(work_id);
CREATE INDEX idx_tracks_parent_track_id ON public.tracks(parent_track_id);
CREATE INDEX idx_tracks_status ON public.tracks(status);
CREATE INDEX idx_album_tracks_album_id ON public.album_tracks(album_id);
CREATE INDEX idx_album_tracks_track_id ON public.album_tracks(track_id);
CREATE INDEX idx_track_relationships_source ON public.track_relationships(source_track_id);
CREATE INDEX idx_track_relationships_target ON public.track_relationships(target_track_id);
CREATE INDEX idx_production_subtasks_task ON public.production_subtasks(production_task_id);
