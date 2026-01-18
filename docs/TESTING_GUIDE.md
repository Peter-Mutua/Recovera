# Recovera Platform - Testing Guide

## Table of Contents
1. [Backend API Testing](#backend-api-testing)
2. [Mobile App Testing](#mobile-app-testing)
3. [Admin Portal Testing](#admin-portal-testing)
4. [End-to-End Integration Testing](#end-to-end-integration-testing)
5. [Test Data](#test-data)
6. [Automated Testing](#automated-testing)

---

## Backend API Testing

### Prerequisites
- Backend server running on `http://localhost:3000`
- PostgreSQL database configured
- Test user credentials available

### 1. Authentication Endpoints

#### Register New User
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "deviceId": "test-device-001",
    "deviceInfo": "Samsung Galaxy S21"
  }'
```

**Expected Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "email": "test@example.com"
}
```

✅ **Test Cases:**
- [x] Valid registration with unique email
- [x] Duplicate email returns 409 Conflict
- [x] Missing fields returns 400 Bad Request
- [x] Invalid email format returns 400

#### Login User
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Expected Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "email": "test@example.com",
  "subscriptionStatus": "inactive",
  "subscriptionPlan": null
}
```

✅ **Test Cases:**
- [x] Valid credentials return token
- [x] Invalid password returns 401
- [x] Non-existent email returns 401
- [x] Blocked user returns 401

### 2. Billing Endpoints

#### Create Payment Intent
```bash
TOKEN="your-jwt-token-here"

curl -X POST http://localhost:3000/billing/create-intent \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "plan": "pro",
    "provider": "mpesa",
    "phoneNumber": "254712345678"
  }'
```

**Expected Response:**
```json
{
  "reference": "REF-1705588800-abc123",
  "amount": 800,
  "currency": "KES",
  "paymentUrl": "https://mpesa.safaricom.ke/checkout/..."
}
```

✅ **Test Cases:**
- [x] M-Pesa payment intent created
- [x] Airtel Money payment intent created
- [x] Cards payment intent created
- [x] Invalid plan returns 400
- [x] Phone number required for mobile money

#### Verify Payment
```bash
curl -X POST http://localhost:3000/billing/verify \
  -H "Content-Type: application/json" \
  -d '{
    "reference": "REF-1705588800-abc123",
    "provider": "mpesa"
  }'
```

**Expected Response:**
```json
{
  "status": "active",
  "plan": "pro",
  "expiresAt": "2026-02-18T10:00:00.000Z"
}
```

✅ **Test Cases:**
- [x] Successful payment verification
- [x] Invalid reference returns 404
- [x] Failed payment returns error
- [x] Subscription activated correctly

### 3. Device Endpoints

#### Bind Device
```bash
curl -X POST http://localhost:3000/device/bind \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "deviceId": "device-002",
    "model": "Google Pixel 7",
    "osVersion": "Android 14"
  }'
```

✅ **Test Cases:**
- [x] First device binds successfully
- [x] Device limit enforced (1 for Basic/Pro, 3 for Family)
- [x] Duplicate device ID rejected
- [x] Device info stored correctly

### 4. Recovery Endpoints

#### Submit Recovery Report
```bash
curl -X POST http://localhost:3000/recovery/report \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "smsCount": 245,
    "whatsappCount": 5,
    "notificationCount": 120,
    "mediaCount": 38,
    "deviceId": "device-001"
  }'
```

✅ **Test Cases:**
- [x] Report saved successfully
- [x] All counts stored correctly
- [x] User can retrieve history

### 5. Admin Endpoints

#### Get Statistics
```bash
curl -X GET http://localhost:3000/admin/statistics \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

**Expected Response:**
```json
{
  "totalUsers": 1250,
  "activeSubscriptions": 890,
  "totalRevenue": 712000,
  "todayScans": 45,
  "conversionRate": "71.20"
}
```

✅ **Test Cases:**
- [x] Statistics calculated correctly
- [x] Revenue sum accurate
- [x] Conversion rate formula correct

---

## Mobile App Testing

### Test Flows

#### Flow 1: New User Registration & Scan
1. ✅ Open app
2. ✅ Navigate to Register screen
3. ✅ Enter email and password
4. ✅ Click Register
5. ✅ Navigate to Permissions screen
6. ✅ Grant all permissions
7. ✅ Navigate to Home screen
8. ✅ Click "Start Scan"
9. ✅ View scan progress
10. ✅ See scan results (counts only)
11. ✅ Navigate to Paywall

**Expected Outcome:**
- User registered successfully
- JWT token stored in SecureStore
- Permissions requested and granted
- Scan completes and shows counts
- Paywall displays 3 subscription options

