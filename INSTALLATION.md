# Wakanda-X Installation Guide

## Prerequisites

Before installing dependencies, ensure you have:

1. **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
2. **npm** or **yarn** (comes with Node.js)
3. **Expo CLI** (optional, but recommended)
   ```bash
   npm install -g expo-cli
   ```

## Installation Steps

### 1. Install Dependencies

Using Expo (recommended for Expo projects):

```bash
npx expo install --fix
```

This command will:
- Install all dependencies listed in `package.json`
- Ensure compatible versions for Expo SDK 50
- Fix any version conflicts automatically

### 2. Verify Installation

Run the verification script:

**Windows (PowerShell):**
```powershell
.\scripts\verify-installation-simple.ps1
```

**Mac/Linux:**
```bash
chmod +x scripts/verify-installation.sh
./scripts/verify-installation.sh
```

Or manually check:
- Verify `node_modules` directory exists
- Check that all React Navigation packages are installed
- Ensure Expo packages are present

### 3. Post-Installation Setup

#### 3.1 iOS Setup (macOS only)

If targeting iOS, install CocoaPods dependencies:

```bash
cd ios
pod install
cd ..
```

#### 3.2 Android Setup

Android setup is typically handled automatically by Expo. Ensure you have:
- Android Studio installed
- Android SDK configured
- Environment variables set (ANDROID_HOME, JAVA_HOME)

#### 3.3 Clear Cache (if needed)

If you encounter issues after installation:

```bash
npx expo start -c
```

### 4. Start Development Server

```bash
npx expo start
```

Options:
- Press `a` to open on Android emulator
- Press `i` to open on iOS simulator
- Press `w` to open in web browser
- Scan QR code with Expo Go app on your device

## Critical Dependencies

The following packages are required for navigation and auth functionality:

### React Navigation
- `@react-navigation/native` - Core navigation library
- `@react-navigation/stack` - Stack navigator
- `@react-navigation/bottom-tabs` - Tab navigator

### Peer Dependencies
- `react-native-screens` - Native screen optimizations
- `react-native-safe-area-context` - Safe area handling
- `react-native-gesture-handler` - Gesture recognition

### UI & State Management
- `react-native-paper` - Material Design components
- `@tanstack/react-query` - Server state management
- `i18next` & `react-i18next` - Internationalization

### Storage & Network
- `expo-secure-store` - Secure token storage
- `@react-native-async-storage/async-storage` - Local storage
- `@react-native-community/netinfo` - Network status

## Troubleshooting

### Issue: "Command not found: npx"

**Solution:** Install Node.js from [nodejs.org](https://nodejs.org/) or ensure it's in your PATH.

### Issue: "Module not found" errors

**Solution:**
```bash
rm -rf node_modules package-lock.json
npx expo install --fix
```

### Issue: Metro bundler cache issues

**Solution:**
```bash
npx expo start -c
# Or
npx react-native start --reset-cache
```

### Issue: Native module linking errors

**Solution:**
```bash
npx expo prebuild --clean
```

### Issue: TypeScript errors

**Solution:** Ensure TypeScript is installed:
```bash
npm install --save-dev typescript @types/react @types/react-native
```

## Verification Checklist

After installation, verify:

- [ ] `node_modules` directory exists
- [ ] All React Navigation packages are installed
- [ ] Expo SDK 50 dependencies are compatible
- [ ] TypeScript compilation works
- [ ] Development server starts without errors
- [ ] Navigation screens render correctly
- [ ] Auth flow works (Splash → Role Selector → Phone Input → OTP)

## Next Steps

Once installation is complete:

1. Review the project structure in `src/`
2. Check configuration in `app.json` or `app.config.js`
3. Review environment setup in `src/contexts/ConfigContext.tsx`
4. Start building features following the implementation plan

## Additional Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation Documentation](https://reactnavigation.org/)
- [React Native Paper Documentation](https://callstack.github.io/react-native-paper/)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
