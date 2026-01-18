# Recovera Backend

NestJS-based REST API for the Recovera message recovery platform.

## Features

- ✅ JWT Authentication
- ✅ User Management
- ✅ Subscription & Payment Processing
- ✅ Device Binding
- ✅ Recovery Report Tracking
- ✅ Admin Dashboard APIs
- ✅ PostgreSQL Database

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your database credentials
```

### 3. Setup Database

```bash
npm run db:setup
```

This will:
- Create the PostgreSQL database
- Run schema migrations
- Optionally seed test data

### 4. Start Development Server

```bash
npm run start:dev
```

The API will be available at `http://localhost:3000`

## Available Scripts

- `npm run start` - Start production server
- `npm run start:dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests
- `npm run db:setup` - Setup database (interactive)
- `npm run db:migrate` - Run migrations only
- `npm run db:seed` - Seed test data only

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login

### Billing
- `POST /billing/create-intent` - Create payment intent
- `POST /billing/verify` - Verify payment
- `GET /billing/status/:userId` - Get subscription status

### Device
- `POST /device/bind` - Bind device
- `GET /device/list/:userId` - List user devices
- `DELETE /device/:id` - Remove device

### Recovery
- `POST /recovery/report` - Submit scan results
- `GET /recovery/history/:userId` - Get scan history

### Admin
- `GET /admin/users` - Get all users
- `GET /admin/users/:id` - Get user details
- `POST /admin/users/:id/block` - Block/unblock user
- `GET /admin/payments` - Get all payments
- `GET /admin/devices` - Get all devices
- `GET /admin/statistics` - Get platform statistics

See [API Documentation](../docs/api/API_DOCUMENTATION.md) for complete details.

## Database Schema

The application uses PostgreSQL with the following main tables:
- `users` - User accounts and subscriptions
- `devices` - Device registrations
- `payments` - Payment transactions
- `recovery_reports` - Scan results

See `database/schema.sql` for full schema.

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Project Structure

```
src/
├── auth/           # Authentication module
├── billing/        # Payment & subscription module
├── device/         # Device management module
├── recovery/       # Recovery reports module
├── admin/          # Admin operations module
├── config/         # Configuration
└── main.ts         # Application entry point
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| NODE_ENV | Environment | development |
| PORT | Server port | 3000 |
| DB_HOST | Database host | localhost |
| DB_PORT | Database port | 5432 |
| DB_USERNAME | Database user | postgres |
| DB_PASSWORD | Database password | - |
| DB_DATABASE | Database name | recovera |
| JWT_SECRET | JWT secret key | - |
| JWT_EXPIRES_IN | Token expiry | 7d |
| STRIPE_SECRET_KEY | Stripe API key | - |
| PAYSTACK_SECRET_KEY | Paystack API key | - |

## Production Deployment

See [Deployment Guide](../docs/deployment/DEPLOYMENT.md) for production setup instructions.

## License

Proprietary - All rights reserved
