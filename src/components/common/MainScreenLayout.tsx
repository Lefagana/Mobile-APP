import React, { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { HomeTabBar, MinimalFooter } from '../home';
import { ScreenContainer } from './ScreenContainer';

export interface MainScreenLayoutProps {
  children: ReactNode;
  showOfflineBanner?: boolean;
}

export const MainScreenLayout: React.FC<MainScreenLayoutProps> = ({
  children,
  showOfflineBanner = true,
}) => {
  return (
    <ScreenContainer scrollable={true} showOfflineBanner={showOfflineBanner}>
      {children}
      <HomeTabBar />
      <MinimalFooter />
    </ScreenContainer>
  );
};

export default MainScreenLayout;

