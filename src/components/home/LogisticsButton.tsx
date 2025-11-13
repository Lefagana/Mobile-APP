import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, useTheme, IconButton } from 'react-native-paper';

export interface LogisticsButtonProps {
  onPress?: () => void;
}

export const LogisticsButton: React.FC<LogisticsButtonProps> = ({ onPress }) => {
  const theme = useTheme();

  return (
    // <TouchableOpacity
    //   style={[
    //     styles.container,
    //     {
    //       backgroundColor: theme.colors.surface,
    //       borderColor: theme.colors.outlineVariant,
    //     },
    //   ]}
    //   onPress={onPress}
    //   activeOpacity={0.7}
    // >
    //   <IconButton icon="package-variant" size={24} iconColor={theme.colors.primary} />
    //   <Text variant="labelLarge" style={[styles.text, { color: theme.colors.onSurface }]}>
    //     Send Package
    //   </Text>
    // </TouchableOpacity>
    <></>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  text: {
    marginLeft: 8,
    fontWeight: '600',
  },
});

export default LogisticsButton;
