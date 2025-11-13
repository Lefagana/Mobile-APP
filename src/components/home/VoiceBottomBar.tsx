import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { IconButton, useTheme, Text, Portal } from 'react-native-paper';
import { VoiceWaveform, VoiceWaveformState } from './VoiceWaveform';
import { createShadow } from '../../utils/shadows';

export interface VoiceBottomBarProps {
  onVoicePress?: () => void;
  onKeyboardSwitchPress?: () => void;
}

export const VoiceBottomBar: React.FC<VoiceBottomBarProps> = ({
  onVoicePress,
  onKeyboardSwitchPress,
}) => {
  const theme = useTheme();
  const [voiceState, setVoiceState] = useState<VoiceWaveformState>('idle');

  const handleVoicePress = () => {
    if (voiceState === 'idle') {
      setVoiceState('listening');
      // Simulate voice input
      setTimeout(() => {
        setVoiceState('processing');
        setTimeout(() => {
          setVoiceState('done');
          setTimeout(() => setVoiceState('idle'), 1000);
        }, 2000);
      }, 3000);
    } else {
      setVoiceState('idle');
    }
    onVoicePress?.();
  };

  return (
    <Portal>
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.outlineVariant,
        },
      ]}
      pointerEvents="box-none"
    >
      {/* Left: AI Person's Choice with Microphone */}
      <TouchableOpacity 
        onPress={handleVoicePress} 
        activeOpacity={0.7}
        style={styles.voiceButton}
        pointerEvents="auto"
      >
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: voiceState === 'listening' || voiceState === 'processing' 
                ? theme.colors.primaryContainer 
                : theme.colors.surfaceVariant,
            },
          ]}
        >
        <IconButton
          icon={voiceState === 'listening' || voiceState === 'processing' ? 'microphone' : 'microphone-outline'}
            size={24}
          iconColor={voiceState === 'listening' || voiceState === 'processing' ? theme.colors.primary : theme.colors.onSurfaceVariant}
            style={styles.iconButton}
        />
        </View>
        <Text
          variant="labelSmall"
          style={[
            styles.label,
            {
              color: theme.colors.onSurfaceVariant,
            },
          ]}
        >
          AI Person's Choice
        </Text>
      </TouchableOpacity>

      {/* Center: Voice Waveform */}
      <View style={styles.waveformContainer}>
      <VoiceWaveform state={voiceState} amplitude={voiceState === 'listening' ? 0.7 : 0.3} />
      </View>

      {/* Right: Keyboard Switch */}
      <TouchableOpacity 
        onPress={onKeyboardSwitchPress} 
        activeOpacity={0.7}
        style={styles.keyboardButton}
        pointerEvents="auto"
      >
        <IconButton 
          icon="keyboard" 
          size={24} 
          iconColor={theme.colors.onSurfaceVariant}
          style={styles.iconButton}
        />
        <Text
          variant="labelSmall"
          style={[
            styles.label,
            {
              color: theme.colors.onSurfaceVariant,
            },
          ]}
        >
          Keyboard switch
        </Text>
      </TouchableOpacity>
    </View>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    minHeight: 70,
    zIndex: 1000,
    ...createShadow({
      color: '#000',
      offset: { width: 0, height: -2 },
      opacity: 0.1,
      radius: 4,
    }),
  },
  voiceButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
  },
  keyboardButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
  },
  iconContainer: {
    borderRadius: 20,
    marginBottom: 4,
  },
  iconButton: {
    margin: 0,
  },
  label: {
    fontSize: 10,
    textAlign: 'center',
    marginTop: 2,
  },
  waveformContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
});

export default VoiceBottomBar;
