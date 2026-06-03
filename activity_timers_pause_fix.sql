-- Run if Pause/Resume does not stick after refresh (missing columns or UPDATE policy)
-- Safe to run more than once

ALTER TABLE activity_timers ADD COLUMN IF NOT EXISTS accumulated_ms INTEGER NOT NULL DEFAULT 0;
ALTER TABLE activity_timers ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'running';

DROP POLICY IF EXISTS "activity_timers_update" ON activity_timers;
CREATE POLICY "activity_timers_update" ON activity_timers FOR UPDATE USING (true);

NOTIFY pgrst, 'reload schema';
