-- Run this ONCE in Supabase → SQL Editor → Run
-- Fixes: "Run supabase_migration.sql for activity_log table" when saving Daily Log entries

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

-- Multi-area tags (optional if table already exists without this column)
ALTER TABLE activity_log ADD COLUMN IF NOT EXISTS categories TEXT[];
UPDATE activity_log SET categories = string_to_array(category, ', ')
  WHERE categories IS NULL AND category IS NOT NULL AND position(',' in category) > 0;
UPDATE activity_log SET categories = ARRAY[category]
  WHERE categories IS NULL AND category IS NOT NULL AND category <> '';

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE activity_log;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
