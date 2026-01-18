# Recovera Platform - Complete Deployment Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Backend Deployment](#backend-deployment)
3. [Mobile App Deployment](#mobile-app-deployment)
4. [Admin Portal Deployment](#admin-portal-deployment)
5. [Payment Integrations](#payment-integrations)
6. [Database Setup](#database-setup)
7. [Environment Configuration](#environment-configuration)
8. [Security Hardening](#security-hardening)
9. [Monitoring & Maintenance](#monitoring--maintenance)

---

## Prerequisites

### Required Software
- **Node.js**: 18.x or higher
- **PostgreSQL**: 14.x or higher
- **npm**: 9.x or higher
- **Git**: Latest version

### Required Accounts
- VPS/Cloud provider (DigitalOcean, AWS, etc.)
- Domain name with DNS access
- SSL certificate (Let's Encrypt recommended)
- Payment gateway accounts:
  - M-Pesa (Safaricom Daraja API)
  - Airtel Money
  - Stripe/Paystack (optional)

---

## Backend Deployment

### Option 1: VPS Deployment (Recommended)

#### 1. Server Setup

```bash
# SSH into your server
ssh root@your-server-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version  # Should show v18.x.x
npm --version   # Should show 9.x.x

# Install PM2 globally
sudo npm install -g pm2

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Start PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### 2. Database Configuration

```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE recovera;
CREATE USER recoverauser WITH ENCRYPTED PASSWORD 'your-strong-password-here';
GRANT ALL PRIVILEGES ON DATABASE recovera TO recoverauser;
ALTER USER recoverauser CREATEDB;  -- For auto-sync in development
\q

# Test connection
psql -U recoverauser -d recovera -h localhost
```

#### 3. Clone and Setup Application

```bash
# Create application directory
sudo mkdir -p /var/www/recovera
sudo chown -R $USER:$USER /var/www/recovera

# Clone repository
cd /var/www/recovera
git clone https://github.com/yourusername/recovera.git .

# Navigate to backend
cd backend

# Install dependencies
npm install --legacy-peer-deps

# Copy environment file
cp .env.example .env
```

#### 4. Configure Environment Variables

Edit `/var/www/recovera/backend/.env`:

```env
# Application
NODE_ENV=production
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=recoverauser
DB_PASSWORD=your-strong-password-here
DB_DATABASE=recovera

# JWT
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
JWT_EXPIRES_IN=7d

# M-Pesa Configuration
MPESA_CONSUMER_KEY=your-mpesa-consumer-key
MPESA_CONSUMER_SECRET=your-mpesa-consumer-secret
MPESA_PASSKEY=your-mpesa-passkey
MPESA_SHORTCODE=174379
MPESA_CALLBACK_URL=https://api.yourdomain.com/billing/mpesa/callback
MPESA_ENVIRONMENT=sandbox  # Change to 'production' when live

# Airtel Money Configuration
AIRTEL_CLIENT_ID=your-airtel-client-id
AIRTEL_CLIENT_SECRET=your-airtel-client-secret
AIRTEL_MERCHANT_ID=your-merchant-id
AIRTEL_CALLBACK_URL=https://api.yourdomain.com/billing/airtel/callback
AIRTEL_ENVIRONMENT=sandbox

# Cards/Stripe (Optional)
STRIPE_SECRET_KEY=sk_live_your-stripe-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret

# Paystack (Optional)
PAYSTACK_SECRET_KEY=sk_live_your-paystack-key
PAYSTACK_WEBHOOK_SECRET=your-webhook-secret

# CORS
CORS_ORIGIN=https://yourdomain.com,https://admin.yourdomain.com

# Plan Prices (in KES)
BASIC_PLAN_PRICE=400
PRO_PLAN_PRICE=800
FAMILY_PLAN_PRICE=1200
```

⚠️ **Security Note**: Never commit `.env` to version control!

#### 5. Build and Start Application

```bash
# Build application
npm run build

# Database will auto-sync on first run (TypeORM synchronize=true in dev)
# For production, use migrations instead

# Start with PM2
pm2 start dist/main.js --name recovera-api

# Save PM2 process list
pm2 save

# Setup PM2 to start on system reboot
pm2 startup systemd
# Follow the command it shows

# View logs
pm2 logs recovera-api

# Monitor
pm2 monit
```

#### 6. Setup Nginx Reverse Proxy

```bash
# Install Nginx
sudo apt install nginx -y

# Create site configuration
sudo nano /etc/nginx/sites-available/recovera-api
```

**Nginx Configuration:**

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Health check endpoint
    location /health {
        proxy_pass http://localhost:3000/health;
        access_log off;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/recovera-api /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

#### 7. Setup SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtain SSL certificate
sudo certbot --nginx -d api.yourdomain.com

# Test auto-renewal
sudo certbot renew --dry-run
```

### Option 2: Docker Deployment

**Dockerfile:**

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production --legacy-peer-deps

# Copy source
COPY . .

# Build application
RUN npm run build

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start application
CMD ["node", "dist/main.js"]
```

**docker-compose.yml:**

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14-alpine
    environment:
      POSTGRES_DB: recovera
      POSTGRES_USER: recoverauser
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U recoverauser"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      DB_HOST: postgres
      DB_PORT: 5432
      DB_USERNAME: recoverauser
      DB_PASSWORD: ${DB_PASSWORD}
      DB_DATABASE: recovera
      JWT_SECRET: ${JWT_SECRET}
      MPESA_CONSUMER_KEY: ${MPESA_CONSUMER_KEY}
      MPESA_CONSUMER_SECRET: ${MPESA_CONSUMER_SECRET}
    depends_on:
      postgres:
        condition: service_healthy
    restart: unless-stopped

volumes:
  postgres_data:
```

```bash
# Deploy with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f backend

# Update deployment
git pull
docker-compose build
docker-compose up -d
```

---

## Mobile App Deployment

### 1. Prepare for Production

Update `mobile/app.json`:

```json
{
  "expo": {
    "name": "Recovera",
    "slug": "recovera",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "android": {
      "package": "com.recovera.app",
      "versionCode": 1,
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "permissions": [
        "READ_SMS",
        "READ_EXTERNAL_STORAGE",
        "android.permission.BIND_NOTIFICATION_LISTENER_SERVICE"
      ]
    },
    "extra": {
      "eas": {
        "projectId": "your-expo-project-id"
      }
    }
  }
}
```

Update API endpoint in `mobile/services/api.ts`:

```typescript
const API_BASE_URL = 'https://api.yourdomain.com';
```

### 2. Build with EAS

```bash
cd mobile

# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure build
eas build:configure

# Build for Android
eas build --platform android --profile production

# Download APK
# The build URL will be provided after completion
```

### 3. Google Play Store Submission

1. Create app in [Google Play Console](https://play.google.com/console)
2. Prepare store listing:
   - App name: Recovera
   - Short description
   - Full description
   - Screenshots (at least 2)
   - Feature graphic
   - Icon
3. Upload APK
4. Complete content rating questionnaire
5. Set pricing (Free with in-app purchases)
6. Add privacy policy URL
7. Submit for review

**Privacy Policy Required Sections:**
- Data collection practices
- Local storage usage
- Payment processing
- Third-party services (M-Pesa, Airtel Money)
- User permissions explanation

---

## Admin Portal Deployment

### Deploy to Vercel

```bash
cd admin

# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

**Environment Variables (Vercel Dashboard):**
```
VITE_API_URL=https://api.yourdomain.com
```

### Deploy to Netlify

```bash
cd admin

# Build
npm run build

# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod --dir=dist
```

**netlify.toml:**

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## Payment Integrations

### M-Pesa Integration

#### 1. Register on Daraja Portal

1. Go to [Daraja Portal](https://developer.safaricom.co.ke/)
2. Create app (Sandbox/Production)
3. Get Consumer Key and Consumer Secret
4. Register URLs:
   - Validation URL: `https://api.yourdomain.com/billing/mpesa/validate`
   - Confirmation URL: `https://api.yourdomain.com/billing/mpesa/confirm`

#### 2. Implement Callback Handler

Create `backend/src/billing/controllers/mpesa.controller.ts`:

```typescript
import { Controller, Post, Body } from '@nestjs/common';
import { MpesaService } from '../services/mpesa.service';

@Controller('billing/mpesa')
export class MpesaController {
  constructor(private mpesaService: MpesaService) {}

  @Post('callback')
  async handleCallback(@Body() payload: any) {
    return this.mpesaService.processCallback(payload);
  }

  @Post('validate')
  async validatePayment(@Body() payload: any) {
    return { ResultCode: 0, ResultDesc: 'Accepted' };
  }
}
```

### Airtel Money Integration

Similar process - register on Airtel Money developer portal and implement callbacks.

### Cards/Stripe Integration

```bash
# Install Stripe
npm install stripe
```

Implement webhook handler for payment confirmations.

---

## Database Setup

### Production Migration Strategy

**Don't use auto-sync in production!** Instead:

1. Disable synchronize in production:

```typescript
// app.module.ts
synchronize: configService.get('NODE_ENV') !== 'production',
```

2. Generate migrations:

```bash
npm run typeorm migration:generate -- -n InitialSchema
npm run typeorm migration:run
```

### Backup Strategy

```bash
# Create backup script
nano /usr/local/bin/backup-recovera-db.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/recovera"
mkdir -p $BACKUP_DIR

pg_dump -U recoverauser recovera | gzip > $BACKUP_DIR/recovera_$DATE.sql.gz

# Keep only last 7 days
find $BACKUP_DIR -name "recovera_*.sql.gz" -mtime +7 -delete

echo "Backup completed: recovera_$DATE.sql.gz"
```

```bash
# Make executable
chmod +x /usr/local/bin/backup-recovera-db.sh

# Add to crontab (daily at 2 AM)
crontab -e
0 2 * * * /usr/local/bin/backup-recovera-db.sh
```

---

## Environment Configuration

### Development

```env
NODE_ENV=development
DB_HOST=localhost
MPESA_ENVIRONMENT=sandbox
AIRTEL_ENVIRONMENT=sandbox
```

### Staging

```env
NODE_ENV=staging
DB_HOST=staging-db.yourdomain.com
MPESA_ENVIRONMENT=sandbox
AIRTEL_ENVIRONMENT=sandbox
```

### Production

```env
NODE_ENV=production
DB_HOST=prod-db.yourdomain.com
MPESA_ENVIRONMENT=production
AIRTEL_ENVIRONMENT=production
```

---

## Security Hardening

### 1. Firewall Configuration

```bash
# Install UFW
sudo apt install ufw

# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Allow PostgreSQL (only from localhost)
sudo ufw allow from 127.0.0.1 to any port 5432

# Enable firewall
sudo ufw enable
```

### 2. Secure PostgreSQL

```bash
# Edit pg_hba.conf
sudo nano /etc/postgresql/14/main/pg_hba.conf

# Change:
# local   all             all                                     peer
# To:
# local   all             all                                     md5

# Restart PostgreSQL
sudo systemctl restart postgresql
```

### 3. Rate Limiting

Install in backend:

```bash
npm install @nestjs/throttler
```

Configure in `app.module.ts`:

```typescript
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    // ...
  ],
})
```

---

## Monitoring & Maintenance

### 1. Application Monitoring

```bash
# PM2 monitoring
pm2 monit

# Detailed logs
pm2 logs recovera-api --lines 100

# Restart strategy
pm2 restart recovera-api --cron-restart="0 3 * * *"  # Daily at 3 AM
```

### 2. Uptime Monitoring

Use services like:
- **UptimeRobot** (free tier available)
- **Pingdom**
- **StatusCake**

Monitor endpoints:
- `https://api.yourdomain.com/health`
- `https://yourdomain.com`
- `https://admin.yourdomain.com`

### 3. Error Tracking

Install Sentry:

```bash
npm install @sentry/node
```

Configure in `main.ts`:

```typescript
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

### 4. Log Rotation

```bash
# Install logrotate config
sudo nano /etc/logrotate.d/recovera
```

```
/var/log/recovera/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data www-data
    sharedscripts
}
```

---

## Post-Deployment Checklist

- [ ] Backend API responding at `https://api.yourdomain.com`
- [ ] SSL certificates installed and auto-renewal configured
- [ ] Database migrations run successfully
- [ ] Admin portal accessible at `https://admin.yourdomain.com`
- [ ] Mobile app uploaded to Google Play Store
- [ ] All environment variables configured correctly
- [ ] M-Pesa/Airtel Money callbacks registered
- [ ] Firewall configured and enabled
- [ ] Database backups running daily
- [ ] PM2 startup script configured
- [ ] Monitoring and alerts configured
- [ ] Error tracking (Sentry) configured
- [ ] Test all payment flows end-to-end
- [ ] Privacy policy published
- [ ] Terms of service published

---

## Troubleshooting

### Backend won't start

```bash
# Check logs
pm2 logs recovera-api

# Common issues:
# 1. Database connection - verify DB_HOST, credentials
# 2. Port in use - check with: sudo lsof -i :3000
# 3. Missing dependencies - run: npm install
```

### Database connection errors

```bash
# Test connection
psql -U recoverauser -d recovera -h localhost

# Check PostgreSQL is running
sudo systemctl status postgresql

# Check logs
sudo tail -f /var/log/postgresql/postgresql-14-main.log
```

### Payment callbacks not received

1. Verify callback URLs in payment gateway dashboard
2. Check firewall allows incoming connections
3. Test with webhook testing tools (e.g., webhook.site)
4. Check backend logs for incoming requests

---

## Cost Estimates

| Service | Provider | Monthly Cost (Approx) |
|---------|----------|---------------------|
| VPS (2GB RAM, 2 CPUs) | DigitalOcean | $12 |
| Database (Managed PostgreSQL) | DigitalOcean | $15 |
| Admin Hosting | Vercel | $0 (Free tier) |
| Domain | Namecheap | $1 |
| SSL Certificate | Let's Encrypt | $0 |
| **Subtotal** | | **~$28/month** |
| M-Pesa Transaction Fees | Safaricom | Per transaction |
| Airtel Money Fees | Airtel | Per transaction |

**With Managed Services (Heroku/Railway):** ~$50-100/month

---

## Support & Resources

- **Backend**: NestJS Documentation - https://docs.nestjs.com
- **M-Pesa**: Daraja API Docs - https://developer.safaricom.co.ke
- **Airtel Money**: Developer Portal - https://developer.airtel.africa
- **TypeORM**: Official Docs - https://typeorm.io
- **Expo**: Build Guide - https://docs.expo.dev/build/introduction

---

## License

Proprietary - All rights reserved © 2026 Recovera
