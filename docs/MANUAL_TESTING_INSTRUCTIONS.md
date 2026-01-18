# Recovera Manual Testing Instructions

## Mobile App Testing Instructions

### Prerequisites
- Android device or emulator (Android 10+)
- Node.js 18+ installed
- Expo Go app installed (for testing) OR EAS CLI for builds

### Setup

1. **Navigate to mobile directory**
```bash
cd /Users/Peter.Mutua/Documents/NodeJS/Recovera/mobile
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm start
```

4. **Run on Android**
- Press `a` for Android emulator
- Or scan QR code with Expo Go app on physical device

---

### Test Flow 1: Registration & Login

#### Step 1: Register New User
1. ✅ Open app (should show Login screen)
2. ✅ Tap "Don't have an account? Register"
3. ✅ Enter email: `testuser@example.com`
4. ✅ Enter password: `password123`
5. ✅ Tap "Register"

**Expected Outcome:**
- Registration succeeds
- JWT token stored
- Navigates to Permissions screen

#### Step 2: Grant Permissions
1. ✅ Review permission cards (SMS, Storage, Notifications)
2. ✅ Tap "Grant All Permissions"
3. ✅ Allow SMS permission in Android dialog
4. ✅ Allow Storage permission in Android dialog
5. ✅ For Notifications: Tap "Open Settings" → Enable notification access → Return to app

**Expected Outcome:**
- All permissions show ✅ green checkmarks
- "Continue" button becomes active

#### Step 3: Navigate to Home
1. ✅ Tap "Continue"
2. ✅ Home screen displays with:
   - User email shown
   - Subscription status: "Free Plan"
   - "Start Scan" button visible
   - "Upgrade" button visible

**Expected Outcome:**
- Home screen loads successfully
- User info displays correctly

---

### Test Flow 2: Scanning Process

#### Step 1: Start Scan
1. ✅ From Home screen, tap "Start Scan"
2. ✅ Scan screen displays with progress indicator
3. ✅ Wait for scan to complete (simulated)

**Expected Outcome:**
- Progress bar animates
- Scanning messages displayed
- Scan completes in 5-10 seconds

#### Step 2: View Results
1. ✅ Results display showing:
   - SMS count: XX messages
   - WhatsApp count: XX messages
   - Notifications count: XX messages
   - Media count: XX files
2. ✅ "Upgrade to View Full Messages" button appears

**Expected Outcome:**
- Counts display (may be 0 if no real data)
- Paywall prompt shown

---

### Test Flow 3: Subscription Purchase

#### Step 1: View Plans
1. ✅ From scan results, tap "Upgrade to View Full Messages"
2. ✅ Paywall screen displays with 3 plans:
   - Basic: KES 400/mo
   - Pro: KES 800/mo (Recommended)
   - Family: KES 1200/mo

**Expected Outcome:**
- All plans clearly displayed
- Features listed for each plan

#### Step 2: Select Plan
1. ✅ Tap on "Pro Plan" card
2. ✅ Plan becomes highlighted
3. ✅ Payment provider options appear:
   - M-Pesa
   - Airtel Money
   - Cards

**Expected Outcome:**
- Plan selection works
- Payment providers visible

#### Step 3: M-Pesa Payment (Sandbox)
1. ✅ Select "M-Pesa"
2. ✅ Enter phone number: `254712345678`
3. ✅ Tap "Pay KES 800"
4. ✅ Wait for payment processing

**Expected Outcome (Sandbox Mode):**
- Payment intent created
- Reference number shown
- Success/pending message displayed

#### Step 4: Access Messages
1. ✅ After payment confirmation, navigate to Messages
2. ✅ Full message access granted

**Expected Outcome:**
- Messages screen accessible
- All recovered messages displayed

---

### Test Flow 4: Messages Screen

#### Step 1: View All Messages
1. ✅ Navigate to "Messages" from Home
2. ✅ List displays all recovered messages

**Expected Outcome:**
- Messages grouped by source
- Timestamps shown
- Message content visible

#### Step 2: Filter Messages
1. ✅ Tap filter dropdown
2. ✅ Select "SMS"
3. ✅ Only SMS messages shown
4. ✅ Select "WhatsApp"
5. ✅ Only WhatsApp messages shown

**Expected Outcome:**
- Filtering works correctly
- Source badges match filter

---

### Test Flow 5: Account Management

#### Step 1: Logout & Login
1. ✅ From Home screen, tap menu/profile
2. ✅ Tap "Logout"
3. ✅ Returns to Login screen
4. ✅ Enter email and password
5. ✅ Tap "Login"

**Expected Outcome:**
- Logout clears session
- Login restores session
- Subscription status persists

---

### Common Issues & Solutions

**Issue: Permissions not working**
- Solution: Go to Android Settings → Apps → Recovera → Permissions → Enable manually

**Issue: Scan shows 0 for everything**
- Expected: This is normal in emulator with no real data
- For real testing: Use physical device with actual SMS/WhatsApp data

**Issue: Payment fails**
- Expected: In sandbox mode, payments are simulated
- Check backend logs for payment processing errors

**Issue: App crashes on start**
- Solution: Clear app data, restart Metro bundler
```bash
# Stop server (Ctrl+C)
rm -rf .expo
npm start -- --clear
```

---

## Admin Portal Testing Instructions

### Prerequisites
- Node.js 18+ installed
- Modern browser (Chrome, Firefox, Safari, Edge)

### Setup

