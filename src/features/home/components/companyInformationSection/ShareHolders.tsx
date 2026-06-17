import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useThemeColors } from '../../../../theme/colors';

type Shareholder = {
  id: string;
  name: string;
  shares: number;
  percentage: number;
};

type ShareHoldersProps = {
  companyId: string;
};

// Mock data – in a real app this would be fetched from an API using the companyId
const mockShareholders: Shareholder[] = [
  { id: '1', name: 'Alice Johnson', shares: 1200, percentage: 12 },
  { id: '2', name: 'Bob Smith', shares: 800, percentage: 8 },
  { id: '3', name: 'Carol Lee', shares: 5000, percentage: 50 },
  { id: '4', name: 'Dave Patel', shares: 2500, percentage: 30 },
];

const ShareHolders: React.FC<ShareHoldersProps> = ({ companyId }) => {
  const colors = useThemeColors();
  // In a full implementation you would use companyId to fetch the data
  const data = mockShareholders;

  const renderItem = ({ item }: { item: Shareholder }) => (
    <View style={styles.item}>
      <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
      <View style={styles.details}>
        <Text style={{ color: colors.subtle }}>{item.shares} shares</Text>
        <Text style={[styles.percentage, { color: colors.subtle }]}>{item.percentage}%</Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Text style={[styles.header, { color: colors.text }]}>Shareholders</Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={[styles.separator, { backgroundColor: colors.border }]} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
  },
  header: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 12,
  },
  item: {
    paddingVertical: 8,
  },
  name: {
    fontSize: 13,
    fontWeight: '500',
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  percentage: {
    fontSize: 12,
  },
  separator: {
    height: 1,
    marginVertical: 6,
  },
});

export default ShareHolders;
