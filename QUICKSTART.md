# Recovera - Quick Start Guide

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Android Studio (for mobile development)
- Expo CLI: `npm install -g expo-cli`

## Setup Instructions

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env and add your database credentials

# Create database
createdb recovera

# Start development server
npm run start:dev
```

The backend will be available at `http://localhost:3000`

### 2. Mobile App Setup

```bash
cd mobile

# Install dependencies
npm install

# Update API endpoint
# Edit services/api.ts and change API_BASE_URL to your backend URL

# Start Expo
npm start

# Options:
# - Press 'a' for Android emulator
# - Scan QR code with Expo Go app for physical device
```

### 3. Admin Portal Setup

```bash
cd admin

# Install dependencies
npm install

# Update API endpoint
# Edit src/services/api.ts and change API_BASE_URL

# Start development server
npm run dev
```

The admin portal will be available at `http://localhost:5173`

## API Endpoints Reference

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login

### Billing
- `POST /billing/create-intent` - Create payment intent
- `POST /billing/verify` - Verify payment
- `GET /billing/status/:userId` - Get subscription status

### Device
- `POST /device/bind` - Bind device to account
- `GET /device/list/:userId` - List user devices
- `DELETE /device/:id` - Remove device

### Recovery
- `POST /recovery/report` - Submit scan results
- `GET /recovery/history/:userId` - Get scan history

## Environment Variables

### Backend (.env)

```env
NODE_ENV=development
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=recovera

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Payment Providers
STRIPE_SECRET_KEY=sk_test_...
PAYSTACK_SECRET_KEY=sk_test_...

# CORS
CORS_ORIGIN=http://localhost:5173,http://localhost:19006
```

## Testing the Flow

### 1. Register a User (Mobile or API)

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "deviceId": "device-001",
    "deviceInfo": "Android 13"
  }'
```

### 2. Perform a Scan (Mobile)

```bash
curl -X POST http://localhost:3000/recovery/report \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "userId": "USER_ID",
    "smsCount": 150,
    "whatsappCount": 5,
    "notificationCount": 80,
    "mediaCount": 25
  }'
```

### 3. Create Payment Intent

```bash
curl -X POST http://localhost:3000/billing/create-intent \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "USER_ID",
    "plan": "pro"
  }'
```

## Troubleshooting

### Database Connection Issues

```bash
# Check PostgreSQL is running
pg_isready

# Verify connection
psql -U postgres -d recovera
```

### Mobile App Issues

```bash
# Clear Expo cache
expo start -c

# Reinstall dependencies
rm -rf node_modules
npm install
```

### Backend Build Issues

```bash
# Clear NestJS cache
rm -rf dist
npm run build
```

## Next Steps

1. ✅ Review the implementation in [walkthrough.md](file:///Users/Peter.Mutua/.gemini/antigravity/brain/e00e2301-5fd5-40af-bbc0-5fa0fd23b2bb/walkthrough.md)
2. ✅ Check [task.md](file:///Users/Peter.Mutua/.gemini/antigravity/brain/e00e2301-5fd5-40af-bbc0-5fa0fd23b2bb/task.md) for remaining work
3. ⏳ Implement native Android scanner modules
4. ⏳ Complete payment provider integration
5. ⏳ Build remaining admin features
6. ⏳ Add comprehensive tests
7. ⏳ Deploy to production
