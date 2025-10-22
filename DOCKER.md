# Docker Deployment Guide

This guide explains how to deploy the Microcosms application using Docker on Coolify or any other Docker-compatible platform.

## Prerequisites

- Docker 20.10 or higher
- Docker Compose 2.0 or higher (optional, for docker-compose deployment)
- Node.js 20+ (for local development only)

## Quick Start

### 1. Environment Configuration

Copy the example environment file and configure your environment variables:

```bash
cp env.example .env
```

Edit `.env` and fill in all required values. Key variables include:

- `DATABASE_URL`: PostgreSQL connection string
- `NEXT_PUBLIC_ALCHEMY_ID`: Alchemy API key
- `TELEGRAM_BOT_KEY`: Telegram bot token
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`: WalletConnect project ID
- Other blockchain and service configurations

### 2. Build the Docker Image

```bash
docker build -t microcosms:latest .
```

This will:
1. Install all dependencies
2. Generate Prisma client
3. Build the Next.js application with standalone output
4. Create a minimal production image

### 3. Run the Container

#### Using Docker directly:

```bash
docker run -d \
  --name microcosms \
  -p 3000:3000 \
  --env-file .env \
  microcosms:latest
```

#### Using Docker Compose:

```bash
docker-compose up -d
```

The application will be available at `http://localhost:3000`

## Coolify Deployment

### Option 1: Using Coolify UI

1. **Create a new service** in Coolify
2. **Select "Docker Compose"** as the deployment type
3. **Connect your Git repository**
4. **Configure environment variables** in Coolify's UI (copy from `env.example`)
5. **Set the build context** to the repository root
6. **Deploy**

### Option 2: Using Dockerfile

1. **Create a new service** in Coolify
2. **Select "Dockerfile"** as the deployment type
3. **Connect your Git repository**
4. **Set Dockerfile path** to `./Dockerfile`
5. **Configure environment variables** in Coolify's UI
6. **Set port** to `3000`
7. **Deploy**

## Architecture

The Docker setup uses a multi-stage build:

1. **deps**: Installs all dependencies
2. **builder**: Builds the application with Turbo
3. **runner**: Creates minimal production image with only necessary files

### Key Features

- ✅ Node 20 Alpine base image (minimal size)
- ✅ Multi-stage build for optimal image size
- ✅ Turborepo monorepo support
- ✅ Next.js standalone output mode
- ✅ Non-root user for security
- ✅ Prisma client generation
- ✅ Health checks included
- ✅ Production optimized

## Database Setup

This application requires a PostgreSQL database. Make sure to:

1. **Set up a PostgreSQL instance** (you can use Coolify's database service)
2. **Configure `DATABASE_URL`** in your environment variables
3. **Run migrations** (if needed):

```bash
# If you need to run migrations manually
docker exec -it microcosms sh
cd packages/db
npx prisma migrate deploy
```

## Environment Variables

All environment variables are documented in `env.example`. Key categories:

- **Database**: PostgreSQL connection
- **Blockchain**: Chain configuration and RPC URLs
- **Authentication**: Telegram bot keys and webhooks
- **Services**: Alchemy, WalletConnect, QStash integrations
- **Monitoring**: Slack webhooks for alerts

## Monitoring & Health Checks

The container includes a health check endpoint. Monitor your deployment:

```bash
# Check container health
docker ps

# View logs
docker logs -f microcosms

# Using docker-compose
docker-compose logs -f
```

## Troubleshooting

### Build Issues

**Problem**: Dependencies not installing correctly
```bash
# Clear Docker cache and rebuild
docker build --no-cache -t microcosms:latest .
```

**Problem**: Prisma client generation fails
- Ensure `DATABASE_URL` is set correctly
- Check that PostgreSQL is accessible

### Runtime Issues

**Problem**: Application not starting
```bash
# Check logs
docker logs microcosms

# Check if port 3000 is already in use
lsof -i :3000
```

**Problem**: Database connection errors
- Verify `DATABASE_URL` format: `postgresql://user:password@host:5432/dbname`
- Ensure the database exists and is accessible from the container
- Check network connectivity between containers

### Performance Issues

**Problem**: Slow build times
- Use `.dockerignore` to exclude unnecessary files (already configured)
- Consider using a Docker registry to cache layers

## Production Considerations

1. **Database Backups**: Set up regular backups for your PostgreSQL database
2. **SSL/TLS**: Configure HTTPS through Coolify or a reverse proxy
3. **Secrets Management**: Use Coolify's secret management or environment variables
4. **Resource Limits**: Set appropriate CPU/memory limits in Coolify
5. **Monitoring**: Set up logging and monitoring for production
6. **Updates**: Use git-based deployments for easy rollbacks

## Advanced Configuration

### Custom Port

To run on a different port:

```bash
docker run -d \
  --name microcosms \
  -p 8080:3000 \
  -e PORT=3000 \
  --env-file .env \
  microcosms:latest
```

### Development Mode

For development, use the regular development workflow:

```bash
yarn install
yarn dev
```

Docker is recommended for production deployments only.

### Resource Limits

```yaml
# docker-compose.yml
services:
  web:
    # ... other config
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1G
```

## Support

For issues specific to:
- **Docker/Deployment**: Check this README and Docker logs
- **Application**: See main `README.md`
- **Coolify**: Visit [Coolify documentation](https://coolify.io/docs)

