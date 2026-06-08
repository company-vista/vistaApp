import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { useThemeColors } from '../../../../theme/colors';

const clients = [
  {
    initials: 'AC',
    name: 'ABC Enterprises Pvt. Ltd.',
    email: 'contact@abcenterprises.com',
    phone: '+91 98765 43210',
    status: 'Active',
    date: '20 May 2024',
    avatarColor: '#dbeafe',
    initialsColor: '#2563eb',
  },
  {
    initials: 'VG',
    name: 'Vista Group',
    email: 'info@vistagroup.com',
    phone: '+91 91234 56789',
    status: 'Active',
    date: '18 May 2024',
    avatarColor: '#ede9fe',
    initialsColor: '#4f46e5',
  },
  {
    initials: 'SF',
    name: 'Shine Finance Ltd.',
    email: 'hello@shinefinance.com',
    phone: '+91 99887 76655',
    status: 'Active',
    date: '15 May 2024',
    avatarColor: '#ffedd5',
    initialsColor: '#b45309',
  },
  {
    initials: 'TI',
    name: 'Tech Innovators',
    email: 'support@techinnovators.com',
    phone: '+91 77665 44332',
    status: 'Active',
    date: '10 May 2024',
    avatarColor: '#dcfce7',
    initialsColor: '#059669',
  },
  {
    initials: 'GL',
    name: 'Greenlight Solutions',
    email: 'contact@greenlights.com',
    phone: '+91 88776 65544',
    status: 'Inactive',
    date: '05 May 2024',
    avatarColor: '#fce7f3',
    initialsColor: '#be185d',
  },
];

type ClientStatusFilter = 'All' | 'Active' | 'Inactive';

type ClientScreenProps = {
  isEmbedded?: boolean;
  onBackPress?: () => void;
};

