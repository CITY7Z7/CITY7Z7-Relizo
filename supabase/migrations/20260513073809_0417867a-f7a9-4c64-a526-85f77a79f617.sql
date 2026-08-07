
-- Drop existing permissive policies and recreate for authenticated role only
DO $$
DECLARE
  t text;
  tables text[] := ARRAY[
    'works','tracks','albums','album_tracks','releases','distributors',
    'promotion_channels','promo_tasks','production_tasks','production_subtasks',
    'track_relationships','social_links','track_audio_files',
    'track_distributors','track_promotions'
  ];
  pol record;
BEGIN
  FOREACH t IN ARRAY tables LOOP
    FOR pol IN SELECT policyname FROM pg_policies WHERE schemaname='public' AND tablename=t LOOP
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', pol.policyname, t);
    END LOOP;
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format($p$CREATE POLICY "Authenticated users can read %1$s" ON public.%1$I FOR SELECT TO authenticated USING (true)$p$, t);
    EXECUTE format($p$CREATE POLICY "Authenticated users can insert %1$s" ON public.%1$I FOR INSERT TO authenticated WITH CHECK (true)$p$, t);
    EXECUTE format($p$CREATE POLICY "Authenticated users can update %1$s" ON public.%1$I FOR UPDATE TO authenticated USING (true) WITH CHECK (true)$p$, t);
    EXECUTE format($p$CREATE POLICY "Authenticated users can delete %1$s" ON public.%1$I FOR DELETE TO authenticated USING (true)$p$, t);
  END LOOP;
END $$;

-- Make audio bucket private
UPDATE storage.buckets SET public = false WHERE id = 'audio';

-- Storage policies for audio bucket
DROP POLICY IF EXISTS "Audio public read" ON storage.objects;
DROP POLICY IF EXISTS "Audio public write" ON storage.objects;
DROP POLICY IF EXISTS "Audio public update" ON storage.objects;
DROP POLICY IF EXISTS "Audio public delete" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated read audio" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload audio" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated update audio" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated delete audio" ON storage.objects;

CREATE POLICY "Authenticated read audio" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'audio');
CREATE POLICY "Authenticated upload audio" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'audio');
CREATE POLICY "Authenticated update audio" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'audio') WITH CHECK (bucket_id = 'audio');
CREATE POLICY "Authenticated delete audio" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'audio');
