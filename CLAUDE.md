# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

**3DF (3DFantasy)** is a Remix web application for CFL depth chart tracking and play-by-play analytics. The app automatically scrapes team websites for new depth charts, detects changes, and sends email notifications to subscribed users. It also stores comprehensive play-by-play game data for analysis.

**Tech Stack:** Remix 2, React 18, Prisma (PostgreSQL), node-resque (Redis), Puppeteer, Microsoft Graph API

## Common Commands

### Development

```bash
npm run dev           # Start dev server with Vite
npm run typecheck     # Run TypeScript type checking
npm run lint          # Run ESLint
```

### Building & Deployment

```bash
npm run build         # Build for production
npm start             # Start production server

# Docker deployment
docker-compose up -d --build
docker-compose down
```

### Database (Prisma)

```bash
npx prisma migrate dev           # Create and apply migration
npx prisma migrate deploy        # Apply migrations (production)
npx prisma db push              # Push schema without migration
npx prisma studio               # Open Prisma Studio GUI
npx prisma generate             # Regenerate Prisma Client
```

### Background Jobs (Resque)

The resque worker and scheduler start automatically with the app via `entry.server.tsx`. Jobs are managed through Redis queues.

To manually trigger depth chart checks, use the admin dashboard at `/admin`.

## Architecture

### Core Pattern: Remix Route-Driven Architecture

```
/routes               → File-based routing (UI components)
/loader               → Server-side data loading (one per route)
/actions              → Form submission handlers
/dao                  → Data Access Objects (database logic)
/utils                → Shared utilities
/resque               → Background job system
```

### Key Architectural Concepts

**1. Loaders and Actions**

- Each route has a corresponding loader in `/app/loader/`
- Example: `/routes/home.$teamId.$year.tsx` → `/loader/home.teamId.year.server.ts`
- Actions handle form submissions and mutations
- All loaders check authentication via `authenticator.isAuthenticated()`

**2. DAO Pattern**

- Database operations abstracted into DAOs: `depthChart.server.ts`, `game.server.ts`, etc.
- Uses `true-myth` Result types: `Result<Success, Error>` for explicit error handling
- Always check `.isErr` before accessing `.value` on Result types

**3. Background Job System (Resque)**

- Two queues: `{REDIS_QUEUE}-team` and `{REDIS_QUEUE}-schedule`
- Worker pool starts in `entry.server.tsx`
- Scheduler runs cron jobs (currently: every Sunday 8 PM UTC)
- Two main jobs:
    - `teamCheck`: Scrapes team website, detects new depth charts, sends notifications
    - `saveAllDepthCharts`: Bulk import of depth charts for a team

**4. Puppeteer Scraping System**

- 9 team-specific scrapers in `/app/utils/puppeteer/team[1-9].server.ts`
- Each scraper has unique DOM parsing logic for that team's website
- URLs configured via env vars: `TEAM_1_URL`, `TEAM_2_URL`, etc.
- Browser config includes sandbox disabling for Docker compatibility

### Database Schema (Prisma)

**Key Models:**

- **Account**: Users with email/password auth, per-team notification preferences
- **Team**: 9 teams with `geniusTeamId` for external API integration
- **DepthChartList**: JSON snapshot of all depth charts for a team/year (used for change detection)
- **DepthChart**: Individual depth chart with title, link, season, week
- **Game**: Play-by-play data with full JSON response
- **Drive**: Possession sequences with scoring info
- **Play**: Individual plays with 20+ fields (EPA, player names, yards, etc.)

**Important Relationships:**

- Team → DepthChartList (one per year)
- DepthChartList → DepthChart[] (many charts per list)
- Game → Drive[] → Play[]

### Authentication

**System:** remix-auth with FormStrategy

- Cookie-based sessions (30-day max age)
- Bcrypt password hashing
- Session object: `{ id, uuid, email, role }`
- Protected routes redirect to `/auth/login`
- Use `SESSION_SECRET` environment variable

### Email Notifications

**Microsoft Graph API Integration:**

- Uses Azure service principal (Tenant ID, Client ID, Client Secret)
- Sends HTML emails via Office 365
- Template in `/app/utils/m365/emailTemplate.server.ts`
- Includes unsubscribe links using account UUID
- Batches 50 accounts at a time with 1ms delay between sends
- Respects `NODE_ENV !== 'development'` to skip emails in dev

## Important Patterns

### Result Type Pattern

```typescript
import { Result } from 'true-myth/result'

const result = await someFunction()
if (result.isErr) {
    // Handle error: result.error
    return
}
// Use success value: result.value
```

### Dynamic Team Notification Fields

```typescript
const notificationField = `team${teamId}Notification` // team1Notification, team2Notification, etc.
```

### Season/Week Calculation

- `getDepthChartInfo()` in `/app/utils/getDepthChartInfo.server.ts`
- Calculates NFL season context (pre/regular/post) and week number
- Pre-season: Jan 1 - June 4
- Regular season: June 5 - Oct 31
- Post-season: Nov 1 onwards

### Environment Configuration

Team data comes from environment variables:

- `TEAM_1_TITLE`, `TEAM_1_URL` through `TEAM_9_TITLE`, `TEAM_9_URL`
- Database: `DATABASE_URL`
- Redis: `REDIS_HOST`, `REDIS_PORT`, `REDIS_QUEUE`
- Email: `AZURE_TENANT_ID`, `AZURE_CLIENT_ID`, `AZURE_CLIENT_SECRET`, `M365_EMAIL`

## Development Workflow

### Adding a New Route

1. Create route file in `/app/routes/`
2. Create loader in `/app/loader/` with `.server.ts` suffix
3. Add action handler in `/app/actions/` if needed
4. Use `authenticator.isAuthenticated()` for protected routes

### Modifying Depth Chart Scraping

1. Update team-specific scraper in `/app/utils/puppeteer/team[N].server.ts`
2. Test with manual job trigger via `/admin` dashboard
3. Scraper should return `Array<{ title: string, href: string }>`

### Database Changes

1. Modify `prisma/schema.prisma`
2. Run `npx prisma migrate dev --name descriptive_name`
3. Commit both schema and migration files
4. Regenerate Prisma Client: `npx prisma generate`

### Adding Background Jobs

1. Create job file in `/app/resque/jobs/`
2. Export job object with `plugins`, `pluginOptions`, `perform` function
3. Add to exports in `/app/resque/jobs.server.ts`
4. Enqueue via `resqueTask()` from `/app/resque/main.server.ts`

## Docker Notes

**Important:** The app runs Puppeteer in Docker, requiring special capabilities:

```yaml
cap_add:
    - SYS_ADMIN
security_opt:
    - seccomp=unconfined
```

These are needed for Chrome/Chromium to run in headless mode. The Puppeteer config includes `--no-sandbox` for container compatibility.

## Key Files to Understand

- `app/entry.server.tsx` - App initialization, starts resque worker/scheduler
- `app/lib/db.server.ts` - Prisma client singleton
- `app/utils/auth/auth.server.ts` - Authentication setup
- `app/dao/depthChartList.server.ts` - Depth chart comparison logic
- `app/resque/jobs/teamCheck.server.ts` - Core notification job
- `prisma/schema.prisma` - Database schema

## Testing Depth Chart Detection

1. Go to `/admin` (requires admin account)
2. Select team(s) to check
3. Click "Check for New Depth Charts"
4. Monitor logs for scraping results
5. Check database for new DepthChart records
6. Verify email notifications (disabled in `NODE_ENV=development`)
