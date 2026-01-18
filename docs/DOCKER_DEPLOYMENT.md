# Recovera Docker Deployment Guide

## Quick Start

### 1. Prerequisites
- Docker Engine 20.10+
- Docker Compose V2
- 2GB+ free RAM
- 10GB+ free disk space

### 2. Setup Environment

```bash
# Copy environment template
cp .env.docker.example .env

# Edit with your values
nano .env
```

**Required Variables:**
- `DB_PASSWORD` - Strong database password
- `JWT_SECRET` - 64-character random string
- `MPESA_CONSUMER_KEY` - From Daraja Portal
- `MPESA_CONSUMER_SECRET` - From Daraja Portal

### 3. Deploy

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Check status
docker-compose ps
```

### 4. Access Services

- **Backend API**: http://localhost:3000
- **Admin Portal**: http://localhost:8080
- **PostgreSQL**: localhost:5432

### 5. Verify Deployment

```bash
# Test backend health
curl http://localhost:3000/health

# Test admin portal
curl http://localhost:8080

# Check database
docker-compose exec postgres psql -U recoverauser -d recovera -c "\dt"
```

---

## Service Architecture

```
┌─────────────────┐
│  Admin Portal   │ :8080
│    (Nginx)      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐      ┌──────────────┐
│  Backend API    │◄─────┤  PostgreSQL  │
│   (NestJS)      │      │   Database   │
└─────────────────┘      └──────────────┘
       :3000                   :5432
```

---

## Management Commands

### Starting Services

```bash
# Start all services
docker-compose up -d

# Start specific service
docker-compose up -d backend

# Start with logs
docker-compose up
```

### Stopping Services

```bash
# Stop all services
docker-compose stop

# Stop specific service
docker-compose stop backend

# Stop and remove containers
docker-compose down
```

### Viewing Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend

# Last 100 lines
docker-compose logs --tail=100 backend
```

### Rebuilding

```bash
# Rebuild all images
docker-compose build

# Rebuild specific service
docker-compose build backend

# Rebuild without cache
docker-compose build --no-cache
```

### Database Management

```bash
# Access PostgreSQL
docker-compose exec postgres psql -U recoverauser -d recovera

# Backup database
docker-compose exec postgres pg_dump -U recoverauser recovera > backup.sql

# Restore database
docker-compose exec -T postgres psql -U recoverauser -d recovera < backup.sql

# View tables
docker-compose exec postgres psql -U recoverauser -d recovera -c "\dt"
```

### Debugging

```bash
# Enter backend container
docker-compose exec backend sh

# View environment variables
docker-compose exec backend env

# Check backend logs
docker-compose logs backend | grep ERROR

# Restart service
docker-compose restart backend
```

---

## Production Deployment

### 1. Update Environment

```bash
# Set production values in .env
NODE_ENV=production
MPESA_ENVIRONMENT=production
AIRTEL_ENVIRONMENT=production
CORS_ORIGIN=https://yourdomain.com,https://admin.yourdomain.com
```

### 2. Enable Nginx Reverse Proxy

```bash
# Start with production profile
docker-compose --profile production up -d
```

### 3. SSL Configuration

Create SSL certificates:

```bash
# Using Let's Encrypt
mkdir -p nginx/ssl
docker run -it --rm -v $(pwd)/nginx/ssl:/etc/letsencrypt certbot/certbot certonly --standalone -d yourdomain.com
```

### 4. Health Monitoring

```bash
# Check all services are healthy
docker-compose ps

# Expected output:
# NAME                 STATUS
# recovera-postgres    Up (healthy)
# recovera-backend     Up (healthy)
# recovera-admin       Up (healthy)
```

---

## Scaling

### Horizontal Scaling

```bash
# Scale backend instances
docker-compose up -d --scale backend=3

# Add load balancer
# Configure nginx to balance across instances
```

### Resource Limits

Edit `docker-compose.yml`:

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1G
```

---

## Troubleshooting

### Backend Won't Start

```bash
# Check logs
docker-compose logs backend

# Common issues:
# 1. Database not ready - wait for postgres health check
# 2. Missing env variables - check .env file
# 3. Port conflict - change BACKEND_PORT in .env
```

### Database Connection Failed

```bash
# Test database connectivity
docker-compose exec backend nc -zv postgres 5432

# Restart postgres
docker-compose restart postgres

# Check postgres logs
docker-compose logs postgres
```

### Admin Portal 404 Errors

```bash
# Rebuild admin with correct API URL
VITE_API_URL=http://your-backend-url docker-compose build admin
docker-compose up -d admin
```

### Out of Memory

```bash
# Check memory usage
docker stats

