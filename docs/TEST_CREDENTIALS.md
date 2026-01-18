# Recovera Test Credentials & Data

## 🔐 Test User Credentials

All test users in the seed database share the same password for convenience during development and testing.

**Universal Password:** `password123`

---

## 📱 Mobile App Test Users

### 1. John (Pro Plan - Active)
```
Email: john@example.com
Password: password123
```

**Account Details:**
- 🎯 **Plan:** Pro
- ✅ **Status:** Active (30 days remaining)
- 📱 **Devices:** 1 device (Samsung Galaxy S21)
- 💰 **Payment History:** 1 completed payment (KES 800)
- 📊 **Scan History:** 2 scans (245 + 180 messages recovered)

**Best For:**
- Testing full Pro features
- Testing with existing subscription
- Testing message recovery with active plan

---

### 2. Sarah (Family Plan - Active)
```
Email: sarah@example.com
Password: password123
```

**Account Details:**
- 🎯 **Plan:** Family
- ✅ **Status:** Active (30 days remaining)
- 📱 **Devices:** 2 devices (Google Pixel 7, OnePlus 10 Pro)
- 💰 **Payment History:** 1 completed payment (KES 1200)
- 📊 **Scan History:** 1 scan (320 messages recovered)

**Best For:**
- Testing Family plan features
- Testing multiple device support (max 3 devices)
- Testing device management

---

### 3. Mike (Basic Plan - Active)
```
Email: mike@example.com
Password: password123
```

**Account Details:**
- 🎯 **Plan:** Basic
- ✅ **Status:** Active (15 days remaining - shorter expiry)
- 📱 **Devices:** 1 device (Xiaomi Mi 11)
- 💰 **Payment History:** 1 completed payment (KES 400)
- 📊 **Scan History:** 1 scan (150 messages recovered)

**Best For:**
- Testing Basic plan limitations
- Testing subscription expiry warnings (expires soon)
- Testing single-device limit

---

### 4. Lisa (Free/Inactive User)
```
Email: lisa@example.com
Password: password123
```

**Account Details:**
- 🎯 **Plan:** None (Free)
- ❌ **Status:** Inactive
- 📱 **Devices:** None
- 💰 **Payment History:** 1 pending payment (KES 800)
- 📊 **Scan History:** 1 scan (95 messages - count only)

**Best For:**
- Testing paywall flow
- Testing subscription purchase
- Testing free user limitations
- Testing upgrade prompts

---

## 💻 Admin Portal Test User

### Super Admin
```
Email: admin@recovera.com
Password: password123
```

**Account Details:**
- 🎯 **Plan:** Pro
- ✅ **Status:** Active (365 days - essentially unlimited)
- 🔑 **Role:** Super Administrator
- 📊 **Access:** Full platform access

**Access URLs:**
- Docker Deployment: `http://localhost:8080`
- Development Server: `http://localhost:5173`

**Permissions:**
- ✅ View all users
- ✅ Block/unblock users
- ✅ View all payments
- ✅ View all devices
- ✅ View analytics and statistics
- ✅ Full platform monitoring

---

## 🗄️ Pre-loaded Test Data

### Users Summary
| Email | Plan | Status | Expires | Devices | Payments |
|-------|------|--------|---------|---------|----------|
| john@example.com | Pro | Active | 30 days | 1 | 1 |
| sarah@example.com | Family | Active | 30 days | 2 | 1 |
| mike@example.com | Basic | Active | 15 days | 1 | 1 |
| lisa@example.com | None | Inactive | - | 0 | 0 |
| admin@recovera.com | Pro | Active | 365 days | 0 | 0 |

### Devices in Database
| Device ID | Model | OS | User | Last Active |
|-----------|-------|----|----|-------------|
| device-001-john | Samsung Galaxy S21 | Android 13 | john@example.com | 2 hours ago |
| device-002-sarah-1 | Google Pixel 7 | Android 14 | sarah@example.com | 1 day ago |
| device-003-sarah-2 | OnePlus 10 Pro | Android 13 | sarah@example.com | 5 hours ago |
| device-004-mike | Xiaomi Mi 11 | Android 12 | mike@example.com | 3 days ago |