function ClientScreen({ isEmbedded = false, onBackPress }: ClientScreenProps) {
  const safeAreaInsets = useSafeAreaInsets();
  const colors = useThemeColors();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ClientStatusFilter>('All');
  const filteredClients = clients.filter(client => {
    const query = searchQuery.trim().toLowerCase();
    const matchesStatus =
      statusFilter === 'All' || client.status === statusFilter;

    if (!matchesStatus) {
      return false;
    }

    if (!query) {
      return true;
    }

    return [client.name, client.email, client.phone]
      .join(' ')
      .toLowerCase()
      .includes(query);
  });

  const content = (
    <>
      <View style={styles.header}>
        {onBackPress ? (
          <Pressable onPress={onBackPress} style={styles.backButton}>
            <FontAwesome name="arrow-left" size={22} color={colors.text} />
          </Pressable>
        ) : null}
        <View style={styles.headerCopy}>
          <Text style={[styles.title, { color: colors.text }]}>Companies</Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>
            Manage and view all your companies
          </Text>
        </View>
        <View style={styles.headerActions}>
          <Pressable style={styles.iconButton}>
            <FontAwesome name="filter" size={20} color={colors.text} />
          </Pressable>
          <Pressable style={styles.iconButton}>
            <FontAwesome name="plus" size={21} color={colors.text} />
          </Pressable>
        </View>
      </View>

      <View
        style={[
          styles.searchBox,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}>
        <FontAwesome name="search" size={17} color={colors.muted} />
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search companies by name, email or phone..."
          placeholderTextColor={colors.muted}
          returnKeyType="search"
          style={[styles.searchInput, { color: colors.text }]}
        />
        {searchQuery.length > 0 ? (
          <Pressable
            onPress={() => setSearchQuery('')}
            style={styles.clearSearchButton}>
            <FontAwesome name="times-circle" size={18} color={colors.muted} />
          </Pressable>
        ) : null}
      </View>

      <View style={styles.filterRow}>
        <Pressable
          onPress={() => setStatusFilter('All')}
          style={[
            styles.filterChip,
            statusFilter === 'All' ? styles.activeFilterChip : null,
            { backgroundColor: colors.surface, borderColor: colors.accentSoft },
          ]}>
          <FontAwesome
            name="users"
            size={16}
            color={statusFilter === 'All' ? '#2563eb' : colors.muted}
          />
          <Text
            style={[
              styles.filterText,
              statusFilter === 'All' ? styles.activeFilterText : { color: colors.text },
            ]}>
            All Companies
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setStatusFilter('Active')}
          style={[
            styles.filterChip,
            statusFilter === 'Active' ? styles.activeFilterChip : null,
            {
              backgroundColor: colors.surface,
              borderColor:
                statusFilter === 'Active' ? colors.accentSoft : colors.border,
            },
          ]}>
          <View style={[styles.statusDot, styles.activeStatusDot]} />
          <Text
            style={[
              styles.filterText,
              statusFilter === 'Active'
                ? styles.activeFilterText
                : { color: colors.text },
            ]}>
            Active
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setStatusFilter('Inactive')}
          style={[
            styles.filterChip,
            statusFilter === 'Inactive' ? styles.activeFilterChip : null,
            {
              backgroundColor: colors.surface,
              borderColor:
                statusFilter === 'Inactive' ? colors.accentSoft : colors.border,
            },
          ]}>
          <View style={[styles.statusDot, { backgroundColor: colors.subtle }]} />
          <Text
            style={[
              styles.filterText,
              statusFilter === 'Inactive'
                ? styles.activeFilterText
                : { color: colors.text },
            ]}>
            Inactive
          </Text>
        </Pressable>
      </View>

      <Pressable
        style={[
          styles.sortButton,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}>
        <Text style={[styles.sortText, { color: colors.text }]}>Recently Added</Text>
        <FontAwesome name="angle-down" size={19} color={colors.text} />
      </Pressable>

      <View style={styles.clientList}>
        {filteredClients.map(client => (
          <View
            key={client.email}
            style={[
              styles.clientCard,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}>
            <View
              style={[
                styles.avatar,
                { backgroundColor: client.avatarColor },
              ]}>
              <Text style={[styles.avatarText, { color: client.initialsColor }]}>
                {client.initials}
              </Text>
            </View>

            <View style={styles.clientCopy}>
              <Text style={[styles.clientName, { color: colors.text }]}>
                {client.name}
              </Text>
              <Text style={[styles.clientMeta, { color: colors.muted }]}>
                {client.email}
              </Text>
              <Text style={[styles.clientMeta, { color: colors.muted }]}>
                {client.phone}
              </Text>
            </View>

            <View style={styles.clientSide}>
              <View
                style={[
                  styles.statusBadge,
                  client.status === 'Active'
                    ? styles.activeBadge
                    : styles.inactiveBadge,
                ]}>
                <Text
                  style={[
                    styles.statusText,
                    client.status === 'Active'
                      ? styles.activeStatusText
                      : styles.inactiveStatusText,
                  ]}>
                  {client.status}
                </Text>
              </View>
              <Text style={[styles.addedText, { color: colors.muted }]}>Added on</Text>
              <Text style={[styles.addedDate, { color: colors.muted }]}>
                {client.date}
              </Text>
            </View>
          </View>
        ))}
        {filteredClients.length === 0 ? (
          <View
            style={[
              styles.emptyCard,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              No companies found
            </Text>
            <Text style={[styles.emptyText, { color: colors.muted }]}>
              Try searching by another name, email, or phone number.
            </Text>
          </View>
        ) : null}
      </View>

      <Text style={[styles.companyCount, { color: colors.muted }]}>
        Showing {filteredClients.length} of {clients.length} companies
      </Text>
    </>
  );

  if (isEmbedded) {
    return <View style={styles.embeddedContent}>{content}</View>;
  }

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: safeAreaInsets.top + 22,
            paddingBottom: safeAreaInsets.bottom + 24,
          },
        ]}>
        {content}
      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    paddingHorizontal: 18,
  },
  embeddedContent: {
    marginTop: 28,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  backButton: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerCopy: {
    flex: 1,
  },
  title: {
    color: '#111827',
    fontSize: 20,
    fontWeight: '400',
  },
  subtitle: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 10,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconButton: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBox: {
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    backgroundColor: '#ffffff',
    marginTop: 28,
    paddingHorizontal: 18,
  },
  searchInput: {
    flex: 1,
    color: '#111827',
    fontSize: 14,
    fontWeight: '500',
    paddingVertical: 10,
    marginLeft: 14,
  },
  clearSearchButton: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 22,
  },
  filterChip: {
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    backgroundColor: '#ffffff',
    paddingHorizontal: 18,
    gap: 1,
  },
  activeFilterChip: {
    borderColor: '#bfdbfe',
  },
  activeFilterText: {
    color: '#2563eb',
    fontSize: 12,
    fontWeight: '800',
  },
  filterText: {
    color: '#111827',
    fontSize: 12,
    fontWeight: '600',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#22c55e',
  },
  activeStatusDot: {
    backgroundColor: '#22c55e',
  },
  sortButton: {
    minHeight: 40,
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    backgroundColor: '#ffffff',
    marginTop: 14,
    paddingHorizontal: 18,
  },
  sortText: {
    color: '#111827',
    fontSize: 12,
    fontWeight: '600',
  },
  clientList: {
    gap: 10,
    marginTop: 22,
  },
  companyCount: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'left',
  },
  emptyCard: {
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    backgroundColor: '#ffffff',
    paddingHorizontal: 18,
    paddingVertical: 28,
  },
  emptyTitle: {
    color: '#111827',
    fontSize: 17,
    fontWeight: '500',
  },
  emptyText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    marginTop: 8,
    textAlign: 'center',
  },
  clientCard: {
    minHeight: 104,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    backgroundColor: '#ffffff',
    padding: 6,
  },
  avatar: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 33,
    backgroundColor: '#dbeafe',
    marginRight: 12,
  },
  avatarText: {
    color: '#2563eb',
    fontSize: 21,
    fontWeight: '600',
  },
  clientCopy: {
    flex: 1,
  },
  clientName: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 23,
  },
  clientMeta: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 21,
  },
  clientSide: {
    width: 88,
    alignItems: 'center',
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 11,
    paddingVertical: 4,
    marginBottom: 8,
  },
  activeBadge: {
    backgroundColor: '#dcfce7',
  },
  inactiveBadge: {
    backgroundColor: '#fee2e2',
  },
  statusText: {
    fontSize: 13,
    fontWeight: '900',
  },
  activeStatusText: {
    color: '#059669',
  },
  inactiveStatusText: {
    color: '#b91c1c',
  },
  addedText: {
    color: '#64748b',
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 17,
    textAlign: 'center',
  },
  addedDate: {
    color: '#64748b',
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 17,
    textAlign: 'center',
  },
});

export default ClientScreen;
