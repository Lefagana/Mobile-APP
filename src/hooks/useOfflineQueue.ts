import { useState, useEffect, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNetwork } from '../contexts/NetworkContext';

const QUEUE_STORAGE_KEY = '@wakanda_offline_queue';
const MAX_RETRY_ATTEMPTS = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second

export type QueuedActionStatus = 'queued' | 'sending' | 'failed' | 'completed';

export interface QueuedAction {
  id: string;
  type: string;
  payload: any;
  status: QueuedActionStatus;
  retryCount: number;
  createdAt: string;
  lastAttemptAt?: string;
  error?: string;
}

interface UseOfflineQueueReturn {
  queue: QueuedAction[];
  queueAction: (type: string, payload: any) => Promise<string>;
  removeAction: (actionId: string) => Promise<void>;
  retryAction: (actionId: string) => Promise<void>;
  clearQueue: () => Promise<void>;
  isProcessing: boolean;
  failedActions: QueuedAction[];
}

// Action handlers - functions that execute the actual actions
type ActionHandler = (payload: any) => Promise<any>;

// Register action handlers
const actionHandlers: Map<string, ActionHandler> = new Map();

export const registerActionHandler = (type: string, handler: ActionHandler) => {
  actionHandlers.set(type, handler);
};

export const useOfflineQueue = (storageKey: string = QUEUE_STORAGE_KEY): UseOfflineQueueReturn => {
  const { isOnline } = useNetwork();
  const [queue, setQueue] = useState<QueuedAction[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const processingRef = useRef(false);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load queue from storage on mount
  useEffect(() => {
    loadQueue();
  }, []);

  // Process queue when online
  useEffect(() => {
    if (isOnline && queue.length > 0 && !processingRef.current) {
      processQueue();
    }
  }, [isOnline, queue.length]);

  const loadQueue = async () => {
    try {
      const stored = await AsyncStorage.getItem(QUEUE_STORAGE_KEY);
      if (stored) {
        const parsedQueue = JSON.parse(stored) as QueuedAction[];
        setQueue(parsedQueue);
      }
    } catch (error) {
      console.error('Error loading offline queue:', error);
    }
  };

  const saveQueue = async (newQueue: QueuedAction[]) => {
    try {
      await AsyncStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(newQueue));
      setQueue(newQueue);
    } catch (error) {
      console.error('Error saving offline queue:', error);
    }
  };

  const queueAction = useCallback(
    async (type: string, payload: any): Promise<string> => {
      const actionId = `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const newAction: QueuedAction = {
        id: actionId,
        type,
        payload,
        status: 'queued',
        retryCount: 0,
        createdAt: new Date().toISOString(),
      };

      const updatedQueue = [...queue, newAction];
      await saveQueue(updatedQueue);

      // If online, try to process immediately
      if (isOnline) {
        processQueue();
      }

      return actionId;
    },
    [queue, isOnline]
  );

  const removeAction = useCallback(async (actionId: string) => {
    const updatedQueue = queue.filter((action) => action.id !== actionId);
    await saveQueue(updatedQueue);
  }, [queue]);

  const updateActionStatus = useCallback(
    async (actionId: string, updates: Partial<QueuedAction>) => {
      const updatedQueue = queue.map((action) =>
        action.id === actionId ? { ...action, ...updates } : action
      );
      await saveQueue(updatedQueue);
    },
    [queue]
  );

  const executeAction = async (action: QueuedAction): Promise<boolean> => {
    const handler = actionHandlers.get(action.type);
    if (!handler) {
      console.warn(`No handler registered for action type: ${action.type}`);
      await updateActionStatus(action.id, {
        status: 'failed',
        error: `No handler for action type: ${action.type}`,
      });
      return false;
    }

    try {
      await updateActionStatus(action.id, {
        status: 'sending',
        lastAttemptAt: new Date().toISOString(),
      });

      await handler(action.payload);

      await updateActionStatus(action.id, {
        status: 'completed',
      });

      // Remove completed action after a short delay
      setTimeout(() => {
        removeAction(action.id);
      }, 1000);

      return true;
    } catch (error: any) {
      const retryCount = action.retryCount + 1;
      const shouldRetry = retryCount < MAX_RETRY_ATTEMPTS;

      await updateActionStatus(action.id, {
        status: shouldRetry ? 'queued' : 'failed',
        retryCount,
        error: error?.message || 'Unknown error',
        lastAttemptAt: new Date().toISOString(),
      });

      if (shouldRetry) {
        // Exponential backoff: 1s, 2s, 4s
        const delay = INITIAL_RETRY_DELAY * Math.pow(2, retryCount - 1);
        retryTimeoutRef.current = setTimeout(() => {
          if (isOnline) {
            processQueue();
          }
        }, delay);
      }

      return false;
    }
  };

  const processQueue = useCallback(async () => {
    if (processingRef.current || !isOnline) {
      return;
    }

    processingRef.current = true;
    setIsProcessing(true);

    try {
      const queuedActions = queue.filter(
        (action) => action.status === 'queued' || action.status === 'failed'
      );

      if (queuedActions.length === 0) {
        processingRef.current = false;
        setIsProcessing(false);
        return;
      }

      // Process actions sequentially
      for (const action of queuedActions) {
        if (!isOnline) {
          break; // Stop if went offline
        }
        await executeAction(action);
      }
    } finally {
      processingRef.current = false;
      setIsProcessing(false);
    }
  }, [queue, isOnline]);

  const retryAction = useCallback(
    async (actionId: string) => {
      const action = queue.find((a) => a.id === actionId);
      if (!action) {
        return;
      }

      await updateActionStatus(actionId, {
        status: 'queued',
        retryCount: 0,
        error: undefined,
      });

      if (isOnline) {
        processQueue();
      }
    },
    [queue, isOnline, processQueue]
  );

  const clearQueue = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(QUEUE_STORAGE_KEY);
      setQueue([]);
    } catch (error) {
      console.error('Error clearing queue:', error);
    }
  }, []);

  const failedActions = queue.filter((action) => action.status === 'failed');

  return {
    queue,
    queueAction,
    removeAction,
    retryAction,
    clearQueue,
    isProcessing,
    failedActions,
  };
};



