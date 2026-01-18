# Recovera Mobile App

React Native mobile application for message recovery on Android devices.

## Features

- 📱 SMS Recovery
- 💬 WhatsApp Backup Detection
- 🔔 Notification Capture
- 📸 Media File Recovery
- 🔒 Secure Local Storage
- 💳 Subscription Management

## Prerequisites

- Node.js 18+
- Expo CLI
- Android Studio (for development)
- Android device or emulator

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure API Endpoint

Edit `services/api.ts` and update the API base URL:

```typescript
const API_BASE_URL = 'http://YOUR_BACKEND_URL:3000';
```

For local development with Android emulator:
```typescript
const API_BASE_URL = 'http://10.0.2.2:3000'; // Android emulator
```

### 3. Start Development Server

```bash
npm start
```

Then:
- Press `a` for Android emulator
- Scan QR code with Expo Go app for physical device

## Available Scripts

- `npm start` - Start Expo development server
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS (requires macOS)
- `npm run web` - Run on web browser

## App Structure

```
src/
├── screens/        # App screens
│   ├── RegisterScreen.tsx
│   ├── LoginScreen.tsx
│   ├── HomeScreen.tsx
│   ├── ScanScreen.tsx
│   ├── PaywallScreen.tsx
│   └── MessagesScreen.tsx
├── services/       # Business logic
│   ├── api.ts      # HTTP client
│   ├── storage.ts  # Local database & secure storage
│   └── scanner.ts  # Scanner services
└── navigation/     # React Navigation setup
    └── AppNavigator.tsx
```

## Screens

### 1. Login/Register
User authentication screens

### 2. Home
Dashboard showing subscription status and quick actions

### 3. Scan
Initiates device scan and shows results

### 4. Paywall
Subscription plan selection and payment

### 5. Messages
Browse recovered messages with filtering

## Scanner Services

### SMS Scanner
Reads Android SMS database via ContentProvider
```
content://sms
```

### WhatsApp Scanner
Detects local backup files in:
```
/Android/media/com.whatsapp/WhatsApp/Databases/
```

### Notification Scanner
Captures notification events via NotificationListenerService

### Media Scanner
Scans for recoverable media files

> **Note**: Scanner services require native Android modules for full functionality

## Permissions Required

```xml
<uses-permission android:name="android.permission.READ_SMS"/>
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
<uses-permission android:name="android.permission.BIND_NOTIFICATION_LISTENER_SERVICE"/>
```

## Local Storage

### Secure Store
User credentials and tokens stored using Expo SecureStore

### SQLite Database
Recovered messages stored in encrypted local database

## Building for Production

### Android

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure
eas build:configure

# Build APK
eas build --platform android
```

## Testing

```bash
# Install on device
npm run android

# Test features:
# 1. Register new account
# 2. Login
# 3. Run scan
# 4. View results
# 5. Subscribe
# 6. Access messages
```

## Troubleshooting

### Metro bundler issues
```bash
expo start -c
```

### Dependency issues
```bash
rm -rf node_modules
npm install
```

### Android build issues
```bash
cd android
./gradlew clean
cd ..
```

## Environment Setup

For local development, ensure backend is running:

```bash
cd ../backend
npm run start:dev
```

## Production Checklist

- [ ] Update API_BASE_URL to production
- [ ] Configure app.json with correct package name
- [ ] Add all required permissions
- [ ] Implement native scanner modules
- [ ] Test on physical Android device
- [ ] Create privacy policy
- [ ] Prepare Play Store assets
- [ ] Build release APK

## Native Modules Required

The following native modules need implementation:

1. **SMS Scanner** - Access ContentProvider
2. **WhatsApp Scanner** - File system access
3. **Notification Listener** - Background service
4. **Media Scanner** - MediaStore access

See [Architecture Documentation](../docs/architecture/ARCHITECTURE.md) for details.

## License

Proprietary - All rights reserved
