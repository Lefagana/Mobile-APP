import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Text, useTheme } from 'react-native-paper';

export interface FormInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  helperText?: string;
  secureTextEntry?: boolean;
  disabled?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'decimal-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  required?: boolean;
  testID?: string;
  accessibilityLabel?: string;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  helperText,
  secureTextEntry = false,
  disabled = false,
  multiline = false,
  numberOfLines = 1,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  leftIcon,
  rightIcon,
  onRightIconPress,
  required = false,
  testID,
  accessibilityLabel,
}) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <TextInput
        label={required ? `${label} *` : label}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        error={!!error}
        disabled={disabled}
        secureTextEntry={secureTextEntry}
        multiline={multiline}
        numberOfLines={numberOfLines}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        left={leftIcon ? <TextInput.Icon icon={leftIcon} /> : undefined}
        right={
          rightIcon ? (
            <TextInput.Icon icon={rightIcon} onPress={onRightIconPress} />
          ) : undefined
        }
        mode="outlined"
        style={styles.input}
        testID={testID}
        accessibilityLabel={accessibilityLabel || label}
        accessibilityHint={error || helperText}
      />
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
  input: {
    backgroundColor: 'transparent',
  },
  helperText: {
    marginTop: 4,
    marginLeft: 16,
  },
});



