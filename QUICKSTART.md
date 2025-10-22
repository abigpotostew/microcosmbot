# Quick Start - Docker Deployment

## 🚀 Get Started in 3 Steps

### 1. Configure Environment
```bash
cp env.example .env
# Edit .env with your configuration
```

### 2. Build
```bash
./docker.sh build
# or: docker build -t microcosms:latest .
```

### 3. Deploy

**Local Testing:**
```bash
./docker.sh run
```

**With Docker Compose:**
```bash
docker-compose up -d
```

**On Coolify:**
- See `COOLIFY.md` for detailed steps

## 📝 Quick Commands

```bash
# Build image
./docker.sh build

# Run container
./docker.sh run

# View logs
./docker.sh logs

# Restart
./docker.sh restart

# Stop
./docker.sh stop

# Clean up
./docker.sh clean

# Docker Compose
./docker.sh compose-up
./docker.sh compose-down
```

## 🔍 Verify Deployment

```bash
# Check health
curl http://localhost:3000/api/health

# View logs
docker logs -f microcosms

# Check status
docker ps | grep microcosms
```

## 📚 Documentation

- `DEPLOYMENT.md` - Complete overview
- `DOCKER.md` - Docker deployment guide
- `COOLIFY.md` - Coolify-specific instructions
- `env.example` - Environment variables reference

## 🐛 Common Issues

**Issue**: Build fails
**Fix**: Check Docker logs, ensure all package.json files are present

**Issue**: Container won't start
**Fix**: Verify `.env` is configured correctly

**Issue**: Database connection error
**Fix**: Check `DATABASE_URL` format and network connectivity

## 💡 Key URLs

- Application: `http://localhost:3000`
- Health Check: `http://localhost:3000/api/health`

## ⚙️ Requirements

- Docker 20.10+
- Node 20+ (for local dev only)
- PostgreSQL database
- 2GB RAM minimum

## 🎯 What Changed

- ✅ `next.config.js` - Added standalone output
- ✅ `Dockerfile` - Multi-stage build
- ✅ `.dockerignore` - Optimized build context
- ✅ `docker-compose.yml` - Easy deployment
- ✅ `health.ts` - Health check endpoint
- ✅ `docker.sh` - Helper script
- ✅ Documentation - Complete guides

---

**Need Help?** Check `DOCKER.md` for troubleshooting!

