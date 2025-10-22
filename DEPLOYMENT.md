# Docker Deployment Setup - Summary of Changes

This document summarizes all changes made to enable Docker deployment of the Microcosms application.

## Files Created

### 1. `Dockerfile`
- Multi-stage Docker build configuration
- Uses Node 20 Alpine for minimal image size
- Three stages: deps, builder, runner
- Properly handles Turborepo monorepo structure
- Includes Prisma client generation
- Optimized for production with standalone Next.js output

### 2. `.dockerignore`
- Optimizes Docker build context
- Excludes unnecessary files (node_modules, .git, build artifacts)
- Reduces build time and image size

### 3. `docker-compose.yml`
- Simplified deployment configuration
- Includes all required environment variables
- Health check configuration
- Restart policy for production

### 4. `env.example`
- Template for environment variables
- Documents all required configuration
- Organized by category

### 5. `DOCKER.md`
- Comprehensive Docker deployment guide
- Build and run instructions
- Coolify-specific deployment steps
- Troubleshooting section
- Production best practices

### 6. `COOLIFY.md`
- Coolify-specific deployment guide
- Step-by-step setup instructions
- Resource recommendations
- Post-deployment tasks
- CI/CD integration tips

### 7. `docker.sh`
- Helper script for common Docker operations
- Commands: build, run, logs, stop, restart, clean
- Docker Compose integration
- User-friendly with colored output

### 8. `apps/web/pages/api/health.ts`
- Health check endpoint
- Returns service status, uptime, and environment
- Required for container orchestration

## Files Modified

### 1. `apps/web/next.config.js`
- Added `output: 'standalone'` configuration
- Enables Next.js standalone build mode
- Required for Docker deployment

## How It Works

### Build Process

1. **Stage 1 (deps)**: Install all dependencies for the monorepo
   - Copies all package.json files
   - Runs `yarn install`

2. **Stage 2 (builder)**: Build the application
   - Copies source code
   - Generates Prisma client
   - Runs Turborepo build
   - Creates standalone Next.js output

3. **Stage 3 (runner)**: Production image
   - Copies only necessary files from builder
   - Sets up non-root user for security
   - Exposes port 3000
   - Runs the Next.js server

### Runtime

- Container runs `node apps/web/server.js`
- Serves on port 3000
- Includes health check at `/api/health`
- Environment variables configure the application

## Deployment Options

### Option 1: Docker Directly

```bash
./docker.sh build
./docker.sh run
```

### Option 2: Docker Compose

```bash
docker-compose up -d
```

### Option 3: Coolify

1. Create new service (Dockerfile type)
2. Connect Git repository
3. Configure environment variables
4. Deploy

## Environment Variables Required

See `env.example` for complete list. Key variables:

- `DATABASE_URL` - PostgreSQL connection string
- `NEXT_PUBLIC_*` - Public frontend configuration
- `TELEGRAM_BOT_KEY` - Telegram bot authentication
- `QSTASH_*` - Queue service configuration
- Various blockchain and service API keys

## Testing the Setup

1. **Build the image**:
   ```bash
   docker build -t microcosms:latest .
   ```

2. **Run locally**:
   ```bash
   docker run -p 3000:3000 --env-file .env microcosms:latest
   ```

3. **Test health endpoint**:
   ```bash
   curl http://localhost:3000/api/health
   ```

4. **Check application**:
   Open http://localhost:3000 in browser

## Production Checklist

- [ ] Create `.env` from `env.example`
- [ ] Fill in all required environment variables
- [ ] Set up PostgreSQL database
- [ ] Configure `DATABASE_URL`
- [ ] Build Docker image
- [ ] Test locally first
- [ ] Deploy to Coolify
- [ ] Configure custom domain (optional)
- [ ] Set up monitoring
- [ ] Configure backup strategy
- [ ] Test all functionality

## Key Features

✅ Node 20+ support
✅ Monorepo (Turborepo) compatible
✅ Next.js standalone output
✅ Multi-stage build for optimization
✅ Production-ready
✅ Security (non-root user)
✅ Health checks
✅ Easy deployment scripts
✅ Comprehensive documentation

## Next Steps

1. Copy `env.example` to `.env` and configure
2. Test build locally: `./docker.sh build`
3. Test run locally: `./docker.sh run`
4. Verify at http://localhost:3000
5. Deploy to Coolify following `COOLIFY.md`

## Differences from Vercel

| Aspect | Vercel | Docker/Coolify |
|--------|--------|----------------|
| Build | Automatic | Manual/CI trigger |
| Env Vars | Dashboard | `.env` or Coolify UI |
| Domains | Automatic | Configure in Coolify |
| SSL | Automatic | Automatic (via Coolify) |
| Scaling | Automatic | Manual configuration |
| Database | Separate service | Separate (PostgreSQL) |
| Cost | Usage-based | Server cost only |

## Support Resources

- Docker documentation: See `DOCKER.md`
- Coolify guide: See `COOLIFY.md`
- Quick start: Use `./docker.sh`
- Health check: `/api/health` endpoint

## Troubleshooting Quick Reference

**Build fails**: Check `DOCKER.md` troubleshooting section
**Runtime errors**: Verify environment variables in `.env`
**Database issues**: Check `DATABASE_URL` format and connectivity
**Port conflicts**: Ensure port 3000 is available

## Maintenance

- Update dependencies: Rebuild image after `yarn.lock` changes
- Environment changes: Update `.env` and restart container
- Code changes: Rebuild image and redeploy
- Database migrations: Run via Prisma after deployment

---

For detailed instructions, see:
- `DOCKER.md` - Complete Docker guide
- `COOLIFY.md` - Coolify-specific instructions
- `env.example` - Environment configuration reference

