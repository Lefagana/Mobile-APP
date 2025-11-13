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
    Write-Host "[OK] node_modules directory exists" -ForegroundColor Green
} else {
    $errors += "node_modules directory not found. Run: npx expo install --fix"
    Write-Host "[ERROR] node_modules directory not found" -ForegroundColor Red
}

# Check critical React Navigation packages
Write-Host ""
Write-Host "Checking React Navigation packages..." -ForegroundColor Yellow
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
        Write-Host "  [OK] $pkg" -ForegroundColor Green
    } else {
        $errors += "$pkg not found in node_modules"
        Write-Host "  [ERROR] $pkg" -ForegroundColor Red
    }
}

# Check other critical dependencies
Write-Host ""
Write-Host "Checking other critical dependencies..." -ForegroundColor Yellow
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
        Write-Host "  [OK] $pkg" -ForegroundColor Green
    } else {
        $warnings += "$pkg not found in node_modules"
        Write-Host "  [WARN] $pkg" -ForegroundColor Yellow
    }
}

# Check package.json
Write-Host ""
Write-Host "Checking package.json..." -ForegroundColor Yellow
if (Test-Path "package.json") {
    Write-Host "[OK] package.json exists" -ForegroundColor Green
    
    try {
        $packageJson = Get-Content "package.json" -Raw | ConvertFrom-Json
        
        $requiredInPackage = @(
            "@react-navigation/native",
            "@react-navigation/stack",
            "@react-navigation/bottom-tabs"
        )
        
        foreach ($pkg in $requiredInPackage) {
            if ($packageJson.dependencies.$pkg) {
                Write-Host "  [OK] $pkg defined in package.json" -ForegroundColor Green
            } else {
                $errors += "$pkg not found in package.json dependencies"
                Write-Host "  [ERROR] $pkg missing from package.json" -ForegroundColor Red
            }
        }
    } catch {
        $warnings += "Could not parse package.json"
        Write-Host "  [WARN] Could not parse package.json" -ForegroundColor Yellow
    }
} else {
    $errors += "package.json not found"
    Write-Host "[ERROR] package.json not found" -ForegroundColor Red
}

# Check app.json/app.config.js
Write-Host ""
Write-Host "Checking Expo configuration..." -ForegroundColor Yellow
if (Test-Path "app.json") {
    Write-Host "[OK] app.json exists" -ForegroundColor Green
} elseif (Test-Path "app.config.js") {
    Write-Host "[OK] app.config.js exists" -ForegroundColor Green
} else {
    $warnings += "Expo config file (app.json or app.config.js) not found"
    Write-Host "[WARN] Expo config file not found" -ForegroundColor Yellow
}

# Summary
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Verification Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

if ($errors.Count -eq 0 -and $warnings.Count -eq 0) {
    Write-Host "[SUCCESS] All dependencies verified successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Start the development server: npx expo start" -ForegroundColor White
    Write-Host "2. If you encounter issues, try: npx expo start -c (clear cache)" -ForegroundColor White
} elseif ($errors.Count -eq 0) {
    Write-Host "[SUCCESS] Critical dependencies verified!" -ForegroundColor Green
    Write-Host "[WARN] $($warnings.Count) warning(s) found" -ForegroundColor Yellow
    if ($warnings.Count -gt 0) {
        Write-Host ""
        Write-Host "Warnings:" -ForegroundColor Yellow
        foreach ($warning in $warnings) {
            Write-Host "  - $warning" -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "[ERROR] $($errors.Count) error(s) found" -ForegroundColor Red
    Write-Host ""
    Write-Host "Errors:" -ForegroundColor Red
    foreach ($error in $errors) {
        Write-Host "  - $error" -ForegroundColor Red
    }
    Write-Host ""
    Write-Host "Please run: npx expo install --fix" -ForegroundColor Yellow
    if ($warnings.Count -gt 0) {
        Write-Host ""
        Write-Host "Warnings:" -ForegroundColor Yellow
        foreach ($warning in $warnings) {
            Write-Host "  - $warning" -ForegroundColor Yellow
        }
    }
}

Write-Host ""