1. **Navigate to admin directory**
```bash
cd /Users/Peter.Mutua/Documents/NodeJS/Recovera/admin
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Open in browser**
```
http://localhost:5173
```

---

### Test Flow 1: Dashboard

#### Step 1: View Statistics
1. ✅ Dashboard loads automatically
2. ✅ Verify statistics cards display:
   - Total Users
   - Active Subscriptions
   - Total Revenue (KES)
   - Today's Scans
3. ✅ Check numbers match expected values

**Expected Outcome:**
- All cards display with numbers
- Recent activity list shows latest events

---

### Test Flow 2: User Management

#### Step 1: View Users List
1. ✅ Click "Users" in sidebar
2. ✅ User list table displays with columns:
   - Email
   - Plan
   - Status
   - Registered
   - Actions
3. ✅ Verify pagination (if > 20 users)

**Expected Outcome:**
- Users table loads
- Data formatted correctly
- Badges show plan/status

#### Step 2: View User Details
1. ✅ Click on a user row
2. ✅ User details modal/page opens
3. ✅ Shows:
   - Email
   - Subscription info
   - Devices
   - Payment history
   - Scan history

**Expected Outcome:**
- Detailed user info displays
- Related data shown

#### Step 3: Block User
1. ✅ From user list, click "Block" button
2. ✅ Confirmation dialog appears
3. ✅ Confirm block action
4. ✅ User status changes to "Blocked"
5. ✅ Try logging in as that user (should fail)

**Expected Outcome:**
- User blocked successfully
- Status badge updates
- Login prevented

---

### Test Flow 3: Payment Management

#### Step 1: View Payments
1. ✅ Click "Payments" in sidebar
2. ✅ Payment list displays with:
   - Reference
   - User
   - Amount (KES)
   - Provider (M-Pesa, Airtel, Cards)
   - Status
   - Date
3. ✅ Total revenue shown at top

**Expected Outcome:**
- All payments listed
- Revenue calculation correct

#### Step 2: Filter Payments
1. ✅ Select "Status" filter → "Completed"
2. ✅ Only completed payments shown
3. ✅ Select "Provider" filter → "M-Pesa"
4. ✅ Only M-Pesa payments shown

**Expected Outcome:**
- Filters work correctly
- Revenue recalculates

---

### Test Flow 4: Device Management

#### Step 1: View Devices
1. ✅ Click "Devices" in sidebar
2. ✅ Device grid displays cards showing:
   - Device model (with icon)
   - OS Version
   - Last Active (time ago)
   - User email
3. ✅ Activity status indicators (green = active, gray = inactive)

**Expected Outcome:**
- All devices displayed in grid
- Last active times accurate
- User emails shown

---

### Test Flow 5: Analytics

#### Step 1: View Analytics Dashboard
1. ✅ Click "Analytics" in sidebar
2. ✅ Verify all charts display:
   - Revenue Trend (line chart)
   - Plan Distribution (pie chart)
   - Weekly Scan Activity (bar chart)
3. ✅ Check metrics cards:
   - Conversion Rate
   - Avg Revenue per User
   - Active Users

**Expected Outcome:**
- All 3 charts render correctly
- Metrics calculated accurately
- No console errors

#### Step 2: Analyze Data
1. ✅ Hover over chart data points
2. ✅ Tooltips show detailed info
3. ✅ Check insights section for key findings

**Expected Outcome:**
- Interactive charts work
- Insights text populated

---

### Browser Compatibility Testing

Test in multiple browsers:

**Chrome:**
1. ✅ Open http://localhost:5173 in Chrome
2. ✅ Verify all features work
3. ✅ Check console for errors

**Firefox:**
1. ✅ Open http://localhost:5173 in Firefox
2. ✅ Verify charts render
3. ✅ Test all CRUD operations

**Safari (macOS):**
1. ✅ Open http://localhost:5173 in Safari
2. ✅ Test responsive design
3. ✅ Verify styles correct

---

### Common Issues & Solutions

**Issue: Charts not displaying**
- Solution: Check if `recharts` is installed
```bash
npm install recharts
```

**Issue: API calls failing**
- Solution: Ensure backend is running on port 3000
- Check VITE_API_URL in .env

**Issue: Styles not loading**
- Solution: Clear browser cache, restart dev server

**Issue: Cannot see data**
- Solution: Ensure database has seed data
```bash
cd backend
npm run db:seed
```

---

## Backend API Testing Results

### Test Summary
- ✅ Authentication endpoints
- ✅ Billing endpoints  
- ✅ Device endpoints
- ✅ Recovery endpoints
- ✅ Admin endpoints

### Detailed Test Results
See backend terminal output for specific endpoint test results.

---

## Overall Testing Checklist

### Mobile App ✅
- [ ] Registration works
- [ ] Login works
- [ ] Permissions granted
- [ ] Scan completes
- [ ] Results display
- [ ] Subscription purchase
- [ ] Message viewing
- [ ] Filtering works
- [ ] Logout/Login cycle

### Admin Portal ✅
- [ ] Dashboard loads
- [ ] User management works
- [ ] Block/unblock users
- [ ] Payment list displays
- [ ] Payment filters work
- [ ] Device grid shows
- [ ] Analytics charts render
- [ ] All browsers work

### Integration ✅
- [ ] Mobile → Backend → Database
- [ ] Admin → Backend → Database
- [ ] Payment flow complete
- [ ] Data sync across platforms

---

## Reporting Issues

If you find bugs, document:
1. Steps to reproduce
2. Expected behavior
3. Actual behavior
4. Screenshots/error messages
5. Environment (device, browser, OS)

Create issues at: https://github.com/yourusername/recovera/issues

---

## Next Steps After Testing

1. Fix any bugs found
2. Optimize performance issues
3. Complete missing features
4. Prepare for production deployment
5. Conduct user acceptance testing (UAT)
