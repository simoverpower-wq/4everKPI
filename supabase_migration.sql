-- Run this in the Supabase SQL Editor for 4everKPI new features

-- ========== QUICK FIX: Results delete/edit not working ==========
-- Run this block first if deletes show an error in the app.

CREATE OR REPLACE FUNCTION delete_result_post(post_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE row result_posts%ROWTYPE;
BEGIN
  DELETE FROM result_posts WHERE id = post_id RETURNING * INTO row;
  IF NOT FOUND THEN RETURN NULL; END IF;
  RETURN to_jsonb(row);
END;
$$;

CREATE OR REPLACE FUNCTION update_result_post(
  post_id uuid,
  p_title text,
  p_result_type text,
  p_notes text,
  p_file_urls text[]
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE row result_posts%ROWTYPE;
BEGIN
  UPDATE result_posts SET
    title = p_title,
    result_type = p_result_type,
    notes = p_notes,
    file_urls = COALESCE(p_file_urls, '{}')
  WHERE id = post_id
  RETURNING * INTO row;
  IF NOT FOUND THEN RETURN NULL; END IF;
  RETURN to_jsonb(row);
END;
$$;

GRANT EXECUTE ON FUNCTION delete_result_post(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION update_result_post(uuid, text, text, text, text[]) TO anon, authenticated;

ALTER TABLE result_posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read result posts" ON result_posts;
DROP POLICY IF EXISTS "Anyone can insert result posts" ON result_posts;
DROP POLICY IF EXISTS "Users can delete own results or admins all" ON result_posts;
DROP POLICY IF EXISTS "Anyone can delete result posts" ON result_posts;
DROP POLICY IF EXISTS "Anyone can update result posts" ON result_posts;
CREATE POLICY "result_posts_select" ON result_posts FOR SELECT USING (true);
CREATE POLICY "result_posts_insert" ON result_posts FOR INSERT WITH CHECK (true);
CREATE POLICY "result_posts_update" ON result_posts FOR UPDATE USING (true);
CREATE POLICY "result_posts_delete" ON result_posts FOR DELETE USING (true);
GRANT ALL ON TABLE result_posts TO anon, authenticated;

-- ========== END QUICK FIX ==========

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
  file_urls TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- If you created result_posts earlier without file_urls, run this:
ALTER TABLE result_posts ADD COLUMN IF NOT EXISTS file_urls TEXT[] DEFAULT '{}';

ALTER TABLE result_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read result posts"
  ON result_posts FOR SELECT USING (true);

CREATE POLICY "Anyone can insert result posts"
  ON result_posts FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can delete own results or admins all" ON result_posts;
CREATE POLICY "Anyone can delete result posts"
  ON result_posts FOR DELETE USING (true);

DROP POLICY IF EXISTS "Anyone can update result posts" ON result_posts;
CREATE POLICY "Anyone can update result posts"
  ON result_posts FOR UPDATE USING (true);

GRANT ALL ON TABLE result_posts TO anon, authenticated;

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
