-- Run this in the Supabase SQL Editor for 4everKPI new features

-- ========== QUICK FIX: Inactive member toggle "Error saving" ==========
-- Run this if marking a member Inactive fails in the app.

ALTER TABLE members ADD COLUMN IF NOT EXISTS is_inactive BOOLEAN DEFAULT false;
UPDATE members SET is_inactive = false WHERE is_inactive IS NULL;

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

-- Trash & recovery bin
CREATE TABLE IF NOT EXISTS trash_bin (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  item_type TEXT NOT NULL CHECK (item_type IN ('task', 'member', 'result')),
  item_id UUID NOT NULL,
  title TEXT,
  payload JSONB NOT NULL,
  deleted_by UUID REFERENCES members(id) ON DELETE SET NULL,
  deleted_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE trash_bin ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "trash_select" ON trash_bin;
DROP POLICY IF EXISTS "trash_insert" ON trash_bin;
DROP POLICY IF EXISTS "trash_delete" ON trash_bin;
CREATE POLICY "trash_select" ON trash_bin FOR SELECT USING (true);
CREATE POLICY "trash_insert" ON trash_bin FOR INSERT WITH CHECK (true);
CREATE POLICY "trash_delete" ON trash_bin FOR DELETE USING (true);
GRANT ALL ON TABLE trash_bin TO anon, authenticated;

CREATE OR REPLACE FUNCTION move_to_trash(
  p_type text,
  p_id uuid,
  p_payload jsonb,
  p_title text,
  p_deleted_by uuid DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE row trash_bin%ROWTYPE;
BEGIN
  INSERT INTO trash_bin (item_type, item_id, title, payload, deleted_by)
  VALUES (p_type, p_id, p_title, p_payload, p_deleted_by)
  RETURNING * INTO row;

  IF p_type = 'task' THEN
    DELETE FROM task_history WHERE task_id = p_id;
    DELETE FROM tasks WHERE id = p_id;
  ELSIF p_type = 'result' THEN
    DELETE FROM result_posts WHERE id = p_id;
  ELSIF p_type = 'member' THEN
    DELETE FROM members WHERE id = p_id;
  END IF;

  RETURN to_jsonb(row);
END;
$$;

CREATE OR REPLACE FUNCTION restore_from_trash(p_trash_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE t trash_bin%ROWTYPE; p jsonb;
BEGIN
  SELECT * INTO t FROM trash_bin WHERE id = p_trash_id;
  IF NOT FOUND THEN RETURN NULL; END IF;
  p := t.payload;

  IF t.item_type = 'task' THEN
    INSERT INTO tasks SELECT * FROM jsonb_populate_record(null::tasks, p);
  ELSIF t.item_type = 'result' THEN
    INSERT INTO result_posts SELECT * FROM jsonb_populate_record(null::result_posts, p);
  ELSIF t.item_type = 'member' THEN
    INSERT INTO members SELECT * FROM jsonb_populate_record(null::members, p);
  END IF;

  DELETE FROM trash_bin WHERE id = p_trash_id;
  RETURN to_jsonb(t);
END;
$$;

CREATE OR REPLACE FUNCTION purge_from_trash(p_trash_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE t trash_bin%ROWTYPE;
BEGIN
  DELETE FROM trash_bin WHERE id = p_trash_id RETURNING * INTO t;
  IF NOT FOUND THEN RETURN NULL; END IF;
  RETURN to_jsonb(t);
END;
$$;

GRANT EXECUTE ON FUNCTION move_to_trash(text, uuid, jsonb, text, uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION restore_from_trash(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION purge_from_trash(uuid) TO anon, authenticated;

-- Task history timestamps (accurate edit times)
ALTER TABLE task_history ADD COLUMN IF NOT EXISTS changed_at TIMESTAMPTZ DEFAULT now();
UPDATE task_history SET changed_at = now() WHERE changed_at IS NULL;

-- Task scheduling: default start time + per-day overrides for recurring tasks
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS scheduled_start_time TEXT;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS recur_overrides JSONB DEFAULT '{}'::jsonb;
UPDATE tasks SET recur_overrides = '{}'::jsonb WHERE recur_overrides IS NULL;

-- Short custom label for Daily profiles (defaults to task type when empty)
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS display_name TEXT;

-- Wipe all agency data (keeps members — admin button in app)
CREATE OR REPLACE FUNCTION wipe_agency_data()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM task_history;
  DELETE FROM tasks;
  DELETE FROM activity_log;
  DELETE FROM result_posts;
  DELETE FROM feedback;
  DELETE FROM role_notes;
  DELETE FROM trash_bin;
  DELETE FROM settings WHERE key = 'agency_prefs';
  RETURN jsonb_build_object('ok', true, 'wiped_at', now());
END;
$$;

-- Per-user preferences: accent theme, activity presets, etc.
ALTER TABLE members ADD COLUMN IF NOT EXISTS prefs JSONB DEFAULT '{}'::jsonb;
UPDATE members SET prefs = '{}'::jsonb WHERE prefs IS NULL;

GRANT EXECUTE ON FUNCTION wipe_agency_data() TO anon, authenticated;

-- Inactive members: not yet tracking KPIs (excluded from pulse, insights, oversight warnings)
ALTER TABLE members ADD COLUMN IF NOT EXISTS is_inactive BOOLEAN DEFAULT false;
UPDATE members SET is_inactive = false WHERE is_inactive IS NULL;
CREATE OR REPLACE FUNCTION wipe_test_data_keep_results()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE kept_results integer;
BEGIN
  DELETE FROM task_history;
  DELETE FROM tasks;
  DELETE FROM feedback;
  DELETE FROM role_notes;
  DELETE FROM trash_bin;
  SELECT COUNT(*) INTO kept_results FROM result_posts;
  DELETE FROM settings WHERE key = 'agency_prefs';
  RETURN jsonb_build_object('ok', true, 'kept_results', kept_results, 'wiped_at', now());
END;
$$;

GRANT EXECUTE ON FUNCTION wipe_test_data_keep_results() TO anon, authenticated;

-- Daily work log notes (what actually happened — separate from blockers/follow-ups in notes)
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS work_notes TEXT;

-- ========== Daily activity log (backward-looking progress reports) ==========
CREATE TABLE IF NOT EXISTS activity_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  time_spent TEXT,
  time_minutes INTEGER,
  category TEXT,
  categories TEXT[],
  log_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS activity_log_member_date ON activity_log (member_id, log_date DESC);
CREATE INDEX IF NOT EXISTS activity_log_created ON activity_log (created_at DESC);

ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "activity_log_select" ON activity_log;
DROP POLICY IF EXISTS "activity_log_insert" ON activity_log;
DROP POLICY IF EXISTS "activity_log_update" ON activity_log;
DROP POLICY IF EXISTS "activity_log_delete" ON activity_log;

CREATE POLICY "activity_log_select" ON activity_log FOR SELECT USING (true);
CREATE POLICY "activity_log_insert" ON activity_log FOR INSERT WITH CHECK (true);
CREATE POLICY "activity_log_update" ON activity_log FOR UPDATE USING (true);
CREATE POLICY "activity_log_delete" ON activity_log FOR DELETE USING (true);

GRANT ALL ON TABLE activity_log TO anon, authenticated;

-- Realtime (skip if already added: ignore duplicate-table error)
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE activity_log;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Update wipe to include activity_log (run after table exists)
CREATE OR REPLACE FUNCTION wipe_agency_data()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM task_history;
  DELETE FROM tasks;
  DELETE FROM activity_timers;
  DELETE FROM activity_log;
  DELETE FROM member_outcomes;
  DELETE FROM result_posts;
  DELETE FROM feedback;
  DELETE FROM role_notes;
  DELETE FROM trash_bin;
  DELETE FROM settings WHERE key = 'agency_prefs';
  RETURN jsonb_build_object('ok', true, 'wiped_at', now());
END;
$$;

-- Timers, outcomes, start/end on activity_log: run timers_outcomes_migration.sql in SQL Editor
