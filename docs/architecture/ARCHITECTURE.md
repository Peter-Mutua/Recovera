# Recovera Platform - Complete System Architecture

## System Overview

Recovera is a three-tier message recovery platform consisting of:
1. **Backend API** (NestJS)
2. **Mobile Application** (Expo React Native)
3. **Admin Portal** (React)

```
┌─────────────────────┐
│   Mobile App        │
│  (Expo RN/Android)  │
└──────────┬──────────┘
           │ REST API
           ▼
┌─────────────────────┐      ┌─────────────────────┐
│   Backend API       │◄─────┤  Admin Portal       │
│   (NestJS)          │      │  (React)            │
└──────────┬──────────┘      └─────────────────────┘
           │
           ▼
┌─────────────────────┐
│   PostgreSQL        │
│   Database          │
└─────────────────────┘
```

---

## Technology Stack

### Backend
- **Framework**: NestJS (Node.js/TypeScript)
- **Database**: PostgreSQL 14+
- **ORM**: TypeORM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: class-validator, class-transformer
- **Password Hashing**: bcrypt

### Mobile
- **Framework**: Expo React Native
- **Navigation**: React Navigation
- **HTTP Client**: Axios
- **Local DB**: Expo SQLite
- **Secure Storage**: Expo SecureStore
- **Target Platform**: Android (primary)

### Admin Portal
- **Framework**: React with Vite
- **Routing**: React Router
- **HTTP Client**: Axios
- **Charts**: Recharts
- **Styling**: CSS Modules

---

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  subscription_status VARCHAR(50) DEFAULT 'inactive',
  subscription_plan VARCHAR(50),
  subscription_expires_at TIMESTAMP,
  is_blocked BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Devices Table
```sql
CREATE TABLE devices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  device_id VARCHAR(255) UNIQUE NOT NULL,
  model VARCHAR(255),
  os_version VARCHAR(100),
  app_version VARCHAR(50),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  last_active_at TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Payments Table
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reference VARCHAR(255) UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  status VARCHAR(50) DEFAULT 'pending',
  provider VARCHAR(50) NOT NULL,
  plan VARCHAR(50) NOT NULL,
  provider_response TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Recovery Reports Table
```sql
CREATE TABLE recovery_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  sms_count INTEGER DEFAULT 0,
  whatsapp_count INTEGER DEFAULT 0,
  notification_count INTEGER DEFAULT 0,
  media_count INTEGER DEFAULT 0,
  device_id VARCHAR(255),
  metadata TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## API Architecture

### Module Structure

```
backend/src/
├── auth/           # Authentication & user management
├── billing/        # Payment processing & subscriptions
├── device/         # Device binding & management
├── recovery/       # Scan results & reports
├── admin/          # Admin operations
└── config/         # Configuration files
```

### Request Flow

```
Mobile App Request
    ↓
JWT Validation (Middleware)
    ↓
Controller (Route Handler)
    ↓
Service (Business Logic)
    ↓
Repository (Database Access)
    ↓
Response
```

---

## Security Architecture

### Authentication Flow

1. User registers/logs in
2. Backend validates credentials
3. JWT token generated (7-day expiry)
4. Token stored in SecureStore (mobile)
5. Token sent with each request (Authorization header)
6. Backend validates token on protected routes

### Data Security

- **Passwords**: Hashed with bcrypt (10 rounds)
- **JWT Tokens**: Signed with secret key
- **Local Messages**: Encrypted in SQLite
- **Secure Storage**: Expo SecureStore for sensitive data
- **HTTPS**: All production traffic encrypted

### Device Binding

- 1 device per Basic/Pro account
- 3 devices per Family account
- Unique device ID enforcement
- Device deactivation on unbind

---

## Subscription Model

### Plans

| Plan | Price | Features | Devices |
|------|-------|----------|---------|
| Basic | $4/mo | SMS + Notifications | 1 |
| Pro | $8/mo | + WhatsApp + Media + Export | 1 |
| Family | $12/mo | All features | 3 |

### Payment Flow

```
User selects plan
    ↓
Backend creates payment intent
    ↓
User completes payment (Stripe/Paystack)
    ↓
Webhook notifies backend
    ↓
Backend verifies payment
    ↓
Subscription activated
    ↓
User gains access
```

