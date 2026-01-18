# Recovera - Manual Testing Checklist

## Backend API Tests

### Authentication
- [ ] Register with valid email and password
- [ ] Register with duplicate email (should fail)
- [ ] Login with valid credentials
- [ ] Login with invalid password (should fail)
- [ ] Login with non-existent email (should fail)
- [ ] Login with blocked account (should fail)

### Billing
- [ ] Create M-Pesa payment intent
- [ ] Create Airtel Money payment intent
- [ ] Create Cards payment intent
- [ ] Verify completed payment
- [ ] Check subscription activation after payment
- [ ] Get subscription status

### Devices
- [ ] Bind first device successfully
- [ ] Bind second device (should fail for Basic/Pro)
- [ ] Bind three devices (should work for Family plan)
- [ ] List user devices
- [ ] Delete/unbind device

### Recovery
- [ ] Submit scan report
- [ ] Get scan history
- [ ] Verify counts stored correctly

### Admin
- [ ] Get platform statistics
- [ ] List all users with pagination
- [ ] Get user details
- [ ] Block/unblock user
- [ ] List all payments
- [ ] List all devices

## Mobile App Tests

### Registration & Login
- [ ] Open app for first time
- [ ] Navigate to Register screen
- [ ] Enter email and password
- [ ] Submit registration
- [ ] Receive and store JWT token
- [ ] Navigate to Login screen
- [ ] Login with credentials
- [ ] Token persists across app restarts

### Permissions
- [ ] Permission screen displays on first launch
- [ ] Request SMS permission
- [ ] Request Storage permission
- [ ] Request Notification permission
- [ ] Grant all permissions button works
- [ ] Continue without some permissions (shows warning)
- [ ] Permissions persist across app restarts

### Scanning
- [ ] Navigate to Scan screen
- [ ] Start scan process
- [ ] See progress indicator
- [ ] Scan completes successfully
- [ ] Results show counts for:
  - [ ] SMS messages
  - [ ] WhatsApp backups
  - [ ] Notifications
  - [ ] Media files
- [ ] Navigate to Paywall after scan

### Subscription
- [ ] Paywall displays 3 plans
- [ ] Select Basic plan (KES 400)
- [ ] Select Pro plan (KES 800)
- [ ] Select Family plan (KES 1200)
- [ ] Choose M-Pesa payment
- [ ] Enter phone number
- [ ] Receive M-Pesa prompt
- [ ] Complete payment
- [ ] Subscription activates
- [ ] Access granted to messages

### Messages
- [ ] Navigate to Messages screen
- [ ] All recovered messages display
- [ ] Filter by SMS
- [ ] Filter by WhatsApp
- [ ] Filter by Notifications
- [ ] Message details viewable
- [ ] Proper timestamps

### Navigation
- [ ] All screens accessible
- [ ] Back button works
- [ ] Drawer/menu navigation works
- [ ] Deep linking works (if implemented)

## Admin Portal Tests

### Dashboard
- [ ] Dashboard loads successfully
- [ ] Total Users displays correctly
- [ ] Active Subscriptions count accurate
- [ ] Total Revenue calculates correctly
- [ ] Today's Scans shows current count
- [ ] Recent activity updates

### User Management
- [ ] Users list loads with pagination
- [ ] Search users by email
- [ ] Filter by subscription status
- [ ] Click user to view details
- [ ] Block user
- [ ] Unblock user
- [ ] User details show:
  - [ ] Email
  - [ ] Subscription status
  - [ ] Devices
  - [ ] Payments
  - [ ] Scan history

### Payment Management
- [ ] Payments list displays
- [ ] Filter by status
- [ ] Filter by provider
- [ ] Revenue total calculates correctly
- [ ] Payment details viewable
- [ ] Export to CSV (if implemented)

### Device Management
- [ ] All devices display in grid
- [ ] Device info shows:
  - [ ] Model
  - [ ] OS Version
  - [ ] Last Active
  - [ ] User email
- [ ] Activity status accurate (Active now / X hours ago)
- [ ] Proper icons for Android/iOS

### Analytics
- [ ] Revenue trend chart displays
- [ ] Plan distribution pie chart shows
- [ ] Scan activity bar chart renders
- [ ] Metrics cards accurate:
  - [ ] Conversion Rate
  - [ ] Avg Revenue per User
  - [ ] Active Users
- [ ] Insights section populated

## End-to-End Integration Tests

### Complete User Journey
1. [ ] User registers on mobile
2. [ ] Grants permissions
3. [ ] Performs scan
4. [ ] Selects subscription
5. [ ] Pays via M-Pesa
6. [ ] Subscription activates
7. [ ] Messages unlocked
8. [ ] Admin sees new user
9. [ ] Admin sees payment
10. [ ] Statistics update

### Payment Provider Tests
- [ ] M-Pesa complete flow
- [ ] Airtel Money complete flow
- [ ] Cards complete flow
- [ ] All update subscription status

### Multi-Device Tests
- [ ] Family plan allows 3 devices
- [ ] Basic plan allows 1 device
- [ ] Pro plan allows 1 device
- [ ] 4th device rejected for Family
- [ ] 2nd device rejected for Basic/Pro

## Performance Tests
- [ ] App launches in < 3 seconds
- [ ] API responds in < 500ms
- [ ] Scan completes in < 30 seconds
- [ ] Page loads in < 2 seconds
- [ ] No memory leaks after 30 min use

## Security Tests
- [ ] Passwords are hashed
- [ ] JWT tokens expire correctly
- [ ] Unauthorized access blocked
- [ ] SQL injection prevented
- [ ] XSS attack prevented
- [ ] CORS configured correctly
- [ ] Rate limiting works

## Browser/Device Compatibility
### Mobile (App)
- [ ] Android 10
- [ ] Android 11
- [ ] Android 12
- [ ] Android 13
- [ ] Android 14

### Admin (Web)
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

## Regression Tests
After any update, verify:
- [ ] Login still works
- [ ] Registration still works
- [ ] Payments still process
- [ ] Scans still complete
- [ ] Admin dashboard loads

## Notes
- Test with real M-Pesa sandbox
- Use test phone numbers
- Clear app data between tests
- Check database state after each test
- Monitor error logs
