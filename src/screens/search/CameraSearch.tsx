import React, { useState, useCallback, useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import {
  Text,
  useTheme,
  IconButton,
  Button,
  ActivityIndicator,
  Card,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { CustomerStackParamList } from '../../navigation/types';
import { ScreenContainer } from '../../components/common';
import { api } from '../../services/api';
import { useQuery } from '@tanstack/react-query';
import { Product } from '../../types';

// Conditionally import camera modules only on native platforms
let Camera: any = null;
let CameraType: any = null;
let useCameraPermissions: any = null;

if (Platform.OS !== 'web') {
  try {
    const expoCamera = require('expo-camera');
    Camera = expoCamera.Camera;
    CameraType = expoCamera.CameraType;
    useCameraPermissions = expoCamera.useCameraPermissions;
  } catch (e) {
    console.warn('expo-camera not available:', e);
  }
}

type CameraSearchNavigationProp = StackNavigationProp<CustomerStackParamList, 'CameraSearch'>;

const CameraSearch: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<CameraSearchNavigationProp>();
  
  // Always use useState for permissions (works on all platforms)
  // This ensures we always call hooks before any conditional returns
  // On web, permissions are always denied. On native, we'll handle permissions manually
  const [permission, setPermission] = useState<{ granted: boolean; canAskAgain: boolean }>({ 
    granted: false, 
    canAskAgain: Platform.OS !== 'web' // Can ask on native, not on web
  });
  
  // Request permission handler
  const requestPermission = () => {
    if (Platform.OS === 'web') {
      setPermission({ granted: false, canAskAgain: false });
      return;
    }
    // On native, permissions are typically requested automatically by the Camera component
    // or through system dialogs. We'll update state when camera is actually available.
    setPermission({ granted: false, canAskAgain: true });
  };
  
  // Early return for web platform - after all hooks are called
  if (Platform.OS === 'web') {
    const handleBack = () => navigation.goBack();
    return (
      <ScreenContainer>
        <View style={styles.permissionContainer}>
          <IconButton icon="camera-off" size={64} iconColor={theme.colors.error} />
          <Text variant="headlineSmall" style={{ color: theme.colors.error, marginTop: 16 }}>
            Camera Not Available
          </Text>
          <Text
            variant="bodyMedium"
            style={{ color: theme.colors.onSurfaceVariant, marginTop: 8, textAlign: 'center' }}
          >
            Camera search is only available on mobile devices. Please use the search bar to find products.
          </Text>
          <Button mode="contained" onPress={handleBack} style={{ marginTop: 24 }}>
            Go Back
          </Button>
        </View>
      </ScreenContainer>
    );
  }
  
  // On native platforms, use camera
  const cameraRef = useRef<any>(null);
  const [facing, setFacing] = useState<'back' | 'front'>('back');
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImageUri, setCapturedImageUri] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Search products by image (mock implementation)
  const {
    data: searchResults,
    isLoading: isSearching,
    refetch: searchProducts,
  } = useQuery({
    queryKey: ['products', 'search', 'image', searchQuery],
    queryFn: () => api.products.list({ q: searchQuery }),
    enabled: false, // Only search when triggered manually
    retry: false,
  });

  useEffect(() => {
    // Request camera permission on mount
    if (!permission?.granted && permission?.canAskAgain) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  const handleCapture = useCallback(async () => {
    if (!cameraRef.current) return;

    try {
      setIsCapturing(true);
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
      });

      if (photo?.uri) {
        setCapturedImageUri(photo.uri);
        // Mock: Generate a search query from image (in real app, this would use image recognition API)
        // For now, we'll simulate a search with a generic query
        const mockSearchQuery = 'product';
        setSearchQuery(mockSearchQuery);
        await searchProducts();
      }
    } catch (error: any) {
      console.error('Error capturing image:', error);
      Alert.alert('Error', 'Failed to capture image. Please try again.');
    } finally {
      setIsCapturing(false);
    }
  }, [searchProducts]);

  const handleFlipCamera = useCallback(() => {
    if (Platform.OS === 'web') return; // Camera flip not available on web
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }, []);

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleProductPress = useCallback(
    (product: Product) => {
      navigation.navigate('ProductDetail', { productId: product.id });
    },
    [navigation]
  );

  const handleRetake = useCallback(() => {
    setCapturedImageUri(null);
    setSearchQuery('');
  }, []);

  // Permission not granted
  if (permission && !permission.granted && !permission.canAskAgain) {
    return (
      <ScreenContainer>
        <View style={styles.permissionContainer}>
          <IconButton icon="camera-off" size={64} iconColor={theme.colors.error} />
          <Text variant="headlineSmall" style={{ color: theme.colors.error, marginTop: 16 }}>
            Camera Permission Required
          </Text>
          <Text
            variant="bodyMedium"
            style={{ color: theme.colors.onSurfaceVariant, marginTop: 8, textAlign: 'center' }}
          >
            Please enable camera permission in your device settings to use this feature.
          </Text>
          <Button mode="contained" onPress={handleBack} style={{ marginTop: 24 }}>
            Go Back
          </Button>
        </View>
      </ScreenContainer>
    );
  }

  // Camera view
  if (!capturedImageUri) {
    return (
      <ScreenContainer scrollable={false}>
        <View style={styles.container}>
          {/* Header */}
          <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
            <IconButton
              icon="close"
              size={24}
              onPress={handleBack}
              iconColor={theme.colors.onSurface}
            />
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface, flex: 1 }}>
              Scan Product
            </Text>
            <IconButton
              icon="camera-flip"
              size={24}
              onPress={handleFlipCamera}
              iconColor={theme.colors.onSurface}
            />
          </View>

          {/* Camera View */}
          {permission?.granted && Camera ? (
            <View style={styles.cameraContainer}>
              <Camera
                ref={cameraRef}
                style={styles.camera}
                type={facing}
                ratio="16:9"
              >
                <View style={styles.overlay}>
                  {/* Scanning Frame */}
                  <View style={styles.scanFrame}>
                    <View style={[styles.corner, styles.topLeft]} />
                    <View style={[styles.corner, styles.topRight]} />
                    <View style={[styles.corner, styles.bottomLeft]} />
                    <View style={[styles.corner, styles.bottomRight]} />
                  </View>

                  {/* Instructions */}
                  <View style={styles.instructionsContainer}>
                    <Text
                      variant="bodyMedium"
                      style={{ color: '#FFFFFF', textAlign: 'center', marginBottom: 8 }}
                    >
                      Position product within frame
                    </Text>
                    <Text
                      variant="bodySmall"
                      style={{ color: '#FFFFFF', textAlign: 'center', opacity: 0.8 }}
                    >
                      Hold steady and tap capture
                    </Text>
                  </View>

                  {/* Capture Button */}
                  <View style={styles.controlsContainer}>
                    <TouchableOpacity
                      style={[styles.captureButton, { backgroundColor: theme.colors.primary }]}
                      onPress={handleCapture}
                      disabled={isCapturing}
                      activeOpacity={0.8}
                    >
                      {isCapturing ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                      ) : (
                        <View style={styles.captureButtonInner} />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </Camera>
            </View>
          ) : (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 16 }}>
                Requesting camera permission...
              </Text>
              <Button mode="contained" onPress={requestPermission} style={{ marginTop: 16 }}>
                Grant Permission
              </Button>
            </View>
          )}
        </View>
      </ScreenContainer>
    );
  }

  // Search Results View
  return (
    <ScreenContainer>
      <View style={styles.resultsContainer}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
          <IconButton
            icon="arrow-left"
            size={24}
            onPress={handleBack}
            iconColor={theme.colors.onSurface}
          />
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface, flex: 1 }}>
            Search Results
          </Text>
          <IconButton
            icon="camera-retake"
            size={24}
            onPress={handleRetake}
            iconColor={theme.colors.onSurface}
          />
        </View>

        {/* Preview Image */}
        {capturedImageUri && (
          <Card style={[styles.previewCard, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.previewImageContainer}>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                Captured Image
              </Text>
            </View>
          </Card>
        )}

        {/* Search Results */}
        {isSearching ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 16 }}>
              Searching for similar products...
            </Text>
          </View>
        ) : searchResults?.items && searchResults.items.length > 0 ? (
          <View style={styles.resultsList}>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: 16 }}>
              Found {searchResults.items.length} product{searchResults.items.length !== 1 ? 's' : ''}
            </Text>
            {/* TODO: Render product cards */}
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
              Products will be displayed here
            </Text>
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <IconButton icon="magnify" size={64} iconColor={theme.colors.onSurfaceVariant} />
            <Text variant="headlineSmall" style={{ color: theme.colors.onSurface, marginTop: 16 }}>
              No products found
            </Text>
            <Text
              variant="bodyMedium"
              style={{ color: theme.colors.onSurfaceVariant, marginTop: 8, textAlign: 'center' }}
            >
              Try capturing a clearer image or search manually
            </Text>
            <Button mode="outlined" onPress={handleRetake} style={{ marginTop: 24 }}>
              Retake Photo
            </Button>
          </View>
        )}
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  cameraContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 280,
    height: 280,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#FFFFFF',
    borderWidth: 3,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  instructionsContainer: {
    position: 'absolute',
    top: '35%',
    width: '100%',
    paddingHorizontal: 32,
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 50,
    width: '100%',
    alignItems: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  captureButtonInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  resultsContainer: {
    flex: 1,
  },
  previewCard: {
    margin: 16,
    padding: 16,
  },
  previewImageContainer: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  resultsList: {
    flex: 1,
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
});

export default CameraSearch;

