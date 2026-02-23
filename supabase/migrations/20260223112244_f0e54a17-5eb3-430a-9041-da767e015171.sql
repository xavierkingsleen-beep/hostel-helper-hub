
-- Add image_url column to complaints table
ALTER TABLE public.complaints ADD COLUMN image_url text DEFAULT NULL;

-- Create storage bucket for complaint images
INSERT INTO storage.buckets (id, name, public)
VALUES ('complaint-images', 'complaint-images', true);

-- Allow authenticated users to upload files to complaint-images bucket
CREATE POLICY "Authenticated users can upload complaint images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'complaint-images');

-- Allow authenticated users to view complaint images
CREATE POLICY "Authenticated users can view complaint images"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'complaint-images');

-- Allow public access to view complaint images (since bucket is public)
CREATE POLICY "Public can view complaint images"
ON storage.objects FOR SELECT
TO anon
USING (bucket_id = 'complaint-images');
