
-- Create a public storage bucket for destination images
INSERT INTO storage.buckets (id, name, public) VALUES ('destination-images', 'destination-images', true);

-- Allow anyone to view images
CREATE POLICY "Public read access" ON storage.objects FOR SELECT USING (bucket_id = 'destination-images');

-- Allow admins to upload images
CREATE POLICY "Admins can upload images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (
  bucket_id = 'destination-images' AND public.has_role(auth.uid(), 'admin')
);

-- Allow admins to delete images
CREATE POLICY "Admins can delete images" ON storage.objects FOR DELETE TO authenticated USING (
  bucket_id = 'destination-images' AND public.has_role(auth.uid(), 'admin')
);
