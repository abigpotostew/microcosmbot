# Cron Job Setup for Self-Hosted Deployment

This document explains the cron job setup for the self-hosted version of the application (replacing Vercel's cron feature).

## Overview

Previously on Vercel, the application used Vercel's built-in cron feature (defined in `vercel.json`) to schedule periodic tasks. For self-hosted deployments, we now use **node-cron** to schedule tasks internally within the Next.js application.

## How It Works

1. **Instrumentation Hook**: Next.js 13+ provides an `instrumentation.ts` file that runs once when the server starts. Our implementation initializes the cron jobs there.

2. **Direct Function Calls**: Instead of making HTTP requests to API endpoints, the cron jobs directly call the underlying business logic functions. This is more efficient and eliminates network overhead.

3. **Job Functions**: The core logic has been extracted into reusable functions in `services/cron-jobs/`:
   - `update-all-entries.ts` - Updates all active group members
   - `configure-bot.ts` - Configures the Telegram bot webhook and commands

4. **API Endpoints**: The original API endpoints (`/api/cron/cron-update-all-entries` and `/api/bot/config`) remain available for manual triggering but now call the same extracted functions.

## Files Structure

```
instrumentation.ts              # Initializes cron jobs on server startup
services/
  ├── cron-scheduler.ts        # Schedules the cron jobs
  └── cron-jobs/
      ├── update-all-entries.ts # Updates all group members
      └── configure-bot.ts      # Configures Telegram bot
```

## Scheduled Jobs

| Job | Schedule | Description |
|-----|----------|-------------|
| `update-all-entries` | `0 */2 * * *` | Every 2 hours - Updates all active group members |
| `configure-bot` | `*/30 * * * *` | Every 30 minutes - Configures bot webhook and commands |

## Environment Variables

No additional environment variables are required beyond what was already needed for the application. The CRON_SECRET is still used for securing the API endpoints if you want to trigger them manually.

## Development Mode

By default, cron jobs are **disabled in development mode** to avoid unwanted side effects during local development. To enable cron jobs in development, edit `services/cron-scheduler.ts` and remove or modify the development mode check.

## Docker Deployment

The cron scheduler works automatically in Docker:
1. Next.js builds with `output: 'standalone'` (already configured)
2. The `instrumentation.ts` file is included in the standalone build
3. When the Docker container starts, Next.js runs the instrumentation hook
4. Cron jobs are initialized and run according to their schedules

## Manual Trigger

You can still manually trigger the cron jobs via API endpoints (requires CRON_SECRET):

```bash
# Update all entries
curl -H "Authorization: Bearer $CRON_SECRET" \
  https://your-domain.com/api/cron/cron-update-all-entries

# Configure bot
curl -H "Authorization: Bearer $CRON_SECRET" \
  https://your-domain.com/api/bot/config
```

## Monitoring

Cron job execution is logged with the `[CRON]` and `[CRON JOB]` prefixes. Check your application logs to monitor cron job execution:

```bash
docker logs <container-name> | grep "\[CRON"
```

## Troubleshooting

**Cron jobs not running?**
- Check that `NODE_ENV=production` is set in your environment
- Verify the application logs show `[CRON] Initializing cron jobs...`
- Ensure the `instrumentation.ts` file is included in your build

**Jobs failing?**
- Check application logs for `[CRON JOB]` error messages
- Verify all required environment variables are set (BASEURL, TELEGRAM_BOT_KEY, etc.)
- Ensure database connectivity is working