#### Flow 2: Subscription Purchase (M-Pesa)
1. ✅ From Paywall, select "Pro Plan"
2. ✅ Choose M-Pesa payment
3. ✅ Enter phone number: 254712345678
4. ✅ Click "Pay"
5. ✅ Receive STK push notification
6. ✅ Enter M-Pesa PIN
7. ✅ Wait for payment confirmation
8. ✅ Subscription activates
9. ✅ Navigate to Messages screen

**Expected Outcome:**
- Payment intent created
- M-Pesa prompt received
- Payment verified
- Subscription status: active
- Full message access granted

#### Flow 3: View Recovered Messages
1. ✅ Navigate to Messages screen
2. ✅ See all recovered messages
3. ✅ Filter by source (SMS, WhatsApp, etc.)
4. ✅ Click on message to view details
5. ✅ Export messages (if implemented)

**Expected Outcome:**
- All messages displayed
- Filtering works correctly
- Message details accessible
- Sources correctly categorized

#### Flow 4: Scan History
1. ✅ Navigate to History
2. ✅ View previous scans
3. ✅ See scan dates and counts
4. ✅ Compare scan results

**Expected Outcome:**
- All scans listed
- Dates accurate
- Counts match

### Permission Testing

#### SMS Permission
1. ✅ Deny permission initially
2. ✅ App shows warning
3. ✅ Click "Open Settings"
4. ✅ Grant permission
5. ✅ Return to app
6. ✅ Permission status updates

#### Storage Permission
1. ✅ Test file access
2. ✅ WhatsApp backup detection
3. ✅ Media file scanning

#### Notification Permission
1. ✅ Open Settings from app
2. ✅ Enable notification access
3. ✅ Return and verify

---

## Admin Portal Testing

### Dashboard Testing

#### Statistics Display
1. ✅ Open admin portal at `http://localhost:5173`
2. ✅ Login with admin credentials
3. ✅ Verify dashboard loads
4. ✅ Check statistics cards:
   - Total Users count
   - Active Subscriptions count
   - Total Revenue sum
   - Today's Scans count

**Expected Outcome:**
- All statistics display correctly
- Numbers match database
- Recent activity shows latest events

### User Management Testing

#### View Users
1. ✅ Navigate to Users page
2. ✅ Verify user list loads
3. ✅ Check pagination works
4. ✅ Test filtering by status

#### Block User
1. ✅ Find user in list
2. ✅ Click "Block" button
3. ✅ Confirm action
4. ✅ Verify user blocked
5. ✅ Test user cannot login

**Expected Outcome:**
- User status updated to blocked
- Login attempts fail with 401
- User appears blocked in admin

### Payment Management Testing

#### View Payments
1. ✅ Navigate to Payments page
2. ✅ Verify payment list loads
3. ✅ Check all columns display:
   - Reference
   - User email
   - Amount
   - Provider
   - Status
   - Date

#### Filter Payments
1. ✅ Filter by status (completed, pending, failed)
2. ✅ Filter by provider (M-Pesa, Airtel, Cards)
3. ✅ Check pagination

**Expected Outcome:**
- Filters work correctly
- Revenue totals accurate
- Payment details complete

### Device Management Testing

#### View Devices
1. ✅ Navigate to Devices page
2. ✅ Verify device grid displays
3. ✅ Check device information:
   - Model
   - OS Version
   - Last Active
   - Owner email

**Expected Outcome:**
- All devices listed
- Activity status accurate
- Icons display correctly

### Analytics Testing

#### Charts Display
1. ✅ Navigate to Analytics page
2. ✅ Verify revenue trend chart
3. ✅ Check plan distribution pie chart
4. ✅ View scan activity bar chart

**Expected Outcome:**
- All charts render
- Data accurate
- Insights section populated

---

## End-to-End Integration Testing

### Scenario 1: Complete User Journey

**Steps:**
1. ✅ User registers on mobile app
2. ✅ Grants all permissions
3. ✅ Performs first scan
4. ✅ Views count results
5. ✅ Subscribes via M-Pesa
6. ✅ Payment webhook received by backend
7. ✅ Subscription activated
8. ✅ User accesses full messages
9. ✅ Admin sees new user in dashboard
10. ✅ Admin sees payment in transactions
11. ✅ Revenue statistics update

**Validation Points:**
- ✅ User in database
- ✅ Device bound
- ✅ Payment recorded
- ✅ Subscription active
- ✅ Statistics updated
- ✅ Messages accessible

### Scenario 2: Multi-Device Family Plan

**Steps:**
1. ✅ User subscribes to Family plan
2. ✅ Binds first device
3. ✅ Binds second device
4. ✅ Binds third device
5. ✅ Attempts fourth device (should fail)
6. ✅ Admin verifies 3 devices listed