---

## Mobile App Architecture

### State Management

- Local state with React hooks
- Secure token storage
- SQLite for recovered data
- API client with interceptors

### Scanner Services

1. **SMS Scanner**: Reads content://sms (requires native module)
2. **WhatsApp Scanner**: Detects local backup files
3. **Notification Scanner**: Captures notification events
4. **Media Scanner**: Finds recoverable media files

### Screen Flow

```
Login/Register
    ↓
Home (Dashboard)
    ↓
Scan Device
    ↓
Results (counts only)
    ↓
Paywall (if not subscribed)
    ↓
Messages (full access)
```

---

## Admin Portal Architecture

### Pages

1. **Dashboard**: Key metrics and activity
2. **Users**: Manage users and subscriptions
3. **Payments**: Track transactions and revenue
4. **Devices**: Monitor device registrations
5. **Analytics**: Charts and insights

### Data Visualization

- Revenue trends (Line chart)
- Plan distribution (Pie chart)
- Scan activity (Bar chart)
- Conversion metrics

---

## Performance Considerations

### Backend Optimizations

- Database indexing on frequently queried fields
- Query pagination (default 20 items)
- Connection pooling
- Async/await for non-blocking operations

### Mobile Optimizations

- Lazy loading of screens
- Optimized FlatList for message display
- Image caching
- Background sync for scans

### Database Indexing

```sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_subscription ON users(subscription_status);
CREATE INDEX idx_devices_user_id ON devices(user_id);
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_reports_user_id ON recovery_reports(user_id);
```

---

## Error Handling

### Backend

- HTTP status codes (400, 401, 404, 409, 500)
- Structured error responses
- Exception filters
- Validation pipes

### Mobile

- Try-catch blocks
- User-friendly error messages
- Network error handling
- Retry logic

---

## Monitoring & Logging

### Recommended Tools

- **Backend Logs**: PM2 logs, Winston
- **Error Tracking**: Sentry
- **Uptime Monitoring**: UptimeRobot
- **Analytics**: Google Analytics (mobile)
- **Performance**: New Relic or Datadog

---

## Scalability Strategy

### Phase 1: Single Server (0-10K users)
- Current architecture sufficient
- Single backend instance
- Single database

### Phase 2: Load Balancing (10K-100K users)
- Multiple backend instances
- Load balancer (Nginx/HAProxy)
- Redis for session storage
- Read replicas for database

### Phase 3: Microservices (100K+ users)
- Separate auth, billing, recovery services
- Message queue (RabbitMQ/Redis)
- Distributed caching
- CDN for static assets

---

## Legal & Compliance

### Play Store Requirements

✅ Only local device data access  
✅ No remote server hacking  
✅ No encryption bypass  
✅ User owns device and data  
✅ Clear privacy policy  

### Privacy Policy Must Include

- Data collection practices
- Local-first approach
- No message upload to servers
- Payment processing disclosure
- Third-party services (Stripe/Paystack)

---

## Future Enhancements

1. **iOS Support**: Swift/SwiftUI implementation
2. **Cloud Backup**: Encrypted cloud storage option
3. **AI Categorization**: Smart message categorization
4. **Multi-language**: i18n support
5. **Dark Mode**: Theme switching
6. **Export Formats**: More export options (Excel, JSON)
7. **Scheduled Scans**: Automated periodic scanning
8. **Family Sharing**: Shared recovery access

---

## Dependencies Summary

### Backend
```json
{
  "@nestjs/core": "^10.0.0",
  "@nestjs/typeorm": "^10.0.0",
  "typeorm": "^0.3.0",
  "pg": "^8.11.0",
  "@nestjs/jwt": "^10.0.0",
  "bcrypt": "^5.1.0",
  "class-validator": "^0.14.0"
}
```

### Mobile
```json
{
  "expo": "~54.0.0",
  "react-native": "0.76.1",
  "@react-navigation/native": "^7.0.0",
  "expo-sqlite": "~16.0.0",
  "expo-secure-store": "~14.0.0",
  "axios": "^1.6.0"
}
```

### Admin
```json
{
  "react": "^18.3.0",
  "react-router-dom": "^7.1.0",
  "axios": "^1.6.0",
  "recharts": "^2.15.0"
}
```
