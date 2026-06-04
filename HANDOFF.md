# 4everKPI — Handoff & operations guide

Use this document when onboarding a new owner, developer, or operator. It summarizes what the app is, how it is built, how to deploy it, and what changed in recent Daily Log work.

**Current app version:** `20260527.71` (shown on Daily Log as `v20260527.71`)

---

## Table of contents

1. [What the app is](#1-what-the-app-is)
2. [Tech stack](#2-tech-stack)
3. [Repository files](#3-repository-files)
4. [Roles and permissions](#4-roles-and-permissions)
5. [Daily Log (primary product)](#5-daily-log-primary-product)
6. [Tools drawer (legacy KPI features)](#6-tools-drawer-legacy-kpi-features)
7. [Supabase setup](#7-supabase-setup)
8. [Deployment and caching](#8-deployment-and-caching)
9. [Recent fixes and changes](#9-recent-fixes-and-changes)
10. [localStorage keys](#10-localstorage-keys)
11. [Operational checklist](#11-operational-checklist)
12. [Developer quick reference](#12-developer-quick-reference)

---

## 1. What the app is

**4everKPI** is a single-page web app for **one agency** to track operations: tasks, time, outcomes, and team performance. It is not multi-tenant SaaS — one Supabase project, one Vercel deploy, one team.

**Primary workflow:** **Daily Log** (default sidebar page). The older task dashboard, charts, calendar, and admin tools still exist under **Tools** so Daily Log stays focused (`simpleNavMode` in `app.js`).

**Positioning (login screen):** “Agency operations, measured.” **Lyra** (AI persona) is mentioned on login as a future roadmap item — not implemented in code yet.

---

## 2. Tech stack

| Layer | Detail |
|--------|--------|
| Frontend | Vanilla HTML, CSS, JavaScript (`app.js` ~5k lines) |
| Backend | [Supabase](https://supabase.com) — Postgres, REST API, Realtime |
| Hosting | GitHub → **Vercel** (static deploy, no build step) |
| CDN | Supabase JS 2.49.8, Chart.js 4.4.1, DM Sans font |

**Supabase (configured in repo):**

- Project URL: `https://wqtenvjtuxvdoaechyjh.supabase.co`
- **Publishable (anon) key** is in `app.js` and `index.html` — intended for client-side use with Row Level Security (RLS).
- **Never** commit or embed the **service role** key in frontend files.

---

## 3. Repository files

| File | Purpose |
|------|---------|
| `index.html` | UI structure, login boot roster, all modals, Daily Log layout |
| `app.js` | All application logic |
| `style.css` | Styling |
| `icon.png` | Favicon / brand |
| `vercel.json` | Cache-Control headers (no-cache on HTML/JS/CSS) |
| `supabase_migration.sql` | Full base schema (members, tasks, results, trash, activity_log, RPCs, etc.) |
| `activity_log_setup.sql` | Minimal `activity_log` table + RLS if adding only activity logging |
| `timers_outcomes_migration.sql` | **Required for Daily Log v2** — categories array, start/end times, timers, outcomes |
| `activity_log_categories_fix.sql` | Quick fix: missing `categories` column error |
| `activity_timers_pause_fix.sql` | Quick fix: timer Pause/Resume not persisting (columns + UPDATE policy) |
| `HANDOFF.md` | This document |

---

## 4. Roles and permissions

### Login flow

1. User selects **name** from roster.
2. User enters **4-digit PIN**.
3. App loads member data, tasks, activity log, etc.

**Notes:**

- Everyone with a member record can sign in at the login screen.
- **Inactive** status affects KPI tracking after login, not whether the name appears on login.
- Login uses REST fallbacks and boot HTML so the roster does not hang on “Loading your team…”

### After login

| Role | How it is set | Typical powers |
|------|----------------|----------------|
| **Team member** | Default | Own tasks and activity log; nav limited by per-member access |
| **Admin** | `is_admin` on member row | Add members, read feedback, wipe agency data, assign overseer |
| **Agency overseer** | `overseerId` in settings / localStorage | Log activity for **any** member; sees all `activity_log` rows; team board on Daily Log |

**Overseer** = member whose ID matches `getOverseerId()`. Can be set or transferred from the sidebar (admin).

**Per-member navigation:** `memberNavAccess` controls which Tools pages appear. New members default to Daily Log + minimal Tools access.

---

## 5. Daily Log (primary product)

### Page sections (top to bottom)

1. **Header** — date navigation, **Copy summary**, **+ Add activity**
2. **Setup banner** — shown if `activity_log` is not connected; offers SQL copy + retry
3. **Overseer team board** — switch which member’s log you are editing (overseer only)
4. **Timers bar** — active/paused timers with Pause, Resume, Log time
5. **Today totals** — time by category for the day; optional **This week** view
6. **Day notes** — collapsible textarea (10 rows, auto-saves per member per day)
7. **Results / outcomes** — collapsible non-time metrics (impressions, leads, etc.)
8. **Activity list** — entries for the day; tap to edit; Edit / Delete per row
9. **Quick start presets** — shared team presets; **Manage presets** modal
10. **Composer** — task description, start time, duration, categories, date, save/update, start timer

### Activity log fields (`activity_log` table)

| Field | Purpose |
|-------|---------|
| `member_id` | Who the work is for |
| `description` | Full task / activity description |
| `log_date` | Calendar day of the entry |
| `time_minutes` | Duration in minutes |
| `time_spent` | Human-readable duration string |
| `category` | Legacy single category string |
| `categories` | Preferred: `TEXT[]` of category tags |
| `started_at` / `ended_at` | Clock range (ISO timestamps) |
| `entry_source` | `'manual'` or `'timer'` |

**Data loading:**

- **Overseer:** all members’ activity log rows.
- **Non-overseer:** only their own rows.
- Offline fallback: `localStorage` keys `4k_alog_team` or `4k_alog_{memberId}`; syncs to Supabase when possible.

### Live timers (`activity_timers` table)

| Action | Behavior |
|--------|----------|
| **Start timer** | Creates row in `activity_timers` from composer |
| **Pause** | Saves `accumulated_ms`, sets `status = 'paused'` |
| **Resume** | New `started_at`, continues from accumulated time |
| **Log time** | Writes entry to `activity_log`, removes timer row |

`stopActivityTimer()` still exists in code and calls **Log time** (backward compatibility).

**Database requirements:** `accumulated_ms`, `status`, and RLS **UPDATE** policy on `activity_timers`. See `timers_outcomes_migration.sql` or `activity_timers_pause_fix.sql`.

### Categories

- Tap bubble to select for current entry.
- **×** on a bubble removes that category from the **global team list** (does not change old log entries).
- Add new categories via “New category…” + **Add category**.

### Copy summary (for iMessage / plain text)

**Button:** **Copy summary** → modal with editable text, Copy, Download `.txt`.

**Header example:**

```
Daily log — Wednesday, June 3, 2026
3 entries · 4 hrs total
```

**Each entry (newest first):**

```
• Watched chatter, took notes, made SOP on retention -- 4:30pm ~ 4:55pm (25 mins) -- [CHATTING]

• Posted OF walls -- 3:10pm ~ 3:25pm (15 mins) -- [CONTENT]
```

**Rules:**

| Rule | Detail |
|------|--------|
| Task name | Full text first — **no truncation** in copy |
| Time block | `-- start ~ end (duration) --` with lowercase `am/pm` |
| Duration | In parentheses inside the time block, e.g. `(25 mins)` |
| Category | At end in `[ALL CAPS]`; multiple: `[CHATTING, ADMIN]` |
| Formatting | Bullet `•` per entry; **blank line** between entries; plain text only |
| On-screen list | May differ from copy (uses `activityTimeLabel` for display) |

**Code location:** `formatExportTimeRange`, `formatExportDuration`, `formatActivityExportLine`, `formatDailyLogExportSummary` in `app.js`.

### Delete confirmations

Destructive actions use the in-app **`ConfirmM`** modal (not the browser’s `confirm()` dialog). This avoids a macOS/Safari bug where deletes stop working after the first browser confirm.

Deletes are **optimistic**: UI updates immediately; rolls back with an error toast if Supabase fails.

---

## 6. Tools drawer (legacy KPI features)

Open via sidebar **Tools**. Pages are grouped:

### Overview

- **Dashboard** — agency pulse, KPI cards, insights, team grid
- **Performance** — charts (completion, time, late, results, trends)
- **Compare** — head-to-head member stats
- **Results** — logged results with proof uploads

### Tasks

- **Log task** — assign new tasks
- **Tasks** — personal task list for the day
- **Task log** — team activity feed
- **Daily profiles** — per-person day grid (check off, versions, clear day)
- **Calendar** — month view

### Team

- **Task library** — role/task bubbles
- **Role guides** — who does what
- **Add member** — roster admin
- **Oversight** — admin oversight panel
- **Intelligence** — agency intelligence suggestions

### Admin

- **Trash** — restore deleted tasks, results, members
- **Erase all data** — type `ERASE`; clears tasks and agency data; **keeps member accounts**

Archived tool pages show a banner with a link back to Daily Log.

---

## 7. Supabase setup

### Recommended run order

| Step | File | When |
|------|------|------|
| 1 | `supabase_migration.sql` | New or empty project needing full schema |
| 2 | `activity_log_setup.sql` | Only need activity log on existing project |
| 3 | `timers_outcomes_migration.sql` | **Required** for timers, pause/resume, outcomes, multi-category, start/end times |
| 4 | `activity_log_categories_fix.sql` | Error: `Could not find the 'categories' column` |
| 5 | `activity_timers_pause_fix.sql` | Pause/Resume does not survive page refresh |

Run scripts in **Supabase → SQL Editor → Run**. Scripts are idempotent where possible (`IF NOT EXISTS`, `DROP POLICY IF EXISTS`).

After migrations, schema cache usually refreshes within seconds. Fix files include `NOTIFY pgrst, 'reload schema';`.

### Common errors

| Symptom | Fix |
|---------|-----|
| Save failed: missing `categories` column | Run `activity_log_categories_fix.sql` or `timers_outcomes_migration.sql` |
| Timers pause/resume lost on refresh | Run `activity_timers_pause_fix.sql` |
| “Daily Log isn’t connected” banner | Run `activity_log_setup.sql` or full migration; tap **I ran it — retry** |
| Could not delete | Ensure `activity_log_delete` RLS policy exists (in setup/migration SQL) |

### App behavior without full schema

- `persistActivityLogToSupabase()` may retry a lean payload (category only).
- Entries can save to **localStorage** until Supabase schema matches.
- One-time toast may prompt to run `timers_outcomes_migration.sql`.

---

## 8. Deployment and caching

1. Push to GitHub (e.g. GitHub Desktop).
2. Vercel auto-deploys the static site.
3. Users should **hard refresh** after deploy: **Cmd+Shift+R** (Mac) or **Ctrl+Shift+R** (Windows).

**Cache busting:**

- `APP_VER` in `app.js` and `V` in `index.html` (query string on `app.js` and `style.css`).
- `index.html` may auto-reload once when version changes (`localStorage` key `4k_html_ver`).
- Console warns on HTML/JS version mismatch — hard refresh fixes it.

`vercel.json` sets `Cache-Control: no-cache` on `/`, `index.html`, `app.js`, and `style.css`.

---

## 9. Recent fixes and changes

### Login stability (earlier work)

- Empty or unclickable login roster → show all names; fixed grid layout.
- Stuck “Loading your team…” → REST fallback, non-blocking init, watchdog.
- Enter key not working → explicit handlers and member load before `doLogin()`.
- Data was verified in Supabase; issues were UI/race conditions, not data loss.

### Daily Log refinements (recent)

| Feature | Status |
|---------|--------|
| Timer Pause / Resume / Log time | Done |
| Larger day notes textarea | Done |
| Copy: task name first, full text | Done |
| Copy: iMessage-friendly bullets and spacing | Done |
| Copy: `-- time ~ time (duration) --` format | Done |
| Copy: `[CATEGORY]` at end in ALL CAPS | Done |
| In-app delete confirm modal | Done |
| Optimistic delete with rollback | Done |

### Suggested git archive (before simplifying app)

If stripping features later, save the full app first:

- Branch: `archive/full-features`
- Tag: `full-app-jun-2026`

(Check remote whether these already exist.)

---

## 10. localStorage keys

Useful for debugging in browser DevTools → Application → Local Storage.

| Key | Contents |
|-----|----------|
| `4k_alog_team` | Overseer activity log cache |
| `4k_alog_{memberId}` | Per-member activity log cache |
| `4k_act_timers` | Active/paused timers |
| `4k_member_outcomes` | Outcomes offline cache |
| `4k_atags` | Activity category list |
| `4k_apresets` | Team activity presets |
| `4k_ddn` | Day notes by member + date |
| `4k_oid` | Overseer member ID |
| `4k_mna` | Per-member nav access |
| `4k_ina` | Inactive members map |
| `4k_html_ver` | Last seen HTML version (cache bust) |

Agency prefs, task library, trash, and many other features use additional `4k_*` keys — see `saveAll()` in `app.js`.

---

## 11. Operational checklist

For a new operator taking over the live app:

- [ ] Confirm GitHub repo access and Vercel project linked
- [ ] Confirm Supabase project access (dashboard + SQL Editor)
- [ ] Verify tables exist: `members`, `tasks`, `activity_log`, `activity_timers`, `member_outcomes`
- [ ] Run missing migration SQL if Daily Log shows setup banner or save errors
- [ ] Open production URL, hard refresh, sign in as overseer test account
- [ ] Daily Log: add entry, use timer pause/resume, log time, copy summary, paste into Messages
- [ ] Delete an entry and a category — confirm in-app modal appears both times
- [ ] Confirm Realtime / live sync indicator behaves as expected
- [ ] Document who holds admin PINs and overseer role (not in this file)
- [ ] Enable Supabase backups on your plan if available
- [ ] Optional: export SQL dump periodically

---

## 12. Developer quick reference

### Architecture diagram

```
Login (members + PIN)
    ↓
Daily Log (default)
    ├── activity_log      (time + description + categories)
    ├── activity_timers   (pause/resume → log)
    ├── member_outcomes   (non-time metrics)
    └── day notes         (local + sync)
    ↓
Tools drawer
    └── tasks, dashboard, charts, calendar, trash, wipe, …
```

### Where to change common things

| Change | Location |
|--------|----------|
| Copy summary format | `app.js` — `formatDailyLogExportSummary`, `formatActivityExportLine` |
| Timer behavior | `app.js` — `pauseActivityTimer`, `resumeActivityTimer`, `logActivityTimer` |
| Daily Log UI | `index.html`, `style.css` |
| Database schema | SQL files in repo root — not only JavaScript |
| App version / cache bust | `APP_VER` in `app.js`, `V` in `index.html` |

### Realtime subscriptions

`subscribeRealtime()` in `app.js` listens for changes on: `tasks`, `members`, `task_history`, `activity_log`, `activity_timers`, `member_outcomes`, `role_notes`, `result_posts`, `trash_bin`.

### Credentials reminder

- **Safe in frontend:** Supabase URL + publishable (anon) key (with RLS).
- **Never in frontend:** Service role key, database password, private API keys.

---

## Questions or updates

When the app version changes, update the **Current app version** line at the top of this file and note significant changes in [Section 9](#9-recent-fixes-and-changes).

For SQL-only fixes, prefer adding a small `*_fix.sql` file plus a one-line note here rather than editing large migrations in place.
