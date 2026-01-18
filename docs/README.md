# Recovera Platform Documentation

Complete documentation for the Recovera message recovery platform.

## 📚 Documentation Index

### Getting Started
- [Project Summary](PROJECT_SUMMARY.md) - Complete platform overview
- [Test Credentials](TEST_CREDENTIALS.md) - Test user accounts and data
- [Subscription Plans](SUBSCRIPTION_PLANS.md) - Pricing and features

### Deployment
- [Deployment Guide](DEPLOYMENT_GUIDE.md) - Traditional VPS deployment
- [Docker Deployment](DOCKER_DEPLOYMENT.md) - Docker & docker-compose setup

### Testing
- [Testing Guide](TESTING_GUIDE.md) - Comprehensive testing procedures
- [Testing Checklist](TESTING_CHECKLIST.md) - Manual test cases
- [Manual Testing Instructions](MANUAL_TESTING_INSTRUCTIONS.md) - Step-by-step flows

### API & Architecture
- [API Documentation](api/API_DOCUMENTATION.md) - Complete API reference
- [Architecture](architecture/ARCHITECTURE.md) - System architecture details

---

## 🚀 Quick Links

### For Developers
1. Start here: [Project Summary](PROJECT_SUMMARY.md)
2. Setup: [Docker Deployment](DOCKER_DEPLOYMENT.md)
3. Test: [Test Credentials](TEST_CREDENTIALS.md)

### For Testing
1. Test users: [Test Credentials](TEST_CREDENTIALS.md)
2. Test flows: [Manual Testing Instructions](MANUAL_TESTING_INSTRUCTIONS.md)
3. Checklist: [Testing Checklist](TESTING_CHECKLIST.md)

### For Deployment
1. Docker: [Docker Deployment](DOCKER_DEPLOYMENT.md)
2. Production: [Deployment Guide](DEPLOYMENT_GUIDE.md)
3. API: [API Documentation](api/API_DOCUMENTATION.md)

---

## 📱 Test Credentials Quick Reference

**Mobile App Users (all use password: `password123`):**
- `john@example.com` - Pro plan ✅
- `sarah@example.com` - Family plan (2 devices) ✅
- `mike@example.com` - Basic plan (expires soon) ⏰
- `lisa@example.com` - Free user (test paywall) 🆓

**Admin Portal:**
- `admin@recovera.com` - Super Admin 👑

See [TEST_CREDENTIALS.md](TEST_CREDENTIALS.md) for complete details.

---

## 💰 Subscription Plans

| Plan | Price | Features | Devices |
|------|-------|----------|---------|
| **Basic** | KES 400/mo | SMS + Notifications | 1 |
| **Pro** | KES 800/mo | + WhatsApp + Media + Export | 1 |
| **Family** | KES 1200/mo | All Pro features | 3 |

See [SUBSCRIPTION_PLANS.md](SUBSCRIPTION_PLANS.md) for detailed comparison.

---

## 🏗️ Project Structure

```
Recovera/
├── backend/              # NestJS API
├── mobile/               # Expo React Native
├── admin/                # React Admin Portal
├── docs/                 # ← Documentation (you are here)
│   ├── api/             # API documentation
│   ├── architecture/    # Architecture docs
│   └── *.md             # Guides and references
└── docker-compose.yml    # Deployment
```

---

## 🔧 Technology Stack

**Backend:**
- NestJS 10.x + TypeORM + PostgreSQL
- JWT Authentication
- Mobile Money Integration (M-Pesa, Airtel)

**Mobile:**
- Expo SDK 54 + React Native 0.76
- React Navigation 7.x
- SQLite + SecureStore

**Admin:**
- React 18.3 + Vite 6.x
- Recharts 2.15
- React Router 7.x

---

## 📊 Documentation Status

| Document | Status | Last Updated |
|----------|--------|--------------|
| Project Summary | ✅ Complete | 2026-01-18 |
| Test Credentials | ✅ Complete | 2026-01-18 |
| Subscription Plans | ✅ Complete | 2026-01-18 |
| Docker Deployment | ✅ Complete | 2026-01-18 |
| Deployment Guide | ✅ Complete | 2026-01-18 |
| Testing Guide | ✅ Complete | 2026-01-18 |
| API Documentation | ✅ Complete | 2026-01-18 |
| Architecture Docs | ✅ Complete | 2026-01-18 |

---

## 📞 Support & Resources

- **GitHub**: https://github.com/yourusername/recovera
- **Issues**: https://github.com/yourusername/recovera/issues
- **Email**: support@recovera.com

---

## 📝 Contributing

When adding new documentation:
1. Place .md files in appropriate subdirectory
2. Update this README.md index
3. Follow existing formatting style
4. Include code examples where relevant
5. Keep documentation up-to-date with code changes

---

*Documentation maintained by the Recovera team. Last updated: January 18, 2026*
