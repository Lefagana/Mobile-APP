import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Text, useTheme } from 'react-native-paper';

export interface PhoneInputProps {
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  testID?: string;
  accessibilityLabel?: string;
}

const NIGERIAN_COUNTRY_CODE = '+234';

export const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChangeText,
  error,
  helperText,
  disabled = false,
  required = false,
  testID,
  accessibilityLabel,
}) => {
  const theme = useTheme();
  const [localValue, setLocalValue] = useState(value.replace(NIGERIAN_COUNTRY_CODE, ''));

  const handleChangeText = (text: string) => {
    // Remove any non-numeric characters
    const cleaned = text.replace(/\D/g, '');
    
    // Limit to 10 digits (Nigerian phone number format)
    const limited = cleaned.slice(0, 10);
    
    setLocalValue(limited);
    onChangeText(`${NIGERIAN_COUNTRY_CODE}${limited}`);
  };

  const formatDisplayValue = (val: string) => {
    if (val.length === 0) return '';
    if (val.length <= 3) return val;
    if (val.length <= 6) return `${val.slice(0, 3)} ${val.slice(3)}`;
    return `${val.slice(0, 3)} ${val.slice(3, 6)} ${val.slice(6)}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <View style={[styles.countryCode, { backgroundColor: theme.colors.surfaceVariant }]}>
          <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant }}>
            {NIGERIAN_COUNTRY_CODE}
          </Text>
        </View>
        <TextInput
          label={required ? 'Phone Number *' : 'Phone Number'}
          value={formatDisplayValue(localValue)}
          onChangeText={handleChangeText}
          placeholder="801 234 5678"
          error={!!error}
          disabled={disabled}
          keyboardType="phone-pad"
          autoCapitalize="none"
          mode="outlined"
          style={[styles.input, { flex: 1 }]}
          testID={testID}
          accessibilityLabel={accessibilityLabel || 'Phone number input'}
          accessibilityHint={error || helperText || 'Enter your 10-digit Nigerian phone number'}
        />
      </View>
      {(error || helperText) && (
        <Text
          variant="bodySmall"
          style={[
            styles.helperText,
            error ? { color: theme.colors.error } : { color: theme.colors.onSurfaceVariant },
          ]}
        >
          {error || helperText}
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
    alignItems: 'center',
    gap: 8,
  },
  countryCode: {
    paddingHorizontal: 12,
    paddingVertical: 16,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    backgroundColor: 'transparent',
  },
  helperText: {
    marginTop: 4,
    marginLeft: 16,
  },
});



