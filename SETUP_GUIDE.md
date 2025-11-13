# Wakanda-X Setup Guide

## ⚠️ Prerequisites Check

To run the Wakanda-X project, you need Node.js installed on your system. It appears Node.js may not be installed or is not in your system PATH.

## Step 1: Install Node.js

### Option A: Download and Install (Recommended)

1. **Download Node.js:**
   - Visit [https://nodejs.org/](https://nodejs.org/)
   - Download the **LTS (Long Term Support)** version (v18 or higher recommended)
   - Choose the Windows Installer (.msi) for your system (64-bit recommended)

2. **Run the Installer:**
   - Double-click the downloaded `.msi` file
   - Follow the installation wizard
   - **Important:** Make sure to check "Add to PATH" during installation
   - Complete the installation

3. **Verify Installation:**
   - Open a **new** PowerShell or Command Prompt window
   - Run: `node --version`
   - Run: `npm --version`
   - Both commands should display version numbers

### Option B: Using a Package Manager

If you have Chocolatey installed:
```powershell
choco install nodejs
```

If you have Winget installed:
```powershell
winget install OpenJS.NodeJS.LTS
```

## Step 2: Verify Node.js Installation

After installing Node.js, **close and reopen** your terminal/PowerShell window, then run:

```powershell
node --version
npm --version
```

Both should return version numbers (e.g., `v18.17.0` and `10.1.0`).

## Step 3: Install Project Dependencies

Once Node.js is installed and accessible, navigate to the project directory:

```powershell
cd "c:\Users\umara\Desktop\WAKANDA"
```

Then install dependencies:

```powershell
npx expo install --fix
```

This will:
- Install all dependencies listed in `package.json`
- Ensure compatible versions for Expo SDK 50
- Fix any version conflicts automatically

**Note:** This may take several minutes depending on your internet connection.

## Step 4: Verify Installation

After installation completes, verify everything is set up correctly:

```powershell
.\scripts\verify-installation-simple.ps1
```

You should see `[OK]` or `[SUCCESS]` messages for all critical packages.

## Step 5: Start Development Server

Once installation is verified, start the Expo development server:

```powershell
npx expo start
```

This will:
- Start the Metro bundler
- Display a QR code for testing on mobile devices
- Provide options to open on Android/iOS simulators

### Expo Go Options:
- Press `a` to open on Android emulator
- Press `i` to open on iOS simulator (macOS only)
- Press `w` to open in web browser
- Scan the QR code with Expo Go app on your phone

## Troubleshooting

### Issue: "node is not recognized"

**Solution:**
1. Verify Node.js is installed: Check `C:\Program Files\nodejs\`
2. Add Node.js to PATH:
   - Open System Properties → Environment Variables
   - Add `C:\Program Files\nodejs\` to your PATH variable
   - Restart your terminal/PowerShell

### Issue: "npx is not recognized"

**Solution:**
- `npx` comes with npm (which comes with Node.js)
- If `npm` works but `npx` doesn't, try updating npm:
  ```powershell
  npm install -g npm@latest
  ```

### Issue: Installation fails or times out

**Solutions:**
- Check your internet connection
- Try using a different network or VPN
- Clear npm cache: `npm cache clean --force`
- Try using yarn instead: `yarn install`

### Issue: Permission errors on Windows

**Solutions:**
- Run PowerShell as Administrator
- Or configure npm to use a different directory:
  ```powershell
  mkdir C:\Users\<YourUsername>\.npm-global
  npm config set prefix 'C:\Users\<YourUsername>\.npm-global'
  ```

## Next Steps

After successfully installing dependencies and starting the development server:

1. Review `PROGRESS.md` to see what's been completed
2. Check `INSTALLATION.md` for detailed installation information
3. Review the project structure in `src/` directory
4. Start building features following the implementation plan

## Need Help?

- [Expo Documentation](https://docs.expo.dev/)
- [Node.js Documentation](https://nodejs.org/en/docs/)
- [React Native Paper](https://callstack.github.io/react-native-paper/)
- [React Navigation](https://reactnavigation.org/)
