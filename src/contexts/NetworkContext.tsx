import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { Platform } from 'react-native';

interface NetworkContextType {
  isOnline: boolean;
  isConnected: boolean;
  type: string | null;
}

const NetworkContext = createContext<NetworkContextType>({
  isOnline: true,
  isConnected: true,
  type: null,
});

export const useNetwork = () => {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error('useNetwork must be used within NetworkProvider');
  }
  return context;
};

interface NetworkProviderProps {
  children: ReactNode;
}

export const NetworkProvider: React.FC<NetworkProviderProps> = ({ children }) => {
  const [networkState, setNetworkState] = useState<NetworkContextType>({
    isOnline: true,
    isConnected: true,
    type: null,
  });

  useEffect(() => {
    // Get initial network state
    NetInfo.fetch().then((state: NetInfoState) => {
      setNetworkState({
        isOnline: state.isConnected ?? false,
        isConnected: state.isInternetReachable ?? false,
        type: state.type,
      });
    });

    // Subscribe to network state updates
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      setNetworkState({
        isOnline: state.isConnected ?? false,
        isConnected: state.isInternetReachable ?? false,
        type: state.type,
      });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <NetworkContext.Provider value={networkState}>
      {children}
    </NetworkContext.Provider>
  );
};
