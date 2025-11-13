import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, useTheme, IconButton, Chip } from 'react-native-paper';
import { useOfflineQueue } from '../../hooks/useOfflineQueue';

interface QueueStatusIndicatorProps {
  onPress?: () => void;
}

/**
 * Component to show overall queue status (number of pending actions)
 * Can be displayed in header or bottom bar
 */
export const QueueStatusIndicator: React.FC<QueueStatusIndicatorProps> = ({
  onPress,
}) => {
  const theme = useTheme();
  const { queue, isProcessing, failedActions } = useOfflineQueue();

  const pendingActions = queue.filter(
    action => action.status === 'queued' || action.status === 'sending'
  );

  // Don't show if queue is empty
  if (queue.length === 0) return null;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <View style={styles.container}>
        {isProcessing && (
          <IconButton
            icon="sync"
            size={20}
            iconColor={theme.colors.primary}
            style={styles.icon}
            animated
          />
        )}
        {pendingActions.length > 0 && (
          <Chip
            compact
            style={[
              styles.chip,
              {
                backgroundColor: theme.colors.secondaryContainer,
              },
            ]}
            textStyle={{
              color: theme.colors.onSecondaryContainer,
              fontSize: 11,
            }}
          >
            {pendingActions.length} pending
          </Chip>
        )}
        {failedActions.length > 0 && (
          <Chip
            compact
            icon="alert-circle"
            style={[
              styles.chip,
              {
                backgroundColor: theme.colors.errorContainer,
              },
            ]}
            textStyle={{
              color: theme.colors.onErrorContainer,
              fontSize: 11,
            }}
          >
            {failedActions.length} failed
          </Chip>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  icon: {
    margin: 0,
  },
  chip: {
    height: 20,
    marginHorizontal: 2,
  },
});

