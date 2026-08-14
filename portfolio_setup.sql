-- 1. Create Portfolio Table
CREATE TABLE public.portfolios (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  artist_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  image_url text NOT NULL,
  work_type text NOT NULL CHECK (work_type IN ('portfolio', 'flash')),
  tattoo_style text,
  is_available boolean DEFAULT true,
  is_published boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.portfolios ADD CONSTRAINT portfolios_artist_id_fkey FOREIGN KEY (artist_id) REFERENCES public.artists(id) ON DELETE CASCADE;

-- Enable RLS
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;

-- Policy 1: Public can view published portfolios
CREATE POLICY "Public can view published portfolios" ON public.portfolios
  FOR SELECT
  USING (is_published = true);

-- Policy 2: Admins can do anything
CREATE POLICY "Admins can manage all portfolios" ON public.portfolios
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Policy 3: Artists can manage their own portfolios
CREATE POLICY "Artists can manage own portfolios" ON public.portfolios
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.artists
      WHERE artists.id = portfolios.artist_id AND artists.profile_id = auth.uid()
    )
  );

-- Policy 4: Allow artists to view their own unpublished portfolios
CREATE POLICY "Artists can view own unpublished portfolios" ON public.portfolios
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.artists
      WHERE artists.id = portfolios.artist_id AND artists.profile_id = auth.uid()
    )
  );


-- 2. Create Storage Bucket for Portfolio Images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('portfolio-images', 'portfolio-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS Policies
-- Allow public to read
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT USING (bucket_id = 'portfolio-images');

-- Allow authenticated to insert
CREATE POLICY "Auth Insert" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'portfolio-images' AND auth.role() = 'authenticated'
  );

CREATE POLICY "Auth Update" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'portfolio-images' AND auth.role() = 'authenticated'
  );

CREATE POLICY "Auth Delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'portfolio-images' AND auth.role() = 'authenticated'
  );
