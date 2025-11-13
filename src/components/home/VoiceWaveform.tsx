import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { useTheme } from 'react-native-paper';

export type VoiceWaveformState = 'idle' | 'listening' | 'processing' | 'done';

export interface VoiceWaveformProps {
  state?: VoiceWaveformState;
  amplitude?: number; // 0-1 for voice volume
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const WAVEFORM_WIDTH = SCREEN_WIDTH * 0.4;
const BAR_COUNT = 24; // Increased for smoother appearance
const BAR_WIDTH = 2.5; // Slightly thinner for smoother look
const BAR_GAP = 3;

export const VoiceWaveform: React.FC<VoiceWaveformProps> = ({ state = 'idle', amplitude = 0.5 }) => {
  const theme = useTheme();
  const animations = useRef(
    Array.from({ length: BAR_COUNT }, () => new Animated.Value(0.2))
  ).current;
  const glowAnimations = useRef(
    Array.from({ length: BAR_COUNT }, () => new Animated.Value(0))
  ).current;
  const opacityAnimation = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    // Opacity animation for translucent effect
    Animated.timing(opacityAnimation, {
      toValue: state === 'idle' ? 0.4 : state === 'processing' ? 0.8 : 0.7,
      duration: 300,
      useNativeDriver: false,
    }).start();

    if (state === 'idle') {
      // Gentle pulse animation - smoother sine wave pattern
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.parallel(
            animations.map((anim, index) =>
              Animated.timing(anim, {
                toValue: 0.25 + Math.sin((index / BAR_COUNT) * Math.PI * 2) * 0.15,
                duration: 1500 + index * 30,
                useNativeDriver: false,
              })
            )
          ),
          Animated.parallel(
            animations.map((anim, index) =>
              Animated.timing(anim, {
                toValue: 0.15 + Math.sin((index / BAR_COUNT) * Math.PI * 2 + Math.PI) * 0.1,
                duration: 1500 + index * 30,
                useNativeDriver: false,
              })
            )
          ),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    } else if (state === 'listening') {
      // Reactive to voice amplitude - smoother, more fluid
      const baseAmplitude = amplitude * 0.7;
      const listening = Animated.loop(
        Animated.parallel(
          animations.map((anim, index) => {
            const phase = (index / BAR_COUNT) * Math.PI * 2;
            const randomOffset = Math.random() * 0.3;
            return Animated.sequence([
              Animated.timing(anim, {
                toValue: baseAmplitude + Math.sin(phase + Date.now() / 100) * 0.3 + randomOffset,
                duration: 80 + index * 5,
                useNativeDriver: false,
              }),
              Animated.timing(anim, {
                toValue: baseAmplitude * 0.5 + Math.sin(phase + Math.PI) * 0.2,
                duration: 80 + index * 5,
                useNativeDriver: false,
              }),
            ]);
          })
        )
      );
      // Add glow animation for listening state
      const glow = Animated.loop(
        Animated.parallel(
          glowAnimations.map((glow, index) =>
            Animated.sequence([
              Animated.delay(index * 20),
              Animated.timing(glow, {
                toValue: 1,
                duration: 200,
                useNativeDriver: false,
              }),
              Animated.timing(glow, {
                toValue: 0,
                duration: 200,
                useNativeDriver: false,
              }),
            ])
          )
        )
      );
      listening.start();
      glow.start();
      return () => {
        listening.stop();
        glow.stop();
      };
    } else if (state === 'processing') {
      // Loading wave animation - smoother wave effect
      const processing = Animated.loop(
        Animated.parallel(
          animations.map((anim, index) => {
            const delay = (index / BAR_COUNT) * 400;
            return Animated.sequence([
              Animated.delay(delay),
              Animated.parallel([
                Animated.timing(anim, {
                  toValue: 0.85,
                  duration: 400,
                  useNativeDriver: false,
                }),
                Animated.timing(glowAnimations[index], {
                  toValue: 1,
                  duration: 400,
                  useNativeDriver: false,
                }),
              ]),
              Animated.parallel([
                Animated.timing(anim, {
                  toValue: 0.2,
                  duration: 400,
                  useNativeDriver: false,
                }),
                Animated.timing(glowAnimations[index], {
                  toValue: 0,
                  duration: 400,
                  useNativeDriver: false,
                }),
              ]),
            ]);
          })
        )
      );
      processing.start();
      return () => processing.stop();
    } else if (state === 'done') {
      // Fade out
      Animated.parallel(
        animations.map(anim =>
          Animated.timing(anim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: false,
          })
        )
      ).start();
    }
  }, [state, amplitude, animations]);

  const getColor = () => {
    switch (state) {
      case 'listening':
        return theme.colors.primary;
      case 'processing':
        return theme.colors.secondary || theme.colors.primary;
      case 'done':
        return theme.colors.primaryContainer;
      default:
        return theme.colors.onSurfaceVariant;
    }
  };

  const getGlowColor = () => {
    switch (state) {
      case 'listening':
        return theme.colors.primary;
      case 'processing':
        return theme.colors.secondary || theme.colors.primary;
      default:
        return 'transparent';
    }
  };

  return (
    <View style={styles.container}>
      {animations.map((anim, index) => {
        const height = anim.interpolate({
          inputRange: [0, 1],
          outputRange: [6, 42],
        });
        const glowOpacity = glowAnimations[index].interpolate({
          inputRange: [0, 1],
          outputRange: [0, 0.6],
        });
        const barOpacity = opacityAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [0.3, 1],
        });

        return (
          <View key={index} style={styles.barWrapper}>
            {/* Glow effect */}
            {state === 'listening' || state === 'processing' ? (
              <Animated.View
                style={[
                  styles.glow,
                  {
                    backgroundColor: getGlowColor(),
                    opacity: glowOpacity,
                  },
                ]}
              />
            ) : null}
            {/* Main bar */}
            <Animated.View
              style={[
                styles.bar,
                {
                  height,
                  backgroundColor: getColor(),
                  opacity: state === 'done' ? anim : barOpacity,
                },
              ]}
            />
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    width: WAVEFORM_WIDTH,
    gap: BAR_GAP,
  },
  barWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bar: {
    width: BAR_WIDTH,
    borderRadius: BAR_WIDTH / 2,
    minHeight: 6,
  },
  glow: {
    position: 'absolute',
    width: BAR_WIDTH * 3,
    height: BAR_WIDTH * 3,
    borderRadius: (BAR_WIDTH * 3) / 2,
    // Shadow for glow effect
    shadowColor: '#FF6B35',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 4,
  },
});

export default VoiceWaveform;
