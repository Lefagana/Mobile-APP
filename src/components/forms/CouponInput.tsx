import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { TextInput, Button, Text, useTheme, ActivityIndicator } from 'react-native-paper';

export interface CouponInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onApply: (code: string) => Promise<boolean>;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  testID?: string;
  accessibilityLabel?: string;
}

export const CouponInput: React.FC<CouponInputProps> = ({
  value,
  onChangeText,
  onApply,
  error,
  helperText,
  disabled = false,
  testID,
  accessibilityLabel,
}) => {
  const theme = useTheme();
  const [isApplying, setIsApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  const handleApply = async () => {
    if (!value.trim()) {
      return;
    }

    setIsApplying(true);
    try {
      const success = await onApply(value.trim().toUpperCase());
      setApplied(success);
      if (!success) {
        // Error will be set via error prop
        setApplied(false);
      }
    } catch (err) {
      setApplied(false);
    } finally {
      setIsApplying(false);
    }
  };

  const handleClear = () => {
    onChangeText('');
    setApplied(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          label="Coupon Code"
          value={value}
          onChangeText={(text) => {
            onChangeText(text);
            setApplied(false);
          }}
          placeholder="Enter coupon code"
          error={!!error && !applied}
          disabled={disabled || applied}
          mode="outlined"
          style={[styles.input, { flex: 1 }]}
          autoCapitalize="characters"
          testID={testID}
          accessibilityLabel={accessibilityLabel || 'Coupon code input'}
          accessibilityHint={error || helperText || 'Enter your coupon code and tap apply'}
        />
        {applied ? (
          <TouchableOpacity
            onPress={handleClear}
            style={[styles.button, { backgroundColor: theme.colors.primaryContainer }]}
            accessibilityRole="button"
            accessibilityLabel="Remove coupon"
          >
            <Text variant="bodyMedium" style={{ color: theme.colors.onPrimaryContainer }}>
              Remove
            </Text>
          </TouchableOpacity>
        ) : (
          <Button
            mode="contained"
            onPress={handleApply}
            disabled={disabled || isApplying || !value.trim()}
            loading={isApplying}
            style={styles.button}
            accessibilityLabel="Apply coupon code"
          >
            Apply
          </Button>
        )}
      </View>
      {applied && !error && (
        <Text
          variant="bodySmall"
          style={[styles.successText, { color: theme.colors.primary }]}
        >
          Coupon applied successfully!
        </Text>
      )}
      {error && !applied && (
        <Text variant="bodySmall" style={[styles.errorText, { color: theme.colors.error }]}>
          {error}
        </Text>
      )}
      {helperText && !error && !applied && (
        <Text
          variant="bodySmall"
          style={[styles.helperText, { color: theme.colors.onSurfaceVariant }]}
        >
          {helperText}
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
    gap: 8,
    alignItems: 'flex-start',
  },
  input: {
    backgroundColor: 'transparent',
  },
  button: {
    minWidth: 80,
    justifyContent: 'center',
  },
  successText: {
    marginTop: 4,
    marginLeft: 16,
    fontWeight: '500',
  },
  errorText: {
    marginTop: 4,
    marginLeft: 16,
  },
  helperText: {
    marginTop: 4,
    marginLeft: 16,
  },
});



