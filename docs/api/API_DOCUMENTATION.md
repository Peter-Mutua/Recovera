# Recovera Platform - API Documentation

## Base URL
```
http://localhost:3000
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer {token}
```

---

## Auth Endpoints

### Register
**POST** `/auth/register`

Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "deviceId": "device-unique-id",
  "deviceInfo": "Samsung Galaxy S21"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": "uuid-here",
  "email": "user@example.com"
}
```

### Login
**POST** `/auth/login`

Authenticate existing user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": "uuid-here",
  "email": "user@example.com",
  "subscriptionStatus": "active",
  "subscriptionPlan": "pro"
}
```

---

## Billing Endpoints

### Create Payment Intent
**POST** `/billing/create-intent`

Create a payment intent for subscription.

**Request Body:**
```json
{
  "userId": "uuid-here",
  "plan": "pro"
}
```

**Response:**
```json
{
  "reference": "REF-1234567890-abc123",
  "amount": 800,
  "currency": "USD",
  "paymentUrl": "https://checkout.stripe.com/pay/..."
}
```

### Verify Payment
**POST** `/billing/verify`

Verify payment completion.

**Request Body:**
```json
{
  "reference": "REF-1234567890-abc123",
  "provider": "stripe"
}
```

**Response:**
```json
{
  "status": "active",
  "plan": "pro",
  "expiresAt": "2026-02-18T10:00:00.000Z"
}
```

### Get Subscription Status
**GET** `/billing/status/:userId`

Get user's subscription status.

**Response:**
```json
{
  "status": "active",
  "plan": "pro",
  "expiresAt": "2026-02-18T10:00:00.000Z"
}
```

---

## Device Endpoints

### Bind Device
**POST** `/device/bind`

Bind a device to user account.

**Request Body:**
```json
{
  "userId": "uuid-here",
  "deviceId": "device-unique-id",
  "model": "Samsung Galaxy S21",
  "osVersion": "Android 13"
}
```

**Response:**
```json
{
  "deviceId": "uuid-here",
  "message": "Device bound successfully"
}
```

### List Devices
**GET** `/device/list/:userId`

Get all devices for a user.

**Response:**
```json
[
  {
    "id": "uuid-here",
    "deviceId": "device-unique-id",
    "model": "Samsung Galaxy S21",
    "osVersion": "Android 13",
    "lastActiveAt": "2026-01-18T10:00:00.000Z",
    "createdAt": "2026-01-01T10:00:00.000Z"
  }
]
```

### Delete Device
**DELETE** `/device/:id`

Remove a device from account.

**Response:**
```json
{
  "message": "Device removed successfully"
}
```

---

## Recovery Endpoints

### Submit Report
**POST** `/recovery/report`

Submit scan results.

**Request Body:**
```json
{
  "userId": "uuid-here",
  "smsCount": 150,
  "whatsappCount": 5,
  "notificationCount": 80,
  "mediaCount": 25,
  "deviceId": "device-unique-id",
  "metadata": "{}"
}
```

**Response:**
```json
{
  "reportId": "uuid-here",
  "summary": {
    "sms": 150,
    "whatsapp": 5,
    "notifications": 80,
    "media": 25
  }
}
```

### Get History
**GET** `/recovery/history/:userId`

Get user's scan history.

**Response:**
```json
[
  {
    "id": "uuid-here",
    "smsCount": 150,
    "whatsappCount": 5,
    "notificationCount": 80,
    "mediaCount": 25,
    "createdAt": "2026-01-18T10:00:00.000Z"
  }
]
```

---

## Admin Endpoints

### Get Users
**GET** `/admin/users?page=1&limit=20&status=active`

Get paginated list of users.

**Query Parameters:**
- `page` (optional): Page number, default 1
- `limit` (optional): Items per page, default 20
- `status` (optional): Filter by subscription status

**Response:**
```json
{
  "data": [
    {
      "id": "uuid-here",
      "email": "user@example.com",
      "subscriptionStatus": "active",
      "subscriptionPlan": "pro",
      "isBlocked": false,
      "createdAt": "2026-01-01T10:00:00.000Z"
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 20,
  "totalPages": 5
}
```

### Get User By ID
**GET** `/admin/users/:id`

Get detailed user information.

**Response:**
```json
{
  "id": "uuid-here",
  "email": "user@example.com",
  "subscriptionStatus": "active",
  "subscriptionPlan": "pro",
  "subscriptionExpiresAt": "2026-02-18T10:00:00.000Z",
  "isBlocked": false,
  "createdAt": "2026-01-01T10:00:00.000Z",
  "devices": [...],
  "payments": [...],
  "totalScans": 5
}
```

### Block/Unblock User
**POST** `/admin/users/:id/block`

Block or unblock a user.

**Request Body:**
```json
{
  "isBlocked": true
}
```

**Response:**
```json
{
  "message": "User blocked successfully"
}
```

### Get Payments
**GET** `/admin/payments?page=1&limit=20&status=completed`

Get paginated list of payments.

**Response:**
```json
{
  "data": [...],
  "total": 200,
  "page": 1,
  "limit": 20,
  "totalPages": 10
}
```

### Get Devices
**GET** `/admin/devices?userId=uuid-here`

Get all devices, optionally filtered by user.

**Response:**
```json
[
  {
    "id": "uuid-here",
    "deviceId": "device-unique-id",
    "model": "Samsung Galaxy S21",
    "lastActiveAt": "2026-01-18T10:00:00.000Z",
    "user": {...}
  }
]
```

### Get Statistics
**GET** `/admin/statistics`

Get platform statistics.

**Response:**
```json
{
  "totalUsers": 1250,
  "activeSubscriptions": 890,
  "totalRevenue": 7120,
  "todayScans": 45,
  "conversionRate": "71.20"
}
```

---

## Error Responses

All endpoints may return the following error formats:

**400 Bad Request**
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

**401 Unauthorized**
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

**404 Not Found**
```json
{
  "statusCode": 404,
  "message": "User not found",
  "error": "Not Found"
}
```

**409 Conflict**
```json
{
  "statusCode": 409,
  "message": "Email already registered",
  "error": "Conflict"
}
```

---

## Subscription Plans

| Plan | Price | Features |
|------|-------|----------|
| BASIC | $4/mo | SMS + Notifications, 1 device |
| PRO | $8/mo | All Basic + WhatsApp + Media, 1 device |
| FAMILY | $12/mo | All Pro features, 3 devices |
