import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalization } from '../../contexts/LocalizationContext';
import type { AuthStackParamList } from '../../navigation/types';

type OnboardingScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Onboarding'>;

const { width } = Dimensions.get('window');

interface OnboardingSlide {
  icon: string;
  title: string;
  description: string;
}

const Onboarding: React.FC = () => {
  const navigation = useNavigation<OnboardingScreenNavigationProp>();
  const theme = useTheme();
  const { t } = useLocalization();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides: OnboardingSlide[] = [
    {
      icon: 'store-multiple',
      title: t('onboardingTitle'),
      description: t('onboardingSubtitle'),
    },
    {
      icon: 'map-marker',
      title: t('permissionLocation'),
      description: t('permissionLocationDesc'),
    },
    {
      icon: 'bell',
      title: t('permissionPush'),
      description: t('permissionPushDesc'),
    },
  ];

  const handleGetStarted = () => {
    // Navigation will be handled by AppNavigator when component unmounts
    // For now, we'll just finish onboarding
  };

  const handleSkip = () => {
    handleGetStarted();
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={(event) => {
          const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentSlide(slideIndex);
        }}
        scrollEventThrottle={16}
      >
        {slides.map((slide, index) => (
          <View key={index} style={[styles.slide, { width }]}>
            <MaterialCommunityIcons
              name={slide.icon as any}
              size={120}
              color={theme.colors.primary}
              style={styles.icon}
            />
            <Text variant="headlineSmall" style={styles.title}>
              {slide.title}
            </Text>
            <Text variant="bodyLarge" style={styles.description}>
              {slide.description}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Dots Indicator */}
      <View style={styles.dotsContainer}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor:
                  index === currentSlide ? theme.colors.primary : '#E0E0E0',
                width: index === currentSlide ? 24 : 8,
              },
            ]}
          />
        ))}
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonsContainer}>
        {currentSlide < slides.length - 1 ? (
          <Button mode="text" onPress={handleSkip} style={styles.skipButton}>
            Skip
          </Button>
        ) : (
          <Button
            mode="contained"
            onPress={handleGetStarted}
            style={styles.getStartedButton}
            contentStyle={styles.buttonContent}
          >
            {t('auth.getStarted')}
          </Button>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  icon: {
    marginBottom: 32,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    color: '#666666',
    textAlign: 'center',
    paddingHorizontal: 32,
    lineHeight: 24,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  buttonsContainer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  skipButton: {
    marginTop: 8,
  },
  getStartedButton: {
    marginTop: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});

export default Onboarding;