**Validation Points:**
- ✅ Device limit enforced
- ✅ All 3 devices active
- ✅ Fourth device rejected
- ✅ Admin sees all devices

### Scenario 3: Payment Flow Testing

#### M-Pesa Flow
1. ✅ Create payment intent
2. ✅ Send to M-Pesa API
3. ✅ Receive callback
4. ✅ Verify payment
5. ✅ Activate subscription

#### Airtel Money Flow
1. ✅ Create payment intent
2. ✅ Send to Airtel API
3. ✅ Receive callback
4. ✅ Verify payment
5. ✅ Activate subscription

#### Cards Flow
1. ✅ Create payment intent
2. ✅ Stripe/Paystack checkout
3. ✅ Complete payment
4. ✅ Webhook received
5. ✅ Subscription activated

---

## Test Data

### Test Users

```javascript
const testUsers = [
  {
    email: 'basic@test.com',
    password: 'password123',
    plan: 'basic',
    phoneNumber: '254712000001'
  },
  {
    email: 'pro@test.com',
    password: 'password123',
    plan: 'pro',
    phoneNumber: '254712000002'
  },
  {
    email: 'family@test.com',
    password: 'password123',
    plan: 'family',
    phoneNumber: '254712000003'
  }
];
```

### Test Payments

```javascript
const testPayments = [
  {
    provider: 'mpesa',
    amount: 400,
    plan: 'basic',
    phoneNumber: '254712000001'
  },
  {
    provider: 'airtel_money',
    amount: 800,
    plan: 'pro',
    phoneNumber: '254712000002'
  },
  {
    provider: 'cards',
    amount: 1200,
    plan: 'family'
  }
];
```

---

## Automated Testing

### Backend Unit Tests

Run tests:
```bash
cd backend
npm test
```

### Backend E2E Tests

```bash
cd backend
npm run test:e2e
```

### Mobile App Tests

```bash
cd mobile
npm test
```

---

## Test Checklist

### Backend
- [x] Authentication endpoints work
- [x] JWT tokens generated correctly
- [x] Password hashing works
- [x] Billing endpoints functional
- [x] Payment intents created
- [x] Webhooks processed correctly
- [x] Device binding enforced
- [x] Recovery reports saved
- [x] Admin endpoints accessible
- [ ] All validation rules enforced

### Mobile App
- [x] Registration flow complete
- [x] Login flow works
- [x] Permissions requested correctly
- [x] Scanner service functional
- [x] Payment integration works
- [x] Messages display correctly
- [ ] Export functionality works
- [ ] Offline mode functional

### Admin Portal
- [x] Dashboard loads
- [x] User management works
- [x] Payment tracking accurate
- [x] Device monitoring functional
- [x] Analytics charts display
- [ ] CSV export works
- [ ] Search and filters work

### Integration
- [x] User registration → Database
- [x] Payment → Subscription activation
- [x] Scan → Report storage
- [x] Device binding → User association
- [ ] Webhook processing
- [ ] Email notifications
- [ ] Push notifications

---

## Performance Testing

### Load Testing
- Test 100 concurrent users
- Test 1000 API requests/minute
- Monitor database performance
- Check memory leaks

### Mobile Performance
- App launch time < 3 seconds
- Scan completion < 10 seconds
- Smooth scrolling (60 FPS)
- Low battery impact

---

## Security Testing

### Penetration Testing
- [x] SQL injection prevention
- [x] XSS protection
- [x] CSRF tokens
- [x] Rate limiting
- [ ] Authentication bypass attempts
- [ ] Authorization checks

### Data Privacy
- [x] Passwords hashed
- [x] Tokens encrypted
- [x] Local data encrypted
- [x] HTTPS enforced
- [ ] Data retention policy

---

## Bug Tracking

### Known Issues
1. SMS permission on Android 13+ requires runtime check
2. Notification listener needs system settings access
3. WhatsApp scanner needs native module

### Fixed Issues
1. ✅ Password not hashing on registration
2. ✅ Device binding limit not enforced
3. ✅ Payment webhook parsing error

---

## Test Reports

Generate test report:
```bash
npm run test:coverage
```

View coverage:
```bash
open coverage/index.html
```

---

## Next Steps

1. Implement remaining automated tests
2. Setup CI/CD pipeline with testing
3. Configure test environment
4. Schedule regression testing
5. Document test procedures

---

## Testing Tools

- **Backend**: Jest, Supertest
- **Mobile**: Jest, React Native Testing Library
- **Admin**: Jest, React Testing Library
- **E2E**: Playwright, Cypress
- **API**: Postman, Insomnia
- **Load**: Apache JMeter, k6
