import React, { useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Modal, Platform } from 'react-native';
import {
  Text,
  useTheme,
  Button,
  Card,
  ActivityIndicator,
  TextInput,
  Divider,
  Chip,
  IconButton,
  Snackbar,
} from 'react-native-paper';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ScreenContainer, EmptyState, ErrorState, LoginPromptModal } from '../../components/common';
import { HomeTabBar } from '../../components/home';
import { WalletTransaction } from '../../types';
import { api } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { useAuthGuard } from '../../utils/authGuard';
import { formatCurrency, formatDate } from '../../utils/formatters';

const QUICK_AMOUNTS = [1000, 2500, 5000, 10000, 20000];

const Wallet: React.FC = () => {
  const theme = useTheme();
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const { handleLoginSuccess, dismissLoginPrompt } = useAuthGuard();
  const [topUpModalVisible, setTopUpModalVisible] = useState(false);
  const [loginModalVisible, setLoginModalVisible] = useState(true);
  const [customAmount, setCustomAmount] = useState('');
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'credit' | 'debit'>('all');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Fetch wallet data
  const {
    data: wallet,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['wallet', user?.id],
    queryFn: () => api.wallet.get(user?.id || 'user_001'),
    enabled: !!user?.id,
  });

  // Top-up mutation
  const topUpMutation = useMutation({
    mutationFn: ({ amount, method }: { amount: number; method: string }) =>
      api.wallet.topUp(user?.id || 'user_001', amount, method),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet', user?.id] });
      setTopUpModalVisible(false);
      setSelectedAmount(null);
      setCustomAmount('');
    },
  });

  const handleTopUp = useCallback(() => {
    const amount = selectedAmount || parseFloat(customAmount);
    if (amount && amount > 0) {
      topUpMutation.mutate({ amount, method: 'paystack' });
    }
  }, [selectedAmount, customAmount, topUpMutation]);

  const handleQuickAmountSelect = useCallback((amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  }, []);

  const handleCustomAmountChange = useCallback((text: string) => {
    setCustomAmount(text);
    setSelectedAmount(null);
  }, []);

  const filteredTransactions = wallet?.transactions.filter((txn) => {
    if (filterType === 'all') return true;
    return txn.type === filterType;
  }) || [];

  const bankName = (wallet as any)?.bankName ?? (wallet as any)?.bank_name ?? '';
  const accountNumber = (wallet as any)?.accountNumber ?? (wallet as any)?.account_number ?? '';

  const handleCopyAccount = useCallback(async () => {
    if (!accountNumber) return;
    try {
      if (Platform.OS === 'web') {
        const nav: any = (globalThis as any).navigator;
        if (nav?.clipboard?.writeText) {
          await nav.clipboard.writeText(String(accountNumber));
        } else {
          throw new Error('Clipboard API not available');
        }
      } else {
        let ExpoClipboard: any;
        try {
          ExpoClipboard = require('expo-clipboard');
        } catch {}
        if (ExpoClipboard?.setStringAsync) {
          await ExpoClipboard.setStringAsync(String(accountNumber));
        } else if (ExpoClipboard?.default?.setStringAsync) {
          await ExpoClipboard.default.setStringAsync(String(accountNumber));
        } else {
          throw new Error('Clipboard module not available');
        }
      }
      setSnackbarMessage('Account number copied');
      setSnackbarVisible(true);
    } catch (e) {
      setSnackbarMessage('Copy failed. Long-press the number to select and copy.');
      setSnackbarVisible(true);
    }
  }, [accountNumber]);

  const renderTransaction = useCallback(
    ({ item }: { item: WalletTransaction }) => {
      const isCredit = item.type === 'credit';
      const amountColor = isCredit ? theme.colors.primary : theme.colors.error;
      const icon = isCredit ? 'arrow-down' : 'arrow-up';

      return (
        <Card style={[styles.transactionCard, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.transactionRow}>
            <View style={[styles.transactionIcon, { backgroundColor: `${amountColor}20` }]}>
              <IconButton icon={icon} size={24} iconColor={amountColor} style={styles.iconButton} />
            </View>
            <View style={styles.transactionDetails}>
              <Text variant="bodyLarge" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
                {item.description}
              </Text>
              <View style={styles.transactionMeta}>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  {formatDate(item.created_at)}
                </Text>
                {item.reference && (
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                    Ref: {item.reference}
                  </Text>
                )}
              </View>
            </View>
            <View style={styles.transactionAmount}>
              <Text
                variant="titleMedium"
                style={{ color: amountColor, fontWeight: '600' }}
              >
                {isCredit ? '+' : '-'}{formatCurrency(item.amount, wallet?.currency || 'NGN')}
              </Text>
              <Chip
                style={[
                  styles.statusChip,
                  item.status === 'completed' && { backgroundColor: theme.colors.primaryContainer },
                  item.status === 'pending' && { backgroundColor: theme.colors.surfaceVariant },
                  item.status === 'failed' && { backgroundColor: theme.colors.errorContainer },
                ]}
                textStyle={[
                  styles.statusText,
                  item.status === 'completed' && { color: theme.colors.onPrimaryContainer },
                  item.status === 'pending' && { color: theme.colors.onSurfaceVariant },
                  item.status === 'failed' && { color: theme.colors.onErrorContainer },
                ]}
              >
                {item.status}
              </Chip>
            </View>
          </View>
        </Card>
      );
    },
    [theme, wallet]
  );

  const renderTopUpModal = () => (
    <Modal
      visible={topUpModalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setTopUpModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <Card style={[styles.modalCard, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.modalHeader}>
            <Text variant="headlineSmall" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
              Top Up Wallet
            </Text>
            <IconButton
              icon="close"
              size={24}
              onPress={() => setTopUpModalVisible(false)}
              iconColor={theme.colors.onSurface}
            />
          </View>

          <Divider style={styles.modalDivider} />

          <View style={styles.quickAmountsContainer}>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 12 }}>
              Quick Amounts
            </Text>
            <View style={styles.quickAmountsGrid}>
              {QUICK_AMOUNTS.map((amount) => (
                <TouchableOpacity
                  key={amount}
                  style={[
                    styles.quickAmountButton,
                    selectedAmount === amount && {
                      backgroundColor: theme.colors.primaryContainer,
                      borderColor: theme.colors.primary,
                    },
                    !selectedAmount && {
                      borderColor: theme.colors.outline,
                    },
                  ]}
                  onPress={() => handleQuickAmountSelect(amount)}
                >
                  <Text
                    variant="bodyLarge"
                    style={[
                      selectedAmount === amount && { color: theme.colors.onPrimaryContainer, fontWeight: '600' },
                      !selectedAmount && { color: theme.colors.onSurface },
                    ]}
                  >
                    {formatCurrency(amount, 'NGN')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.customAmountContainer}>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 8 }}>
              Or enter custom amount
            </Text>
            <TextInput
              label="Amount (NGN)"
              value={customAmount}
              onChangeText={handleCustomAmountChange}
              keyboardType="numeric"
              mode="outlined"
              style={styles.amountInput}
              left={<TextInput.Icon icon="currency-ngn" />}
            />
          </View>

          <View style={styles.modalActions}>
            <Button
              mode="outlined"
              onPress={() => setTopUpModalVisible(false)}
              style={styles.modalButton}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleTopUp}
              loading={topUpMutation.isPending}
              disabled={!selectedAmount && !customAmount}
              style={styles.modalButton}
            >
              Continue
            </Button>
          </View>
        </Card>
      </View>
    </Modal>
  );

  if (!isAuthenticated) {
    return (
      <ScreenContainer scrollable={false}>
        <HomeTabBar />
        <View style={styles.loadingContainer}>
          <Text variant="headlineSmall" style={{ marginBottom: 16, textAlign: 'center' }}>
            Wallet
          </Text>
          <Text variant="bodyMedium" style={{ marginBottom: 16, textAlign: 'center' }}>
            Please login to access your wallet
          </Text>
          <LoginPromptModal
            visible={loginModalVisible}
            onDismiss={() => setLoginModalVisible(false)}
            message="Please login to access your wallet and manage your payments"
            onLoginSuccess={handleLoginSuccess}
          />
        </View>
      </ScreenContainer>
    );
  }

  if (isLoading) {
    return (
      <ScreenContainer scrollable={false}>
        <HomeTabBar />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </ScreenContainer>
    );
  }

  if (isError) {
    return (
      <ScreenContainer scrollable={false}>
        <HomeTabBar />
        <ErrorState
          title="Failed to Load Wallet"
          message="Unable to load your wallet information. Please try again."
          onRetry={refetch}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scrollable={false} showOfflineBanner={true}>
      <HomeTabBar />
      <View style={styles.contentWrapper}>
        {/* Balance Card */}
        <Card style={[styles.balanceCard, { backgroundColor: theme.colors.primaryContainer }]}>
        <Text variant="bodyMedium" style={{ color: theme.colors.onPrimaryContainer, marginBottom: 6 }}>
          Wallet Balance
        </Text>
        <Text
          variant="displayMedium"
          style={{ color: theme.colors.onPrimaryContainer, fontWeight: 'bold', marginBottom: 8 }}
        >
          {formatCurrency(wallet?.balance || 0, wallet?.currency || 'NGN')}
        </Text>
        <View style={[styles.bankInfoContainer, { backgroundColor: theme.colors.primaryContainer }]}> 
          <View style={styles.bankInfoRow}>
            <View style={styles.bankInfoItem}>
              <Text variant="labelSmall" style={[styles.infoLabel, { color: theme.colors.onPrimaryContainer }]}> 
                Bank Name
              </Text>
              <Text
                variant="titleMedium"
                numberOfLines={1}
                style={[styles.infoValue, { color: theme.colors.onPrimaryContainer }]}
              >
                {bankName || '—'}
              </Text>
            </View>
            <View style={styles.verticalDivider} />
            <View style={styles.bankInfoItem}>
              <Text variant="labelSmall" style={[styles.infoLabel, { color: theme.colors.onPrimaryContainer }]}> 
                Account Number
              </Text>
              <View style={styles.inlineRow}>
                <Text
                  variant="titleMedium"
                  numberOfLines={1}
                  selectable
                  style={[styles.infoValue, { color: theme.colors.onPrimaryContainer, letterSpacing: 0.5, flexShrink: 1 }]}
                >
                  {accountNumber || '—'}
                </Text>
                {!!accountNumber && (
                  <IconButton
                    icon="content-copy"
                    size={18}
                    onPress={handleCopyAccount}
                    iconColor={theme.colors.onPrimaryContainer}
                    style={styles.copyIcon}
                  />
                )}
              </View>
            </View>
          </View>
        </View>
        <Button
          mode="contained"
          icon="plus"
          onPress={() => setTopUpModalVisible(true)}
          style={styles.topUpButton}
          buttonColor={theme.colors.primary}
          textColor={theme.colors.onPrimary}
        >
          Top Up
        </Button>
      </Card>

      {/* Filter Tabs */}
      <View style={[styles.filterContainer, { backgroundColor: theme.colors.surface }]}>
        <TouchableOpacity
          style={[
            styles.filterTab,
            filterType === 'all' && [styles.activeFilterTab, { borderBottomColor: theme.colors.primary }],
          ]}
          onPress={() => setFilterType('all')}
        >
          <Text
            variant="labelLarge"
            style={[
              filterType === 'all' && { color: theme.colors.primary, fontWeight: '600' },
              filterType !== 'all' && { color: theme.colors.onSurfaceVariant },
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterTab,
            filterType === 'credit' && [styles.activeFilterTab, { borderBottomColor: theme.colors.primary }],
          ]}
          onPress={() => setFilterType('credit')}
        >
          <Text
            variant="labelLarge"
            style={[
              filterType === 'credit' && { color: theme.colors.primary, fontWeight: '600' },
              filterType !== 'credit' && { color: theme.colors.onSurfaceVariant },
            ]}
          >
            Credits
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterTab,
            filterType === 'debit' && [styles.activeFilterTab, { borderBottomColor: theme.colors.primary }],
          ]}
          onPress={() => setFilterType('debit')}
        >
          <Text
            variant="labelLarge"
            style={[
              filterType === 'debit' && { color: theme.colors.primary, fontWeight: '600' },
              filterType !== 'debit' && { color: theme.colors.onSurfaceVariant },
            ]}
          >
            Debits
          </Text>
        </TouchableOpacity>
      </View>

      {/* Transactions List */}
      <FlatList
        style={{ flex: 1 }}
        data={filteredTransactions}
        renderItem={renderTransaction}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.transactionsContainer}
        ListEmptyComponent={
          <EmptyState
            icon="wallet-outline"
            title="No transactions"
            description={`You don't have any ${filterType === 'all' ? '' : filterType} transactions yet.`}
          />
        }
        showsVerticalScrollIndicator={true}
        refreshing={isLoading}
        onRefresh={refetch}
      />
      </View>

      <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)} duration={1500}>
        {snackbarMessage}
      </Snackbar>

      {renderTopUpModal()}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 56, // Padding for sticky HomeTabBar
  },
  contentWrapper: {
    paddingTop: 56, // Padding for sticky HomeTabBar
    flex: 1,
  },
  balanceCard: {
    margin: 10,
    padding: 16,
    borderRadius: 14,
    elevation: 2,
  },
  topUpButton: {
    marginTop: 4,
  },
  bankInfoContainer: {
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginBottom: 6,
  },
  bankInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bankInfoItem: {
    flex: 1,
    minWidth: 0,
  },
  verticalDivider: {
    width: 1,
    alignSelf: 'stretch',
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginHorizontal: 6,
  },
  infoLabel: {
    opacity: 0.9,
    marginBottom: 2,
  },
  infoValue: {
    fontWeight: '600',
  },
  inlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  copyIcon: {
    margin: 0,
    marginLeft: 4,
  },
  filterContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E6E6E6',
    paddingHorizontal: 10,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
  },
  activeFilterTab: {
    borderBottomWidth: 2,
  },
  transactionsContainer: {
    padding: 8,
    paddingBottom: 16,
  },
  transactionCard: {
    padding: 12,
    marginBottom: 8,
    borderRadius: 12,
    elevation: 1,
  },
  transactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButton: {
    margin: 0,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionMeta: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  transactionAmount: {
    alignItems: 'flex-end',
    gap: 6,
  },
  statusChip: {
    height: 20,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalDivider: {
    marginBottom: 24,
  },
  quickAmountsContainer: {
    marginBottom: 24,
  },
  quickAmountsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickAmountButton: {
    flex: 1,
    minWidth: '30%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  customAmountContainer: {
    marginBottom: 24,
  },
  amountInput: {
    marginTop: 8,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
  },
});

export default Wallet;