### Payment Transactions
| Reference | User | Amount | Provider | Status | Plan |
|-----------|------|--------|----------|--------|------|
| REF-1704717600-abc123 | john@example.com | KES 800 | Stripe | Completed | Pro |
| REF-1704717601-def456 | sarah@example.com | KES 1200 | Stripe | Completed | Family |
| REF-1704717602-ghi789 | mike@example.com | KES 400 | Paystack | Completed | Basic |
| REF-1704717603-jkl012 | lisa@example.com | KES 800 | Stripe | Pending | Pro |

### Recovery Reports
| User | SMS | WhatsApp | Notifications | Media | Total |
|------|-----|----------|---------------|-------|-------|
| john@example.com | 245 | 5 | 120 | 38 | 408 |
| john@example.com | 180 | 3 | 95 | 22 | 300 |
| sarah@example.com | 320 | 8 | 200 | 55 | 583 |
| mike@example.com | 150 | 2 | 80 | 15 | 247 |
| lisa@example.com | 95 | 0 | 45 | 8 | 148 |

**Total Messages Recovered:** 1,686 messages across all test accounts

---

## 🚀 Quick Start Testing Guide

### Mobile App Testing

**Option 1: Test with Subscribed User (Recommended First)**
```bash
cd mobile
npm start
# Press 'a' for Android emulator

# Login with:
Email: john@example.com
Password: password123

# You can immediately:
✅ View all recovered messages
✅ Test message filtering
✅ Test export features
✅ View scan history
```

**Option 2: Test Paywall & Purchase Flow**
```bash
# Login with:
Email: lisa@example.com
Password: password123

# You can test:
✅ Free scan (shows counts only)
✅ Paywall screen
✅ Plan selection
✅ Payment provider selection
✅ M-Pesa/Airtel/Cards flow
```

**Option 3: Test Multiple Devices (Family Plan)**
```bash
# Login with:
Email: sarah@example.com
Password: password123

# You can test:
✅ Device listing (2 devices already registered)
✅ Add 3rd device (should succeed - Family plan)
✅ Try 4th device (should fail - limit reached)
```

**Option 4: Create New Account**
```bash
# Register with any new email
Email: yourname@test.com
Password: password123

# Tests full flow:
✅ Registration
✅ Permission granting
✅ First scan
✅ Paywall
✅ Subscription purchase
```

---

### Admin Portal Testing

**Login to Admin Dashboard:**
```bash
cd admin
npm run dev

# Open browser: http://localhost:5173

# Login with:
Email: admin@recovera.com
Password: password123
```

**Available Test Actions:**

**Dashboard:**
- View total users: 5
- View active subscriptions: 4
- View total revenue: KES 2,400
- View scan statistics

**User Management:**
- View user list (5 users)
- Click on john@example.com to view details
- Block/unblock lisa@example.com
- See subscription status changes

**Payment Management:**
- View 4 transactions
- Filter by status: Completed (3), Pending (1)
- Filter by provider: Stripe (3), Paystack (1)
- See total revenue: KES 2,400

**Device Management:**
- View 4 registered devices
- See last active times
- View device details (model, OS)
- See user associations

**Analytics:**
- View revenue trends
- See plan distribution (Basic: 1, Pro: 2, Family: 1)
- View scan activity graphs
- Check conversion metrics

---

## 🔧 Database Setup

### Load Test Data

**Using Docker (Recommended):**
```bash
./deploy-docker.sh
# Select option 1 for fresh deployment
# Seed data loads automatically
```

**Manual Setup:**
```bash
cd backend
npm run db:setup
# When prompted, answer 'y' to seed test data
```

**Or seed separately:**
```bash
cd backend
psql -U recoverauser -d recovera -f database/seed.sql
```

---

## 🧪 Testing Scenarios

### Scenario 1: New User Journey
1. Register as new user
2. Grant all permissions
3. Perform first scan
4. View count-only results
5. Select Pro plan
6. Complete M-Pesa payment
7. Access full messages

**Use:** Any new email + password123

---

### Scenario 2: Active Subscriber
1. Login with john@example.com
2. Navigate to Messages
3. Filter by SMS, WhatsApp, Notifications
4. View message details
5. Check scan history

**Use:** john@example.com / password123

---

