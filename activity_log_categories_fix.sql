-- Quick fix if save says: Could not find the 'categories' column of 'activity_log'
-- Run in Supabase → SQL Editor → Run (safe to run more than once)

ALTER TABLE activity_log ADD COLUMN IF NOT EXISTS categories TEXT[];
ALTER TABLE activity_log ADD COLUMN IF NOT EXISTS started_at TIMESTAMPTZ;
ALTER TABLE activity_log ADD COLUMN IF NOT EXISTS ended_at TIMESTAMPTZ;
ALTER TABLE activity_log ADD COLUMN IF NOT EXISTS entry_source TEXT DEFAULT 'manual';

UPDATE activity_log SET categories = string_to_array(category, ', ')
  WHERE categories IS NULL AND category IS NOT NULL AND position(',' in category) > 0;
UPDATE activity_log SET categories = ARRAY[category]
  WHERE categories IS NULL AND category IS NOT NULL AND category <> '';

NOTIFY pgrst, 'reload schema';
