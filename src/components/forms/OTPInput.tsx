import React, { useRef, useState } from 'react';
import { View, StyleSheet, TextInput as RNTextInput } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

export interface OTPInputProps {
  length?: number;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  disabled?: boolean;
  testID?: string;
  accessibilityLabel?: string;
}

export const OTPInput: React.FC<OTPInputProps> = ({
  length = 6,
  value,
  onChangeText,
  error,
  disabled = false,
  testID,
  accessibilityLabel,
}) => {
  const theme = useTheme();
  const inputRefs = useRef<(RNTextInput | null)[]>([]);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  const handleChangeText = (text: string, index: number) => {
    // Only allow numeric input
    const cleaned = text.replace(/\D/g, '');
    
    if (cleaned.length === 0) {
      // Clear current cell
      const newValue = value.split('');
      newValue[index] = '';
      onChangeText(newValue.join(''));
      return;
    }

    // Get the last digit if multiple are pasted
    const digit = cleaned.slice(-1);
    const newValue = value.split('');
    newValue[index] = digit;
    const updatedValue = newValue.join('');

    onChangeText(updatedValue);

    // Auto-focus next input
    if (index < length - 1 && digit) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleFocus = (index: number) => {
    setFocusedIndex(index);
  };

  const handleBlur = () => {
    setFocusedIndex(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        {Array.from({ length }).map((_, index) => (
          <RNTextInput
            key={index}
            ref={(ref) => {
              inputRefs.current[index] = ref;
            }}
            value={value[index] || ''}
            onChangeText={(text) => handleChangeText(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            onFocus={() => handleFocus(index)}
            onBlur={handleBlur}
            keyboardType="number-pad"
            maxLength={1}
            selectTextOnFocus
            editable={!disabled}
            style={[
              styles.input,
              {
                borderColor: error
                  ? theme.colors.error
                  : focusedIndex === index
                  ? theme.colors.primary
                  : theme.colors.outline,
                backgroundColor: disabled
                  ? theme.colors.surfaceDisabled
                  : theme.colors.surface,
              },
            ]}
            testID={testID ? `${testID}_${index}` : undefined}
            accessibilityLabel={
              accessibilityLabel
                ? `${accessibilityLabel} digit ${index + 1} of ${length}`
                : `OTP digit ${index + 1}`
            }
          />
        ))}
      </View>
      {error && (
        <Text variant="bodySmall" style={[styles.errorText, { color: theme.colors.error }]}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  input: {
    width: 50,
    height: 60,
    borderWidth: 2,
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600',
  },
  errorText: {
    marginTop: 8,
    textAlign: 'center',
  },
});



