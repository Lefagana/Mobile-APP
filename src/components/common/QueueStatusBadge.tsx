import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Chip, useTheme, IconButton } from 'react-native-paper';
import { useOfflineQueue } from '../../hooks/useOfflineQueue';
import { QueuedActionStatus } from '../../hooks/useOfflineQueue';

interface QueueStatusBadgeProps {
  actionId?: string;
  onPress?: () => void;
}

export const QueueStatusBadge: React.FC<QueueStatusBadgeProps> = ({
  actionId,
  onPress,
}) => {
  const theme = useTheme();
  const { queue } = useOfflineQueue();

  if (!actionId) return null;

  const action = queue.find(a => a.id === actionId);
  if (!action || action.status === 'completed') return null;

  const getStatusColor = (status: QueuedActionStatus) => {
    switch (status) {
      case 'queued':
        return theme.colors.secondaryContainer;
      case 'sending':
        return theme.colors.primaryContainer;
      case 'failed':
        return theme.colors.errorContainer;
      default:
        return theme.colors.surfaceVariant;
    }
  };

  const getStatusText = (status: QueuedActionStatus) => {
    switch (status) {
      case 'queued':
        return 'Queued';
      case 'sending':
        return 'Sending...';
      case 'failed':
        return 'Failed';
      default:
        return '';
    }
  };

  const getStatusIcon = (status: QueuedActionStatus) => {
    switch (status) {
      case 'queued':
        return 'clock-outline';
      case 'sending':
        return 'sync';
      case 'failed':
        return 'alert-circle';
      default:
        return 'information';
    }
  };

  const statusColor = getStatusColor(action.status);
  const statusText = getStatusText(action.status);
  const statusIcon = getStatusIcon(action.status);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Chip
        icon={statusIcon}
        style={[
          styles.badge,
          {
            backgroundColor: statusColor,
          },
        ]}
        textStyle={{
          color: theme.colors.onSecondaryContainer,
          fontSize: 12,
        }}
      >
        {statusText}
      </Chip>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  badge: {
    height: 24,
    marginHorizontal: 4,
  },
});