# Increase Docker memory limit in Docker Desktop
# Or add swap space on Linux
```

---

## Backup & Restore

### Automated Backups

Create backup script:

```bash
#!/bin/bash
# docker-backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"

# Backup database
docker-compose exec -T postgres pg_dump -U recoverauser recovera | gzip > $BACKUP_DIR/db_$DATE.sql.gz

# Backup volumes
docker run --rm -v recovera_postgres_data:/data -v $BACKUP_DIR:/backup alpine tar czf /backup/volume_$DATE.tar.gz -C /data .

echo "Backup completed: $DATE"
```

```bash
# Make executable
chmod +x docker-backup.sh

# Add to cron (daily at 2 AM)
0 2 * * * /path/to/docker-backup.sh
```

### Restore from Backup

```bash
# Stop services
docker-compose down

# Restore database
gunzip < backup.sql.gz | docker-compose exec -T postgres psql -U recoverauser -d recovera

# Restore volumes
docker run --rm -v recovera_postgres_data:/data -v $(pwd):/backup alpine tar xzf /backup/volume_backup.tar.gz -C /data

# Start services
docker-compose up -d
```

---

## Monitoring

### Container Health

```bash
# View health status
docker-compose ps

# Continuous monitoring
watch -n 5 'docker-compose ps'
```

### Resource Usage

```bash
# Real-time stats
docker stats

# Specific container
docker stats recovera-backend
```

### Log Monitoring

```bash
# Install log monitoring
docker run -d \
  --name=dozzle \
  --volume=/var/run/docker.sock:/var/run/docker.sock \
  -p 9999:8080 \
  amir20/dozzle:latest

# Access at http://localhost:9999
```

---

## Updates & Maintenance

### Updating Services

```bash
# Pull latest changes
git pull origin main

# Rebuild images
docker-compose build

# Apply updates
docker-compose up -d

# Verify
docker-compose ps
```

### Database Migrations

```bash
# Run migrations
docker-compose exec backend npm run typeorm migration:run

# Revert migration
docker-compose exec backend npm run typeorm migration:revert
```

### Cleanup

```bash
# Remove unused images
docker image prune -a

# Remove unused volumes
docker volume prune

# Remove everything (⚠️ DESTRUCTIVE)
docker-compose down -v
docker system prune -a
```

---

## Security Best Practices

1. ✅ Use strong passwords in `.env`
2. ✅ Never commit `.env` to git
3. ✅ Run containers as non-root users
4. ✅ Enable SSL in production
5. ✅ Regularly update base images
6. ✅ Use secrets management (Docker Secrets)
7. ✅ Implement rate limiting
8. ✅ Enable firewall rules
9. ✅ Monitor logs for suspicious activity
10. ✅ Regular security audits

---

## Performance Optimization

### Database

```postgresql
-- Add indexes for common queries
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
```

### Backend

```yaml
# Increase PM2 instances in Dockerfile
CMD ["pm2-runtime", "start", "dist/main.js", "-i", "max"]
```

### Caching

```yaml
# Add Redis for caching
services:
  redis:
    image: redis:alpine
    ports:
      - "6379:6379"
```

---

## Cost Optimization

### Cloud Deployment Costs

| Provider | Service | Monthly Cost |
|----------|---------|--------------|
| DigitalOcean | Droplet (2GB) | $12 |
| AWS | EC2 t3.small | ~$15 |
| Google Cloud | e2-small | ~$13 |
| Linode | Nanode 2GB | $10 |

### Resource Allocation

```yaml
# Minimal setup
postgres: 512MB RAM
backend: 512MB RAM
admin: 256MB RAM
Total: ~1.3GB RAM

# Recommended
postgres: 1GB RAM
backend: 1GB RAM
admin: 512MB RAM
Total: ~2.5GB RAM
```

---

## FAQ

**Q: How do I change the database password?**
```bash
# 1. Update .env
# 2. Recreate postgres container
docker-compose stop postgres
docker volume rm recovera_postgres_data
docker-compose up -d postgres
```

**Q: Can I use external PostgreSQL?**
```bash
# Yes, update .env to point to external DB
DB_HOST=your-external-db.example.com
# Then disable postgres service in docker-compose.yml
```

**Q: How do I view API documentation?**
```bash
# Access Swagger docs (if enabled)
http://localhost:3000/api/docs
```

**Q: How do I add HTTPS?**
```bash
# Use nginx proxy with SSL
# See "Production Deployment" section above
```

---

## Support

- GitHub Issues: https://github.com/yourusername/recovera/issues
- Documentation: `/docs`
- Email: support@recovera.com

---

## License

Proprietary - All rights reserved © 2026 Recovera
