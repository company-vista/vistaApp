import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { BackButton } from '../../../components/buttons';
import { useThemeColors } from '../../../theme/colors';
import { styles } from './TransactionDetailScreenStyles';

export type TransactionDetail = {
  _id: string;
  amount: number;
  onlineAmount?: number;
  cashAmount?: number;
  currency: string;
  date: string;
  status: 'completed' | 'pending' | 'failed' | 'active' | string;
  type: string;
  description: string;
  notes: string;
  company: string;
  paymentMethod: string;
  referenceId: string;
  transactionId: string;
  gateway: string;
  bankName: string;
  accountLast4: string;
  createdBy: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  invoice?: string | Record<string, unknown> | null;
};

type TransactionDetailScreenProps = {
  transaction: TransactionDetail;
  onBackPress: () => void;
};

export default function TransactionDetailScreen({
  transaction,
  onBackPress,
}: TransactionDetailScreenProps) {
  const safeAreaInsets = useSafeAreaInsets();
  const colors = useThemeColors();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'active':
        return '#16a34a';
      case 'pending':
        return '#ca8a04';
      case 'failed':
        return '#dc2626';
      default:
        return colors.text;
    }
  };
console.log(transaction);
  const getStatusBg = (status: string) => {
    switch (status) {
      case 'completed':
      case 'active':
        return '#f0fdf4';
      case 'pending':
        return '#fef9c3';
      case 'failed':
        return '#fef2f2';
      default:
        return colors.surface;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const formatDetailValue = (value: unknown) => {
    if (value === null || value === undefined || value === '') {
      return '-';
    }

    if (typeof value === 'string') {
      return value;
    }

    if (typeof value === 'number' || typeof value === 'boolean') {
      return String(value);
    }

    if (typeof value === 'object') {
      const record = value as Record<string, unknown>;
      const invoiceNumber = typeof record.invoiceNumber === 'string' ? record.invoiceNumber : '';
      const invoiceId = typeof record._id === 'string' ? record._id : '';
      const numberValue = typeof record.number === 'string' ? record.number : '';
      return invoiceNumber || numberValue || invoiceId || '-';
    }

    return '-';
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background, paddingTop: safeAreaInsets.top + 22 }]}>
      {/* Header */}
      <View style={styles.header}>
        <BackButton onPress={onBackPress} />
        <Text style={[styles.title, { color: colors.text }]}>Transaction Details</Text>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: safeAreaInsets.bottom + 24,
        }}
        showsVerticalScrollIndicator={false}>
        {/* Amount Section */}
        <View style={[styles.amountCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {/* <Text style={[styles.amountLabel, { color: colors.muted }]}>Total Amount</Text>
          <Text style={[styles.amountValue, { color: colors.text }]}>
            {formatCurrency(transaction.amount, transaction.currency)}
          </Text> */}
          <View style={styles.amountBreakdown}>
            {transaction.onlineAmount !== undefined && (
              <View style={[styles.amountModeCard, { backgroundColor: 'rgba(37, 99, 235, 0.1)' }]}>
                <Text style={[styles.amountModeLabel, { color: '#2563eb' }]}>Online</Text>
                <Text style={[styles.amountModeValue, { color: '#2563eb' }]}>
                  {formatCurrency(transaction.onlineAmount, transaction.currency)}
                </Text>
              </View>
            )}
            {transaction.cashAmount !== undefined && (
              <View style={[styles.amountModeCard, { backgroundColor: 'rgba(5, 150, 105, 0.1)' }]}>
                <Text style={[styles.amountModeLabel, { color: '#059669' }]}>Cash</Text>
                <Text style={[styles.amountModeValue, { color: '#059669' }]}>
                  {formatCurrency(transaction.cashAmount, transaction.currency)}
                </Text>
              </View>
            )}
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusBg(transaction.status) },
            ]}>
            <Text
              style={[
                styles.statusText,
                { color: getStatusColor(transaction.status) },
              ]}>
              {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
            </Text>
          </View>
        </View>

        {/* Transaction Info */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Transaction Information</Text>

          <DetailRow
            label="Transaction ID"
            value={transaction.transactionId}
            colors={colors}
          />
          <DetailRow
            label="Reference ID"
            value={transaction.referenceId}
            colors={colors}
          />
          <DetailRow
            label="Type"
            value={transaction.type.replace(/_/g, ' ').toUpperCase()}
            colors={colors}
          />
          <DetailRow
            label="Date"
            value={formatDate(transaction.date)}
            colors={colors}
          />
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Payment Method</Text>

          <DetailRow
            label="Method"
            value={transaction.paymentMethod.toUpperCase()}
            colors={colors}
          />
          <DetailRow
            label="Gateway"
            value={transaction.gateway.charAt(0).toUpperCase() + transaction.gateway.slice(1)}
            colors={colors}
          />
          {transaction.bankName && (
            <DetailRow
              label="Bank"
              value={transaction.bankName.toUpperCase()}
              colors={colors}
            />
          )}
          {transaction.accountLast4 && (
            <DetailRow
              label="Account"
              value={`•••• ${transaction.accountLast4}`}
              colors={colors}
            />
          )}
        </View>

        {/* Description & Notes */}
        {(transaction.description || transaction.notes) && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Additional Information</Text>

            {transaction.description && (
              <DetailRow
                label="Description"
                value={transaction.description}
                colors={colors}
              />
            )}
            {transaction.notes && (
              <DetailRow
                label="Notes"
                value={transaction.notes}
                colors={colors}
              />
            )}
          </View>
        )}

        {/* Metadata */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Metadata</Text>

          <DetailRow
            label="Created At"
            value={formatDate(transaction.createdAt)}
            colors={colors}
          />
          <DetailRow
            label="Updated At"
            value={formatDate(transaction.updatedAt)}
            colors={colors}
          />
          <DetailRow
            label="Status"
            value={transaction.isActive ? 'Active' : 'Inactive'}
            colors={colors}
          />
          {transaction.invoice && (
            <DetailRow
              label="Invoice"
              value={formatDetailValue(transaction.invoice)}
              colors={colors}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

interface DetailRowProps {
  label: string;
  value: unknown;
  colors: any;
}

function DetailRow({ label, value, colors }: DetailRowProps) {
  const resolvedValue = typeof value === 'string' ? value : '';

  return (
    <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
      <Text style={[styles.detailLabel, { color: colors.muted }]}>{label}</Text>
      <Text style={[styles.detailValue, { color: colors.text }]} numberOfLines={2}>
        {resolvedValue || '-'}
      </Text>
    </View>
  );
}

// const styles = StyleSheet.create({
//   screen: {
//     flex: 1,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     gap: 12,
//     marginBottom: 20,
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: '500',
//   },
//   amountCard: {
//     padding: 20,
//     borderRadius: 16,
//     borderWidth: 1,
//     marginBottom: 24,
//     alignItems: 'center',
//   },
//   amountLabel: {
//     fontSize: 12,
//     fontWeight: '600',
//     marginBottom: 8,
//   },
//   amountValue: {
//     fontSize: 32,
//     fontWeight: '800',
//     marginBottom: 12,
//   },
//   amountBreakdown: {
//     flexDirection: 'row',
//     gap: 12,
//     marginBottom: 16,
//     width: '100%',
//   },
//   amountModeCard: {
//     flex: 1,
//     padding: 12,
//     borderRadius: 10,
//     alignItems: 'center',
//   },
//   amountModeLabel: {
//     fontSize: 10,
//     fontWeight: '600',
//     marginBottom: 4,
//   },
//   amountModeValue: {
//     fontSize: 14,
//     fontWeight: '700',
//   },
//   statusBadge: {
//     paddingHorizontal: 16,
//     paddingVertical: 6,
//     borderRadius: 8,
//   },
//   statusText: {
//     fontSize: 12,
//     fontWeight: '700',
//   },
//   section: {
//     marginBottom: 24,
//   },
//   sectionTitle: {
//     fontSize: 14,
//     fontWeight: '700',
//     marginBottom: 12,
//   },
//   detailRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//   },
//   detailLabel: {
//     fontSize: 12,
//     fontWeight: '600',
//     flex: 0.4,
//   },
//   detailValue: {
//     fontSize: 12,
//     fontWeight: '500',
//     flex: 0.6,
//     textAlign: 'right',
//   },
// });
