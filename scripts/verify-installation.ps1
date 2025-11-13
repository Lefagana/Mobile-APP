# Wakanda-X Dependency Verification Script
# Run this after executing: npx expo install --fix

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Wakanda-X Installation Verification" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$errors = @()
$warnings = @()

# Check if node_modules exists
Write-Host "Checking node_modules..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "✓ node_modules directory exists" -ForegroundColor Green
} else {
    $errors += "node_modules directory not found. Run: npx expo install --fix"
    Write-Host "✗ node_modules directory not found" -ForegroundColor Red
}

# Check critical React Navigation packages
Write-Host "`nChecking React Navigation packages..." -ForegroundColor Yellow
$requiredPackages = @(
    "@react-navigation/native",
    "@react-navigation/stack",
    "@react-navigation/bottom-tabs",
    "react-native-screens",
    "react-native-safe-area-context",
    "react-native-gesture-handler"
)

foreach ($pkg in $requiredPackages) {
    $pkgPath = "node_modules\$pkg"
    if (Test-Path $pkgPath) {
        Write-Host "  ✓ $pkg" -ForegroundColor Green
    } else {
        $errors += "$pkg not found in node_modules"
        Write-Host "  ✗ $pkg" -ForegroundColor Red
    }
}

# Check other critical dependencies
Write-Host "`nChecking other critical dependencies..." -ForegroundColor Yellow
$otherPackages = @(
    "react-native-paper",
    "@tanstack/react-query",
    "i18next",
    "react-i18next",
    "expo-secure-store",
    "@react-native-async-storage/async-storage",
    "@react-native-community/netinfo"
)

foreach ($pkg in $otherPackages) {
    $pkgPath = "node_modules\$pkg"
    if (Test-Path $pkgPath) {
        Write-Host "  ✓ $pkg" -ForegroundColor Green
    } else {
        $warnings += "$pkg not found in node_modules"
        Write-Host "  ⚠ $pkg" -ForegroundColor Yellow
    }
}

# Check package.json
Write-Host "`nChecking package.json..." -ForegroundColor Yellow
if (Test-Path "package.json") {
    Write-Host "✓ package.json exists" -ForegroundColor Green
    
    try {
        $packageJson = Get-Content "package.json" -Raw | ConvertFrom-Json
        
        # Verify dependencies
        $requiredInPackage = @(
            "@react-navigation/native",
            "@react-navigation/stack",
            "@react-navigation/bottom-tabs"
        )
        
        foreach ($pkg in $requiredInPackage) {
            if ($packageJson.dependencies.$pkg) {
                Write-Host "  ✓ $pkg defined in package.json" -ForegroundColor Green
            } else {
                $errors += "$pkg not found in package.json dependencies"
                Write-Host "  ✗ $pkg missing from package.json" -ForegroundColor Red
            }
        }
    } catch {
        $warnings += "Could not parse package.json"
        Write-Host "  ⚠ Could not parse package.json" -ForegroundColor Yellow
    }
} else {
    $errors += "package.json not found"
    Write-Host "✗ package.json not found" -ForegroundColor Red
}

# Check app.json/app.config.js for Expo config
Write-Host "`nChecking Expo configuration..." -ForegroundColor Yellow
if (Test-Path "app.json") {
    Write-Host "✓ app.json exists" -ForegroundColor Green
} elseif (Test-Path "app.config.js") {
    Write-Host "✓ app.config.js exists" -ForegroundColor Green
} else {
    $warnings += "Expo config file (app.json or app.config.js) not found"
    Write-Host "⚠ Expo config file not found" -ForegroundColor Yellow
}

# Summary
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Verification Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

if ($errors.Count -eq 0 -and $warnings.Count -eq 0) {
    Write-Host "✓ All dependencies verified successfully!" -ForegroundColor Green
    Write-Host "`nNext steps:" -ForegroundColor Cyan
    Write-Host "1. Start the development server: npx expo start" -ForegroundColor White
    Write-Host "2. If you encounter issues, try: npx expo start -c (clear cache)" -ForegroundColor White
} elseif ($errors.Count -eq 0) {
    Write-Host "✓ Critical dependencies verified!" -ForegroundColor Green
    Write-Host "⚠ $($warnings.Count) warning(s) found" -ForegroundColor Yellow
    if ($warnings.Count -gt 0) {
        Write-Host "`nWarnings:" -ForegroundColor Yellow
        foreach ($warning in $warnings) {
            Write-Host "  - $warning" -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "✗ $($errors.Count) error(s) found" -ForegroundColor Red
    Write-Host "`nErrors:" -ForegroundColor Red
    foreach ($error in $errors) {
        Write-Host "  - $error" -ForegroundColor Red
    }
    Write-Host "`nPlease run: npx expo install --fix" -ForegroundColor Yellow
    if ($warnings.Count -gt 0) {
        Write-Host "`nWarnings:" -ForegroundColor Yellow
        foreach ($warning in $warnings) {
            Write-Host "  - $warning" -ForegroundColor Yellow
        }
    }
}

Write-Host ""
