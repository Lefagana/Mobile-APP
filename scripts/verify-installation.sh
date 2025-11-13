#!/bin/bash

# Wakanda-X Dependency Verification Script
# Run this after executing: npx expo install --fix

echo "========================================"
echo "Wakanda-X Installation Verification"
echo "========================================"
echo ""

ERRORS=()
WARNINGS=()

# Check if node_modules exists
echo "Checking node_modules..."
if [ -d "node_modules" ]; then
    echo "✓ node_modules directory exists"
else
    ERRORS+=("node_modules directory not found. Run: npx expo install --fix")
    echo "✗ node_modules directory not found"
fi

# Check critical React Navigation packages
echo ""
echo "Checking React Navigation packages..."
REQUIRED_PACKAGES=(
    "@react-navigation/native"
    "@react-navigation/stack"
    "@react-navigation/bottom-tabs"
    "react-native-screens"
    "react-native-safe-area-context"
    "react-native-gesture-handler"
)

for pkg in "${REQUIRED_PACKAGES[@]}"; do
    if [ -d "node_modules/$pkg" ]; then
        echo "  ✓ $pkg"
    else
        ERRORS+=("$pkg not found in node_modules")
        echo "  ✗ $pkg"
    fi
done

# Check other critical dependencies
echo ""
echo "Checking other critical dependencies..."
OTHER_PACKAGES=(
    "react-native-paper"
    "@tanstack/react-query"
    "i18next"
    "react-i18next"
    "expo-secure-store"
    "@react-native-async-storage/async-storage"
    "@react-native-community/netinfo"
)

for pkg in "${OTHER_PACKAGES[@]}"; do
    if [ -d "node_modules/$pkg" ]; then
        echo "  ✓ $pkg"
    else
        WARNINGS+=("$pkg not found in node_modules")
        echo "  ⚠ $pkg"
    fi
done

# Check package.json
echo ""
echo "Checking package.json..."
if [ -f "package.json" ]; then
    echo "✓ package.json exists"
    
    # Basic check if required packages are in package.json
    for pkg in "@react-navigation/native" "@react-navigation/stack" "@react-navigation/bottom-tabs"; do
        if grep -q "\"$pkg\"" package.json; then
            echo "  ✓ $pkg defined in package.json"
        else
            ERRORS+=("$pkg not found in package.json dependencies")
            echo "  ✗ $pkg missing from package.json"
        fi
    done
else
    ERRORS+=("package.json not found")
    echo "✗ package.json not found"
fi

# Check app.json/app.config.js for Expo config
echo ""
echo "Checking Expo configuration..."
if [ -f "app.json" ]; then
    echo "✓ app.json exists"
elif [ -f "app.config.js" ]; then
    echo "✓ app.config.js exists"
else
    WARNINGS+=("Expo config file (app.json or app.config.js) not found")
    echo "⚠ Expo config file not found"
fi

# Summary
echo ""
echo "========================================"
echo "Verification Summary"
echo "========================================"

if [ ${#ERRORS[@]} -eq 0 ] && [ ${#WARNINGS[@]} -eq 0 ]; then
    echo "✓ All dependencies verified successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Start the development server: npx expo start"
    echo "2. If you encounter issues, try: npx expo start -c (clear cache)"
elif [ ${#ERRORS[@]} -eq 0 ]; then
    echo "✓ Critical dependencies verified!"
    echo "⚠ ${#WARNINGS[@]} warning(s) found"
    echo ""
    echo "Warnings:"
    for warning in "${WARNINGS[@]}"; do
        echo "  - $warning"
    done
else
    echo "✗ ${#ERRORS[@]} error(s) found"
    echo ""
    echo "Errors:"
    for error in "${ERRORS[@]}"; do
        echo "  - $error"
    done
    echo ""
    echo "Please run: npx expo install --fix"
fi

if [ ${#WARNINGS[@]} -gt 0 ] && [ ${#ERRORS[@]} -gt 0 ]; then
    echo ""
    echo "Warnings:"
    for warning in "${WARNINGS[@]}"; do
        echo "  - $warning"
    done
fi

echo ""
