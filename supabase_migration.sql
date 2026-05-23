-- Run this in the Supabase SQL Editor for 4everKPI new features

-- Feedback submissions (sidebar feedback button)
CREATE TABLE IF NOT EXISTS feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id UUID REFERENCES members(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can insert feedback"
  ON feedback FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can read feedback"
  ON feedback FOR SELECT
  USING (true);

-- Role category notes (task library Notes button)
CREATE TABLE IF NOT EXISTS role_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  role_name TEXT NOT NULL UNIQUE,
  content TEXT DEFAULT '',
  updated_by UUID REFERENCES members(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE role_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read role notes"
  ON role_notes FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert role notes"
  ON role_notes FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update role notes"
  ON role_notes FOR UPDATE
  USING (true);

-- Enable realtime for role notes (optional)
ALTER PUBLICATION supabase_realtime ADD TABLE role_notes;

-- Results board (screenshots & proof uploads)
CREATE TABLE IF NOT EXISTS result_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id UUID REFERENCES members(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  result_type TEXT,
  notes TEXT,
  files JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE result_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read result posts"
  ON result_posts FOR SELECT USING (true);

CREATE POLICY "Anyone can insert result posts"
  ON result_posts FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can delete own results or admins all"
  ON result_posts FOR DELETE USING (true);

-- Storage bucket for result file uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('result-files', 'result-files', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Anyone can upload result files"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'result-files');

CREATE POLICY "Anyone can read result files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'result-files');

CREATE POLICY "Anyone can delete result files"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'result-files');
