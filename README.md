# Telligence

Agency operations tracker — Daily Log, time tracking, team KPIs, and Supabase-backed sync.

## Documentation

**→ [HANDOFF.md](./HANDOFF.md)** — full handoff guide for new owners and developers:

- What the app does and how it’s organized  
- Daily Log, timers, copy summary format, categories  
- Supabase migrations (which SQL file to run when)  
- Deploy (GitHub → Vercel), cache bust, version numbers  
- Roles (overseer, admin, member), login, Tools drawer  
- Operational checklist and developer quick reference  

Start there before changing code or database schema.

## Quick start

1. Deploy or open `index.html` (static — no build step).  
2. In [Supabase](https://supabase.com) SQL Editor, run migrations as needed — see **Section 7** in [HANDOFF.md](./HANDOFF.md).  
3. Hard refresh after deploy: **Cmd+Shift+R** (Mac) or **Ctrl+Shift+R** (Windows).

**Current version:** `20260527.72`

## Main files

| File | Purpose |
|------|---------|
| `index.html` | UI |
| `app.js` | Application logic |
| `style.css` | Styles |
| `HANDOFF.md` | **Handoff & operations guide** |
| `timers_outcomes_migration.sql` | Daily Log v2 schema (timers, outcomes, categories) |
