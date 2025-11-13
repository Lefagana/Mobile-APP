# Wakanda-X

A frontend-first, customer-only mobile application built with React Native and Expo for the Nigerian e-commerce market.

## Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (optional)

### Installation

1. **Install dependencies:**
   ```bash
   npx expo install --fix
   ```

2. **Verify installation:**
   ```bash
   # Windows
   .\scripts\verify-installation.ps1
   
   # Mac/Linux
   chmod +x scripts/verify-installation.sh
   ./scripts/verify-installation.sh
   ```

3. **Start development server:**
   ```bash
   npx expo start
   ```

For detailed installation instructions, see [INSTALLATION.md](./INSTALLATION.md).

## Project Structure

```
src/
├── navigation/          # Navigation setup (AuthStack, CustomerStack)
├── screens/            # Screen components
│   ├── auth/          # Authentication screens
│   ├── home/          # Home feed and product screens
│   ├── cart/          # Cart and checkout screens
│   ├── orders/        # Order management screens
│   ├── profile/       # User profile and settings
│   └── ...
├── components/         # Reusable UI components
├── contexts/           # React contexts (Auth, Cart, Network, etc.)
├── services/           # API services and mock server
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── theme/              # Theme configuration
└── i18n/               # Internationalization
```

## Features

- ✅ Authentication flow (OTP-based)
- ✅ Navigation structure (Stack + Bottom Tabs)
- ✅ Theme system (Material Design)
- ✅ Internationalization (English, Pidgin, Hausa)
- ✅ Offline-first architecture
- ✅ Mock API server for development

## Tech Stack

- **Framework:** React Native + Expo SDK 50
- **Navigation:** React Navigation 6
- **UI Library:** React Native Paper (Material Design)
- **State Management:** TanStack Query + React Context
- **TypeScript:** Full type safety
- **Internationalization:** i18next

## Development

See [INSTALLATION.md](./INSTALLATION.md) for detailed setup instructions.

## Documentation

- [Installation Guide](./INSTALLATION.md)
- [Frontend Focus Document](./Frontend-focus.md)
- [Wakanda Prompt](./Wakanda%20Prompt.md)

## License

Proprietary
