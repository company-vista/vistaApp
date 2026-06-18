import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { useThemeColors, type AppTheme } from '../../../../theme/colors';

type Shareholder = {
  email: string;
  id: string;
  name: string;
  percentage: number;
  phone: string;
  role: string;
  shares: number;
};

type ShareHoldersProps = {
  companyId: string;
};

const mockShareholders: Shareholder[] = [
  {
    email: 'gautamrajexampent@gmail.com',
    id: '1',
    name: 'Gautam Sharma',
    percentage: 0,
    phone: '6254199691',
    role: 'Shareholder',
    shares: 0,
  },
  {
    email: 'shareholder@example.com',
    id: '2',
    name: 'Unnamed Shareholder',
    percentage: 0,
    phone: '9876543210',
    role: 'Shareholder',
    shares: 0,
  },
];

function getShareholderPalette(colors: AppTheme) {
  const isDark = colors.mode === 'dark';

  return {
    cardShadow: isDark ? '#000000' : colors.shadow,
    icon: isDark ? '#85B7EB' : '#155EAB',
    infoText: isDark ? '#CBD5E1' : '#164066',
    roleBackground: isDark ? 'rgba(133,183,235,0.14)' : '#E7F1FF',
    roleBorder: isDark ? 'rgba(133,183,235,0.28)' : '#C7DFF6',
    roleText: isDark ? '#85B7EB' : '#155EAB',
    sectionIcon: isDark ? '#85B7EB' : '#155EAB',
  };
}

const ShareHolders: React.FC<ShareHoldersProps> = ({ companyId: _companyId }) => {
  const colors = useThemeColors();
  const palette = getShareholderPalette(colors);
  const data = mockShareholders;
  const totalStake = data.reduce((sum, shareholder) => sum + shareholder.percentage, 0);

  return (
    <View style={styles.container}>
      <View style={styles.summaryCard}>
        <View style={styles.summaryDeco} />
        <View style={styles.summaryDecoSmall}>
          <FontAwesome name="users" size={19} color="rgba(255,255,255,0.25)" />
        </View>
        <Text style={styles.summaryLabel}>Total Equity Stake</Text>
        <Text style={styles.summaryValue}>{totalStake}%</Text>
        <View style={styles.primaryBadge}>
          <FontAwesome name="user" size={9} color="#85B7EB" />
          <Text style={styles.primaryBadgeText}>Primary Shareholder</Text>
        </View>
      </View>

      <View style={styles.sectionTitleRow}>
        <FontAwesome name="users" size={16} color={palette.sectionIcon} />
        <Text style={[styles.header, { color: colors.text }]}>Shareholders</Text>
      </View>

      <View style={styles.list}>
        {data.map(shareholder => (
          <View
            key={shareholder.id}
            style={[
              styles.shareholderCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                shadowColor: palette.cardShadow,
              },
            ]}>
            <Text style={[styles.name, { color: colors.text }]}>{shareholder.name}</Text>
            <View
              style={[
                styles.roleBadge,
                { backgroundColor: palette.roleBackground, borderColor: palette.roleBorder },
              ]}>
              <Text style={[styles.roleText, { color: palette.roleText }]}>
                {shareholder.role}
              </Text>
            </View>

            <InfoRow
              icon="percent"
              iconColor={palette.icon}
              text={`Share Percentage: ${shareholder.percentage}%`}
              textColor={palette.infoText}
            />
            <InfoRow
              icon="envelope-o"
              iconColor={palette.icon}
              text={shareholder.email}
              textColor={palette.infoText}
            />
            <InfoRow
              icon="phone"
              iconColor={palette.icon}
              text={shareholder.phone}
              textColor={palette.infoText}
            />
          </View>
        ))}
      </View>
    </View>
  );
};

function InfoRow({
  icon,
  iconColor,
  text,
  textColor,
}: {
  icon: string;
  iconColor: string;
  text: string;
  textColor: string;
}) {
  return (
    <View style={styles.infoRow}>
      <FontAwesome name={icon} size={12} color={iconColor} style={styles.infoIcon} />
      <Text style={[styles.infoText, { color: textColor }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 14,
    marginBottom: 18,
    paddingHorizontal: 6,
  },
  summaryCard: {
    backgroundColor: '#0D2137',
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 16,
    borderWidth: 1,
    elevation: 4,
    minHeight: 108,
    overflow: 'hidden',
    paddingHorizontal: 18,
    paddingVertical: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
  },
  summaryDeco: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderColor: 'rgba(255,255,255,0.07)',
    borderRadius: 50,
    borderWidth: 1,
    bottom: -22,
    height: 100,
    position: 'absolute',
    right: -18,
    width: 100,
  },
  summaryDecoSmall: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 28,
    borderWidth: 1,
    bottom: 18,
    height: 55,
    justifyContent: 'center',
    position: 'absolute',
    right: 20,
    width: 55,
  },
  summaryLabel: {
    color: '#85B7EB',
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.7,
    lineHeight: 15,
    textTransform: 'uppercase',
  },
  summaryValue: {
    color: '#FFFFFF',
    fontSize: 25,
    fontWeight: '800',
    lineHeight: 32,
    marginTop: 6,
  },
  primaryBadge: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 5,
    marginTop: 8,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  primaryBadgeText: {
    color: '#85B7EB',
    fontSize: 10,
    fontWeight: '500',
    lineHeight: 13,
  },
  sectionTitleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 7,
    marginTop: 2,
  },
  header: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 21,
  },
  list: {
    gap: 12,
  },
  shareholderCard: {
    borderRadius: 8,
    borderWidth: 1,
    elevation: 1,
    paddingHorizontal: 15,
    paddingVertical: 15,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    borderRadius: 7,
    borderWidth: 1,
    marginBottom: 14,
    marginTop: 6,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  roleText: {
    fontSize: 10,
    fontWeight: '800',
    lineHeight: 13,
  },
  infoRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 7,
  },
  infoIcon: {
    width: 16,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 16,
  },
});

export default ShareHolders;
