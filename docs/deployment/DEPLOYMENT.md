# Recovera - Deployment Guide

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Docker & Docker Compose (optional)
- GitHub account (for CI/CD)
- Domain name (for production)

---

## Backend Deployment

### Option 1: Traditional VPS (DigitalOcean, AWS EC2, etc.)

#### 1. Server Setup

```bash
# SSH into your server
ssh root@your-server-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Install PM2 (process manager)
sudo npm install -g pm2
```

#### 2. Database Setup

```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE recovera;
CREATE USER recoverauser WITH ENCRYPTED PASSWORD 'your-secure-password';
GRANT ALL PRIVILEGES ON DATABASE recovera TO recoverauser;
\q
```

#### 3. Deploy Application

```bash
# Clone repository
git clone https://github.com/yourusername/recovera.git
cd recovera/backend

# Install dependencies
npm install

# Create production .env
cp .env.example .env
nano .env  # Edit with production values
```

**Production .env:**
```env
NODE_ENV=production
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=recoverauser
DB_PASSWORD=your-secure-password
DB_DATABASE=recovera

JWT_SECRET=generate-a-very-secure-random-string-here
JWT_EXPIRES_IN=7d

STRIPE_SECRET_KEY=your-live-stripe-key
STRIPE_WEBHOOK_SECRET=your-webhook-secret

CORS_ORIGIN=https://yourdomain.com,https://admin.yourdomain.com
```

```bash
# Build application
npm run build

# Start with PM2
pm2 start dist/main.js --name recovera-api
pm2 save
pm2 startup
```

#### 4. Setup Nginx Reverse Proxy

```bash
sudo apt install nginx -y

# Create Nginx config
sudo nano /etc/nginx/sites-available/recovera
```

**Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/recovera /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 5. SSL Certificate (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d api.yourdomain.com
```

---

### Option 2: Docker Deployment

**Dockerfile (Backend):**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

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

  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DB_HOST=postgres
      - DB_PORT=5432
    depends_on:
      - postgres
    restart: unless-stopped

volumes:
  postgres_data:
```

```bash
# Deploy with Docker
docker-compose up -d
```

---

## Admin Portal Deployment (Vercel/Netlify)

### Vercel Deployment

```bash
cd admin

# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### Netlify Deployment

```bash
cd admin

# Build
npm run build

# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

**Environment Variables (set in Vercel/Netlify):**
```
VITE_API_URL=https://api.yourdomain.com
```

---

## Mobile App Deployment (Google Play Store)

### 1. Build APK

```bash
cd mobile

# Install EAS CLI
npm install -g eas-cli

# Configure EAS
eas build:configure

# Build for Android
eas build --platform android
```

### 2. Prepare for Play Store

**app.json updates:**
```json
{
  "expo": {
    "name": "Recovera",
    "slug": "recovera",
    "version": "1.0.0",
    "android": {
      "package": "com.yourcompany.recovera",
      "versionCode": 1,
      "permissions": [
        "READ_SMS",
        "READ_EXTERNAL_STORAGE",
        "BIND_NOTIFICATION_LISTENER_SERVICE"
      ]
    }
  }
}
```

### 3. Google Play Console

1. Create app in Google Play Console
2. Add store listing details
3. Upload APK
4. Set pricing (Free with in-app purchases)
5. Add privacy policy
6. Submit for review

---

## CI/CD with GitHub Actions

**.github/workflows/deploy.yml:**
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /var/www/recovera/backend
            git pull origin main
            npm install
            npm run build
            pm2 restart recovera-api

  deploy-admin:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID}}
          vercel-project-id: ${{ secrets.PROJECT_ID}}
          vercel-args: '--prod'
          working-directory: ./admin
```

---

## Monitoring & Maintenance

### PM2 Monitoring

```bash
# View logs
pm2 logs recovera-api

# Monitor resources
pm2 monit

# Restart app
pm2 restart recovera-api
```

### Database Backups

```bash
# Backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -U recoverauser recovera > /backups/recovera_$DATE.sql
```

### Health Checks

Create a simple health endpoint:

```typescript
// backend/src/app.controller.ts
@Get('health')
health() {
  return { status: 'ok', timestamp: new Date() };
}
```

---

## Environment Checklist

- [ ] Database credentials secured
- [ ] JWT secret is strong and unique
- [ ] CORS origins configured correctly
- [ ] SSL certificates installed
- [ ] Firewall configured (only ports 80, 443, 22 open)
- [ ] Database backups automated
- [ ] PM2 configured to restart on reboot
- [ ] Environment variables set
- [ ] Payment webhooks configured
- [ ] Error logging setup (Sentry, etc.)
- [ ] Monitoring setup (UptimeRobot, etc.)

---

## Post-Deployment

1. Test all API endpoints
2. Verify payment integration
3. Test mobile app download and functionality
4. Monitor error logs for first 24 hours
5. Setup automated backups
6. Configure alerts for downtime

---

## Scaling Considerations

### When to Scale

- Response time > 500ms consistently
- CPU usage > 70% average
- Database connections maxing out
- More than 10,000 users

### Scaling Options

1. **Vertical Scaling**: Upgrade server resources
2. **Horizontal Scaling**: Add more backend instances with load balancer
3. **Database Scaling**: Read replicas, connection pooling
4. **CDN**: For static assets (admin portal)
5. **Cache Layer**: Redis for sessions and frequently accessed data

---

## Cost Estimates (Monthly)

| Service | Provider | Cost |
|---------|----------|------|
| Backend Server | DigitalOcean Droplet (2GB) | $12 |
| Database | Managed PostgreSQL | $15 |
| Admin Hosting | Vercel/Netlify | $0 (free tier) |
| Domain | Namecheap | $1 |
| SSL | Let's Encrypt | $0 |
| **Total** | | **~$28/month** |

With managed services (Heroku, Railway):
- **Total**: ~$50-100/month (easier setup)
