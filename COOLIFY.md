# Coolify Deployment Configuration

## Service Configuration

- **Type**: Dockerfile
- **Port**: 3000
- **Health Check Path**: `/` (or create `/api/health` endpoint)
- **Dockerfile Path**: `./Dockerfile`
- **Build Context**: Repository root

## Build Configuration

### Build Arguments
No build arguments required - all configuration is via environment variables.

### Build Command
Default Docker build (Coolify will use the Dockerfile)

## Environment Variables

Copy these into Coolify's environment variables section:

```env
# Database
DATABASE_URL=

# Alchemy
NEXT_PUBLIC_ALCHEMY_ID=

# Bot Configuration
NEXT_PUBLIC_BOT_DAO=
TELEGRAM_BOT_KEY=
NEXT_PUBLIC_GETME_BOT_INFO=

# Blockchain Configuration
NEXT_PUBLIC_RPC_URL=
NEXT_PUBLIC_CHAINNAME=
NEXT_PUBLIC_CHAINRESTURL=
NEXT_PUBLIC_NETWORK=
NEXT_PUBLIC_CHAINID=

# Application URLs
BASEURL=https://your-domain.com

# WalletConnect
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=

# QStash
QSTASH_URL=
QSTASH_TOKEN=
QSTASH_CURRENT_SIGNING_KEY=
QSTASH_NEXT_SIGNING_KEY=

# Security
CRON_SECRET=
TG_WEBHOOK_SECRET=

# Optional
MAINTENANCE_MODE=0
DISABLE_AUDIT_LOGS=false
ALLOWED_DENOMS=

# Monitoring
SLACK_MONITOR_WEBHOOK=

# Node Environment
NODE_ENV=production
```

## Resource Recommendations

- **CPU**: 1-2 cores
- **Memory**: 2GB minimum, 4GB recommended
- **Disk**: 10GB minimum

## Deployment Steps in Coolify

1. **Create New Service**
   - Click "New Service" in Coolify
   - Select "Dockerfile"

2. **Connect Repository**
   - Add your Git repository
   - Select the branch (e.g., `main` or `staging`)

3. **Configure Service**
   - Set port to `3000`
   - Set Dockerfile path to `./Dockerfile`
   - Enable "Auto Deploy" if desired

4. **Add Environment Variables**
   - Go to the "Environment" tab
   - Copy all variables from above
   - Fill in your actual values

5. **Database Setup** (if not already done)
   - Create a PostgreSQL database in Coolify
   - Copy the connection string to `DATABASE_URL`

6. **Deploy**
   - Click "Deploy"
   - Monitor the build logs
   - Wait for deployment to complete

7. **Configure Domain** (optional)
   - Go to "Domains" tab
   - Add your custom domain
   - Coolify will handle SSL automatically

## Post-Deployment

### Database Migrations

If you need to run Prisma migrations:

```bash
# SSH into the container
coolify ssh [your-service-id]

# Run migrations
cd packages/db
npx prisma migrate deploy
```

Or create a post-deployment script in Coolify.

### Health Monitoring

Coolify automatically monitors your service. You can also:

1. Enable health check endpoint (add to `apps/web/pages/api/health.ts`):

```typescript
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() })
}
```

2. Configure health check in Coolify:
   - Path: `/api/health`
   - Interval: 30s
   - Timeout: 10s

### Logs

View logs in Coolify's dashboard or via CLI:

```bash
coolify logs [your-service-id] --follow
```

## Troubleshooting

### Build Fails

- Check build logs in Coolify dashboard
- Verify all package.json files are committed
- Ensure Dockerfile is in repository root

### Runtime Errors

- Verify all environment variables are set correctly
- Check that DATABASE_URL is accessible from the container
- Review application logs in Coolify

### Database Connection Issues

- Ensure PostgreSQL is running
- Verify network connectivity between services
- Check DATABASE_URL format and credentials

## Rolling Back

Coolify keeps previous deployments. To rollback:

1. Go to "Deployments" tab
2. Find previous successful deployment
3. Click "Redeploy"

## Scaling

Coolify supports horizontal scaling:

1. Go to service settings
2. Increase replica count
3. Ensure your database can handle the load
4. Consider adding a load balancer for multiple replicas

## CI/CD Integration

Coolify supports webhooks for automatic deployments:

1. Go to "Webhooks" in service settings
2. Copy the webhook URL
3. Add to your GitHub/GitLab repository settings
4. Configure to trigger on push to main branch

## Cost Optimization

- Start with minimal resources (1 CPU, 2GB RAM)
- Monitor usage in Coolify dashboard
- Scale up only if needed
- Use Coolify's built-in metrics to optimize