### Scenario 3: Expiring Subscription
1. Login with mike@example.com
2. Check subscription status (expires in 15 days)
3. Verify expiry warning shown
4. Test renewal flow

**Use:** mike@example.com / password123

---

### Scenario 4: Multi-Device Testing
1. Login with sarah@example.com
2. View registered devices (2)
3. Try adding 3rd device (should work - Family plan)
4. Try adding 4th device (should fail)

**Use:** sarah@example.com / password123

---

### Scenario 5: Admin Operations
1. Login to admin portal
2. Block lisa@example.com
3. Try logging in as Lisa (should fail)
4. Unblock Lisa
5. Login should work again

**Admin:** admin@recovera.com / password123  
**Test User:** lisa@example.com / password123

---

## 📊 Expected Statistics (with seed data)

After loading seed data, admin dashboard should show:

- **Total Users:** 5
- **Active Subscriptions:** 4
- **Inactive Users:** 1
- **Total Revenue:** KES 2,400
- **Total Devices:** 4
- **Total Scans:** 5
- **Messages Recovered:** 1,686
- **Plans Distribution:**
  - Basic: 1 user (20%)
  - Pro: 2 users (40%)
  - Family: 1 user (20%)
  - Free: 1 user (20%)

---

## ⚠️ Important Security Notes

### Development Only

These credentials are **FOR TESTING ONLY**:
- ❌ **DO NOT** use in production
- ❌ **DO NOT** commit real user data
- ❌ **DO NOT** use weak passwords in production

### Production Setup

Before deploying to production:

1. **Remove** all test accounts:
```sql
DELETE FROM users WHERE email LIKE '%@example.com';
DELETE FROM users WHERE email = 'admin@recovera.com';
```

2. **Create** secure admin account:
```bash
# Use strong password (minimum 16 characters)
# Use password manager to generate
# Enable 2FA if available
```

3. **Update** password policy:
```typescript
// Minimum 12 characters
// Require uppercase, lowercase, number, special character
// Implement password strength checker
```

4. **Enable** rate limiting on auth endpoints

5. **Monitor** for suspicious login attempts

---

## 🔄 Resetting Test Data

If you need to reset test data to original state:

**Using Docker:**
```bash
docker-compose down -v  # Removes all data
./deploy-docker.sh      # Fresh start
```

**Manual Reset:**
```bash
cd backend

# Drop and recreate database
psql -U postgres -c "DROP DATABASE recovera;"
psql -U postgres -c "CREATE DATABASE recovera;"

# Re-run setup
npm run db:setup
# Answer 'y' to seed data
```

---

## 💡 Testing Tips

1. **Start with john@example.com** - Has full access, easy to verify features
2. **Use lisa@example.com** - Best for testing paywall and purchase flows
3. **Use sarah@example.com** - Test multi-device scenarios
4. **Create new accounts** - Test full registration flow
5. **Use admin@recovera.com** - Full admin access for portal testing

---

## 🐛 Troubleshooting

### Can't Login?

**Check:**
1. Is database running? `docker-compose ps` or `pg_isready`
2. Is seed data loaded? `psql -U recoverauser -d recovera -c "SELECT * FROM users;"`
3. Is backend running? `curl http://localhost:3000/health`

### No Data in Admin Portal?

**Solution:**
```bash
# Reload seed data
cd backend
npm run db:seed
```

### Payment Not Working?

**Remember:**
- M-Pesa/Airtel require API credentials in `.env`
- Sandbox mode doesn't process real payments
- Check backend logs for webhook errors

---

## 📞 Support

If you encounter issues with test credentials:

1. Check `backend/database/seed.sql` for latest data
2. Verify `.env` configuration
3. Check backend logs: `docker-compose logs backend`
4. Review `TESTING_GUIDE.md` for detailed instructions

---

## 📝 Summary

**Default Password for ALL Test Users:** `password123`

**Test Users:**
- john@example.com (Pro - Active)
- sarah@example.com (Family - Active)  
- mike@example.com (Basic - Active)
- lisa@example.com (Free - Inactive)

**Admin:**
- admin@recovera.com (Super Admin)

**Quick Start:**
```bash
# Backend
./deploy-docker.sh

# Mobile
cd mobile && npm start

# Admin
cd admin && npm run dev
```

Happy Testing! 🚀
