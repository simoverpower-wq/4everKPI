-- Run once in Supabase → SQL Editor (after activity_log exists)
-- Adds: start/end times on activity log, live timers, member outcomes (non-time metrics)

-- 1) Activity log: multi-category tags + start/end times
ALTER TABLE activity_log ADD COLUMN IF NOT EXISTS categories TEXT[];
ALTER TABLE activity_log ADD COLUMN IF NOT EXISTS started_at TIMESTAMPTZ;
ALTER TABLE activity_log ADD COLUMN IF NOT EXISTS ended_at TIMESTAMPTZ;
ALTER TABLE activity_log ADD COLUMN IF NOT EXISTS entry_source TEXT DEFAULT 'manual';

UPDATE activity_log SET categories = string_to_array(category, ', ')
  WHERE categories IS NULL AND category IS NOT NULL AND position(',' in category) > 0;
UPDATE activity_log SET categories = ARRAY[category]
  WHERE categories IS NULL AND category IS NOT NULL AND category <> '';

-- Refresh API schema (Supabase usually picks this up within seconds)
NOTIFY pgrst, 'reload schema';

-- 2) Running timers (multiple per operator)
CREATE TABLE IF NOT EXISTS activity_timers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  category TEXT,
  categories TEXT[],
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  log_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS activity_timers_member ON activity_timers (member_id);
CREATE INDEX IF NOT EXISTS activity_timers_started ON activity_timers (started_at DESC);

ALTER TABLE activity_timers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "activity_timers_select" ON activity_timers;
DROP POLICY IF EXISTS "activity_timers_insert" ON activity_timers;
DROP POLICY IF EXISTS "activity_timers_delete" ON activity_timers;

CREATE POLICY "activity_timers_select" ON activity_timers FOR SELECT USING (true);
CREATE POLICY "activity_timers_insert" ON activity_timers FOR INSERT WITH CHECK (true);
CREATE POLICY "activity_timers_delete" ON activity_timers FOR DELETE USING (true);

GRANT ALL ON TABLE activity_timers TO anon, authenticated;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE activity_timers;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 3) Outcomes (impressions, leads, etc. — not time)
CREATE TABLE IF NOT EXISTS member_outcomes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  value_text TEXT NOT NULL,
  outcome_date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS member_outcomes_member_date ON member_outcomes (member_id, outcome_date DESC);

ALTER TABLE member_outcomes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "member_outcomes_select" ON member_outcomes;
DROP POLICY IF EXISTS "member_outcomes_insert" ON member_outcomes;
DROP POLICY IF EXISTS "member_outcomes_update" ON member_outcomes;
DROP POLICY IF EXISTS "member_outcomes_delete" ON member_outcomes;

CREATE POLICY "member_outcomes_select" ON member_outcomes FOR SELECT USING (true);
CREATE POLICY "member_outcomes_insert" ON member_outcomes FOR INSERT WITH CHECK (true);
CREATE POLICY "member_outcomes_update" ON member_outcomes FOR UPDATE USING (true);
CREATE POLICY "member_outcomes_delete" ON member_outcomes FOR DELETE USING (true);

GRANT ALL ON TABLE member_outcomes TO anon, authenticated;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE member_outcomes;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
