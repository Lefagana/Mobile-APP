import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Menu, useTheme, IconButton } from 'react-native-paper';

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface SelectProps {
  label: string;
  value?: string;
  options: SelectOption[];
  onSelect: (value: string) => void;
  placeholder?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  testID?: string;
  accessibilityLabel?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  value,
  options,
  onSelect,
  placeholder = 'Select an option',
  error,
  helperText,
  disabled = false,
  required = false,
  testID,
  accessibilityLabel,
}) => {
  const theme = useTheme();
  const [visible, setVisible] = React.useState(false);

  const selectedOption = options.find((opt) => opt.value === value);

  const handleSelect = (optionValue: string) => {
    onSelect(optionValue);
    setVisible(false);
  };

  return (
    <View style={styles.container}>
      <Menu
        visible={visible}
        onDismiss={() => setVisible(false)}
        anchor={
          <TouchableOpacity
            onPress={() => !disabled && setVisible(true)}
            disabled={disabled}
            style={[
              styles.selectButton,
              {
                borderColor: error
                  ? theme.colors.error
                  : visible
                  ? theme.colors.primary
                  : theme.colors.outline,
                backgroundColor: disabled
                  ? theme.colors.surfaceDisabled
                  : theme.colors.surface,
              },
            ]}
            testID={testID}
            accessibilityLabel={accessibilityLabel || label}
            accessibilityHint={error || helperText || 'Tap to open selection menu'}
            accessibilityRole="button"
          >
            <View style={styles.selectContent}>
              <View style={styles.selectTextContainer}>
                <Text
                  variant="bodyLarge"
                  style={[
                    styles.selectText,
                    {
                      color: selectedOption
                        ? theme.colors.onSurface
                        : theme.colors.onSurfaceVariant,
                    },
                  ]}
                >
                  {required && !selectedOption ? `${label} *` : label}
                </Text>
                <Text
                  variant="bodyMedium"
                  style={[
                    styles.selectValue,
                    {
                      color: selectedOption
                        ? theme.colors.onSurface
                        : theme.colors.onSurfaceVariant,
                    },
                  ]}
                >
                  {selectedOption ? selectedOption.label : placeholder}
                </Text>
              </View>
              <IconButton
                icon={visible ? 'menu-up' : 'menu-down'}
                size={24}
                iconColor={theme.colors.onSurfaceVariant}
              />
            </View>
          </TouchableOpacity>
        }
      >
        {options.map((option) => (
          <Menu.Item
            key={option.value}
            onPress={() => !option.disabled && handleSelect(option.value)}
            title={option.label}
            disabled={option.disabled}
            titleStyle={{
              color: option.disabled
                ? theme.colors.onSurfaceDisabled
                : theme.colors.onSurface,
            }}
          />
        ))}
      </Menu>
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
  selectButton: {
    borderWidth: 1,
    borderRadius: 4,
    minHeight: 56,
    justifyContent: 'center',
  },
  selectContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  selectTextContainer: {
    flex: 1,
  },
  selectText: {
    fontSize: 12,
    marginBottom: 4,
  },
  selectValue: {
    fontSize: 16,
  },
  helperText: {
    marginTop: 4,
    marginLeft: 16,
  },
});



