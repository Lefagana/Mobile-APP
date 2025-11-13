import React, { useState } from 'react';
import { View, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { Text, IconButton, useTheme, Banner } from 'react-native-paper';
import { useNetwork } from '../../contexts/NetworkContext';
import { useLocalization } from '../../contexts/LocalizationContext';

export interface OfflineBannerProps {
  dismissible?: boolean;
  onDismiss?: () => void;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({
  dismissible = true,
  onDismiss,
}) => {
  const theme = useTheme();
  const { isOnline } = useNetwork();
  const [visible, setVisible] = useState(true);
  const { t } = useLocalization();

  const handleDismiss = () => {
    setVisible(false);
    if (onDismiss) {
      onDismiss();
    }
  };

  if (isOnline || !visible) {
    return null;
  }

  const actions = [] as { label: string; onPress: () => void }[];
  if (dismissible) {
    actions.push({ label: t('common.close'), onPress: handleDismiss });
  }

  return (
    <Banner
      visible={true}
      actions={actions}
      icon="wifi-off"
      style={{
        backgroundColor: theme.colors.errorContainer,
      }}
      accessibilityRole="alert"
    >
      <Text variant="bodyMedium" style={{ color: theme.colors.onErrorContainer }}>
        {t('offline.title')}: {t('offline.message')}
      </Text>
    </Banner>
  );
};

export default OfflineBanner;
