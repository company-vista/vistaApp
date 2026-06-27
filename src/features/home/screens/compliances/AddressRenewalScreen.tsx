import React, { useEffect, useState } from 'react';
import {
  Alert,
  Linking,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import axios from 'axios';
import BackButton from '../../../../components/buttons/BackButton';
import { API_BASE_URL } from '../../../../config/api';
import { useAppSelector } from '../../../../store/hooks';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

interface Service {
  id: number;
  name: string;
  lastDate: string;
  dueDate: string;
  price: number;
  years: number;
  isExpired: boolean;
  isSelected: boolean;
}

interface RenewalServiceInput {
  id?: number | string | null;
  name?: string | null;
  lastDate?: string | null;
  dueDate?: string | null;
  price?: number | null;
  years?: number | null;
  isExpired?: boolean | null;
}

interface BreakdownRowProps {
  label: string;
  value: string;
  isTotal?: boolean;
}

type RenewActionData = {
  id: 'address' | 'annual_filing' | 'resident' | 'federal_filing';
  title: string;
  subtitle: string;
  status: string;
  date: string;
  details: { label: string; value: string; icon?: string }[];
  companyId?: string | null;
  price?: number;
  years?: number;
  services?: RenewalServiceInput[] | null;
};

type AddressRenewalScreenProps = {
  onBackPress: () => void;
  selectedAction?: RenewActionData | null;
};

const getIconName = (icon?: string): string => {
  const normalized = (icon ?? '').toLowerCase().trim();
  const iconMap: Record<string, string> = {
    user: 'user',
    info: 'info-circle',
    email: 'envelope',
    envelope: 'envelope',
    phone: 'phone',
    calendar: 'calendar',
    history: 'history',
    'map-marker': 'map-marker',
    'map-pin': 'map-pin',
    map: 'map',
    globe: 'globe',
    'clock-o': 'clock-o',
    'exclamation-circle': 'exclamation-circle',
    address: 'home',
    home: 'home',
    check: 'check',
    'check-circle': 'check-circle',
    file: 'file',
    'file-text': 'file-text',
    building: 'building',
    briefcase: 'briefcase',
  };

  return iconMap[normalized] ?? iconMap[normalized.replace(/[-_]/g, '')] ?? 'info-circle';
};

const BreakdownRow: React.FC<BreakdownRowProps> = ({ label, value, isTotal = false }) => (
  <View style={[styles.breakdownRow, isTotal && styles.breakdownRowTotal]}>
    <Text style={[styles.breakdownLabel, isTotal && styles.breakdownLabelTotal]}>{label}</Text>
    <Text style={[styles.breakdownValue, isTotal && styles.breakdownValueTotal]}>{value}</Text>
  </View>
);

const buildAddressServices = (apiData: any, action?: RenewActionData | null): Service[] => {
  const breakdown = Array.isArray(apiData?.breakdown) ? apiData.breakdown : [];

  if (breakdown.length > 0) {
    return breakdown.map((item: any, index: number) => ({
      id: index + 1,
      name: item?.service ? item.service.charAt(0).toUpperCase() + item.service.slice(1) : action?.title ?? 'Renewal Service',
      lastDate: action?.date ?? 'N/A',
      dueDate: action?.date ?? 'N/A',
      price: Number(item?.base ?? item?.total ?? 0),
      years: Number(item?.years ?? 1),
      isExpired: (action?.status ?? '').toLowerCase() === 'expired',
      isSelected: false,
    }));
  }

  const addressData = apiData?.data?.Address ?? apiData?.Address ?? null;
  const normalizedStatus = String(addressData?.status ?? action?.status ?? 'Pending').toLowerCase();
  const dueDate = addressData?.dueDate ?? action?.date ?? 'N/A';
  const lastDate = addressData?.lastDate ?? 'N/A';
  const price = Number(action?.price ?? 99) || 99;
  const years = Number(action?.years ?? 1) || 1;

  return [
    {
      id: 1,
      name: action?.title ?? 'Registered Address',
      lastDate,
      dueDate,
      price,
      years,
      isExpired: normalizedStatus === 'expired' || normalizedStatus === 'overdue',
      isSelected: false,
    },
  ];
};

const AddressRenewalScreen: React.FC<AddressRenewalScreenProps> = ({ onBackPress, selectedAction }) => {
  const authUser = useAppSelector(state => state.auth.user);
  const token = useAppSelector(state => state.auth.token);
  const resolvedCompanyId = selectedAction?.companyId ?? authUser?._id ?? authUser?.id ?? authUser?.company ?? authUser?.companyName ?? authUser?.businessName ?? authUser?.legalName ?? null;
  const [services, setServices] = useState<Service[]>(() => buildAddressServices(null, selectedAction));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRenewalData = async () => {
      if (!token || !resolvedCompanyId) {
        setServices(buildAddressServices(null, selectedAction));
        return;
      }

      setLoading(true);
      try {
        const response = await axios.post(
          `${API_BASE_URL}/api/payment/painility/compliance-renewal/create-checkout`,
          {
            companyId: resolvedCompanyId,
            services: ['address', 'resident'],
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'x-auth-token': token,
              'Content-Type': 'application/json',
            },
          },
        );

        setServices(buildAddressServices(response?.data, selectedAction));
      } catch (error) {
        console.error('Error fetching renewal data:', error);
        setServices(buildAddressServices(null, selectedAction));
      } finally {
        setLoading(false);
      }
    };

    fetchRenewalData();
  }, [resolvedCompanyId, selectedAction?.date, selectedAction?.price, selectedAction?.status, selectedAction?.title, selectedAction?.years, token]);

  const toggleService = (id: number): void => {
    setServices(prev => prev.map(service => (service.id === id ? { ...service, isSelected: !service.isSelected } : service)));
  };

  const deselectAll = (): void => {
    setServices(prev => prev.map(service => ({ ...service, isSelected: false })));
  };

  const selectedServices = services.filter(service => service.isSelected);
  const totalDue = selectedServices.reduce((sum, service) => sum + service.price * service.years, 0);

  // ============== Payment Handling Function ==============
  const handlePay = async () => {
    if (selectedServices.length === 0) {
      Alert.alert('Payment', 'Please select at least one service to continue.');
      return;
    }

    if (!token) {
      Alert.alert('Payment', 'Your session has expired. Please sign in again.');
      return;
    }

    try {
      const payload = {
        companyId: resolvedCompanyId ?? '',
        services: selectedServices.map(service => {
          const normalizedName = service.name.toLowerCase();
          if (normalizedName.includes('address')) {
            return 'address';
          }
          if (normalizedName.includes('resident')) {
            return 'resident';
          }
          return 'address';
        }),
      };

      const response = await axios.post(
        `${API_BASE_URL}/api/payment/painility/compliance-renewal/create-checkout`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'x-auth-token': token,
            'Content-Type': 'application/json',
          },
        },
      );
      console.log(response);
      const checkoutUrl = response?.data?.url;
      console.log(checkoutUrl);
      if (checkoutUrl) {
        await Linking.openURL(checkoutUrl);
      } else {
        Alert.alert('Payment', 'Checkout URL not returned by server.');
      }
    } catch (error: any) {
      console.error('Checkout error', error);
      const status = error?.response?.status;
      const message = error?.response?.data?.message || 'Unable to start Stripe checkout right now.';
      Alert.alert('Payment', status ? `${message} (Status ${status})` : message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <View style={styles.header}>
        <BackButton onPress={onBackPress} />
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>{selectedAction?.title ?? 'Address Renewal'}</Text>
          <Text style={styles.headerSubtitle}>{selectedAction?.subtitle ?? 'Company · 1 renewable service'}</Text>
        </View>
        <View style={styles.headerRightPlaceholder} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.yearHeader}>
          <View style={styles.yearLabel}>
            <View style={styles.yearIconBox}>
              <Text style={styles.yearIconText}>📅</Text>
            </View>
            <View>
              <Text style={styles.yearTitle}>{selectedAction?.date ?? '2026'}</Text>
              <Text style={styles.yearSubtitle}>{services.length} service available for renewal</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.deselectBtn} onPress={deselectAll}>
            <Text style={styles.deselectBtnText}>Deselect all</Text>
          </TouchableOpacity>
        </View>

        {loading && services.length === 0 ? (
          <View style={styles.checkoutSection}>
            <Text style={styles.checkoutTitle}>Loading renewal options...</Text>
            <Text style={styles.checkoutDesc}>Fetching the latest company compliance details.</Text>
          </View>
        ) : (
          services.map(service => (
            <View
              key={service.id}
              style={[
                styles.serviceCard,
                {
                  borderColor: service.isSelected ? '#534AB7' : '#e0e0e0',
                  borderWidth: service.isSelected ? 1.5 : 0.5,
                },
              ]}
            >
            <View style={styles.cardTop}>
              <TouchableOpacity
                style={[
                  styles.checkbox,
                  {
                    backgroundColor: service.isSelected ? '#534AB7' : 'transparent',
                    borderWidth: service.isSelected ? 0 : 1.5,
                    borderColor: '#ccc',
                  },
                ]}
                onPress={() => toggleService(service.id)}
              >
                {service.isSelected && <Text style={styles.checkboxTick}>✓</Text>}
              </TouchableOpacity>

              <View style={styles.cardIcon}>
                <FontAwesome
                  name={service.name.toLowerCase().includes('address') ? 'home' : 'file-text-o'}
                  size={18}
                  color="#534AB7"
                />
              </View>

              <View style={styles.cardInfo}>
                <Text style={styles.cardName}>{service.name}</Text>
                {service.isExpired && (
                  <View style={styles.expiredBadge}>
                    <Text style={styles.expiredBadgeText}>⚠ {selectedAction?.status ?? 'Expired'}</Text>
                  </View>
                )}
                <Text style={styles.cardDates}>
                  Last: {service.lastDate} · <Text style={styles.dueDateText}>Due: {service.dueDate}</Text>
                </Text>
              </View>
            </View>

            <Text style={styles.cardPrice}>${service.isSelected ? service.price.toFixed(2) : '0.00'}</Text>
            <Text style={styles.cardSubLabel}>{selectedAction?.subtitle ?? '1 year from backend'}</Text>

            <View style={styles.breakdown}>
              <BreakdownRow label="Years" value={String(service.isSelected ? service.years : 0)} />
              <BreakdownRow label="Base total" value={`$${service.isSelected ? service.price.toFixed(2) : '0.00'}`} />
              <BreakdownRow label="Total" value={`$${service.isSelected ? (service.price * service.years).toFixed(2) : '0.00'}`} isTotal />
            </View>
          </View>
          ))
        )}

        {selectedAction?.details?.length ? (
          <View style={styles.checkoutSection}>
            <Text style={styles.checkoutEyebrow}>SELECTED ACTION</Text>
            <Text style={styles.checkoutTitle}>Details</Text>
            <View style={styles.detailList}>
              {selectedAction.details.map((detail, index) => (
                <View key={`${detail.label}-${index}`} style={styles.detailCard}>
                  <View style={styles.detailIconBox}>
                    <FontAwesome name={getIconName(detail.icon)} size={16} color="#534AB7" />
                  </View>
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>{detail.label}</Text>
                    <Text style={styles.detailValue}>{detail.value}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        <View style={styles.checkoutSection}>
          <Text style={styles.checkoutEyebrow}>CHECKOUT</Text>
          <Text style={styles.checkoutTitle}>Stripe payment</Text>
          <Text style={styles.checkoutDesc}>Review the services you selected and continue to secure checkout.</Text>

          <View style={styles.selectedServices}>
            <View style={styles.ssHeader}>
              <Text style={styles.ssHeaderLabel}>Selected services</Text>
              <View style={styles.ssCount}>
                <Text style={styles.ssCountText}>{selectedServices.length}</Text>
              </View>
            </View>

            {selectedServices.length > 0 ? (
              selectedServices.map(service => (
                <View key={service.id} style={styles.ssItem}>
                  <View style={styles.ssItemIcon}>
                    <Text style={styles.ssItemIconText}>🏠</Text>
                  </View>
                  <View style={styles.ssItemInfo}>
                    <Text style={styles.ssItemName}>{service.name}</Text>
                    <Text style={styles.ssItemMeta}>2026 · {service.years} year</Text>
                  </View>
                  <View style={styles.ssItemPriceBox}>
                    <Text style={styles.ssItemPrice}>${service.price.toFixed(2)}</Text>
                    <Text style={styles.ssItemBase}>Base ${service.price.toFixed(2)}</Text>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.ssItem}>
                <View style={styles.ssItemInfo}>
                  <Text style={styles.ssItemName}>No service selected</Text>
                  <Text style={styles.ssItemMeta}>Select a service to see its amount</Text>
                </View>
              </View>
            )}
          </View>

          <View style={styles.totalDue}>
            <View style={styles.totalDueRow}>
              <View style={styles.totalDueLabel}>
                <Text style={styles.totalDueDollar}>$</Text>
                <Text style={styles.totalDueLabelText}>Total due</Text>
              </View>
              <Text style={styles.totalDueAmount}>${totalDue.toFixed(2)}</Text>
            </View>
            <Text style={styles.totalNote}>
              {selectedServices.length > 0
                ? 'Selected services will be charged through Stripe checkout.'
                : 'No service selected. Amount will remain $0.00 until you choose one.'}
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.payBtn, selectedServices.length === 0 && styles.payBtnDisabled]}
            onPress={handlePay}
            activeOpacity={0.85}
            disabled={selectedServices.length === 0}
          >
            <Text style={styles.payBtnText}>🔒  Pay ${totalDue.toFixed(2)} with Stripe  →</Text>
          </TouchableOpacity>

          <Text style={styles.secureNote}>Secured by Stripe · Card and wallet checkout</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f4f4f8' },
  header: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e8e8e8',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 40,
  },
  headerText: { flex: 1 },
  headerTitle: { fontSize: 15, fontWeight: '500', color: '#1a1a1a' },
  headerSubtitle: { fontSize: 12, color: '#6b6b6b', marginTop: 1 },
  headerRightPlaceholder: { width: 40 },
  content: { flex: 1 },
  contentContainer: { padding: 16, gap: 14 },
  yearHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  yearLabel: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  yearIconBox: { width: 28, height: 28, borderRadius: 8, backgroundColor: '#f0f0f0', alignItems: 'center', justifyContent: 'center' },
  yearIconText: { fontSize: 14 },
  yearTitle: { fontSize: 14, fontWeight: '500', color: '#1a1a1a' },
  yearSubtitle: { fontSize: 11, color: '#6b6b6b' },
  deselectBtn: { backgroundColor: '#EEEDFE', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 },
  deselectBtnText: { fontSize: 11, fontWeight: '500', color: '#534AB7' },
  serviceCard: { backgroundColor: '#ffffff', borderRadius: 12, borderStyle: 'solid', padding: 14 },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  checkbox: { width: 20, height: 20, borderRadius: 6, alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  checkboxTick: { color: 'white', fontSize: 12 },
  cardIcon: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#EAF3DE', alignItems: 'center', justifyContent: 'center' },
  cardIconText: { fontSize: 16 },
  cardInfo: { flex: 1 },
  cardName: { fontSize: 13, fontWeight: '500', color: '#1a1a1a' },
  expiredBadge: { backgroundColor: '#FCEBEB', borderRadius: 20, paddingHorizontal: 7, paddingVertical: 2, alignSelf: 'flex-start', marginTop: 3 },
  expiredBadgeText: { color: '#A32D2D', fontSize: 10, fontWeight: '500' },
  cardDates: { fontSize: 11, color: '#6b6b6b', marginTop: 4 },
  dueDateText: { color: '#A32D2D', fontWeight: '500' },
  cardPrice: { fontSize: 18, fontWeight: '500', color: '#534AB7', marginTop: 10 },
  cardSubLabel: { fontSize: 11, color: '#6b6b6b' },
  breakdown: { backgroundColor: '#f6f6f8', borderRadius: 8, padding: 12, marginTop: 10, gap: 4 },
  breakdownRow: { flexDirection: 'row', justifyContent: 'space-between' },
  breakdownRowTotal: { borderTopWidth: 0.5, borderTopColor: '#e0e0e0', paddingTop: 6, marginTop: 4 },
  breakdownLabel: { fontSize: 12, color: '#6b6b6b' },
  breakdownLabelTotal: { fontSize: 12, color: '#1a1a1a', fontWeight: '600' },
  breakdownValue: { fontSize: 12, color: '#1a1a1a' },
  breakdownValueTotal: { fontSize: 12, color: '#1a1a1a', fontWeight: '600' },
  checkoutSection: { backgroundColor: '#ffffff', borderRadius: 12, padding: 14, gap: 10 },
  detailList: { gap: 8 },
  detailCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f7f7f9',
    borderRadius: 10,
    padding: 10,
    gap: 10,
  },
  detailIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#EEEDFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailIconText: {
    fontSize: 14,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6b6b6b',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 13,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  checkoutEyebrow: { fontSize: 11, color: '#6b6b6b', fontWeight: '600', letterSpacing: 0.8 },
  checkoutTitle: { fontSize: 16, fontWeight: '600', color: '#1a1a1a' },
  checkoutDesc: { fontSize: 12, color: '#6b6b6b' },
  selectedServices: { backgroundColor: '#f7f7f9', borderRadius: 10, padding: 10, gap: 8 },
  ssHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  ssHeaderLabel: { fontSize: 12, color: '#1a1a1a', fontWeight: '500' },
  ssCount: { backgroundColor: '#534AB7', borderRadius: 999, width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  ssCountText: { color: '#ffffff', fontSize: 12, fontWeight: '600' },
  ssItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#ffffff', borderRadius: 8, padding: 10 },
  ssItemIcon: { width: 30, height: 30, borderRadius: 8, backgroundColor: '#EAF3DE', alignItems: 'center', justifyContent: 'center' },
  ssItemIconText: { fontSize: 14 },
  ssItemInfo: { flex: 1, marginLeft: 8 },
  ssItemName: { fontSize: 12, color: '#1a1a1a', fontWeight: '500' },
  ssItemMeta: { fontSize: 11, color: '#6b6b6b', marginTop: 2 },
  ssItemPriceBox: { alignItems: 'flex-end' },
  ssItemPrice: { fontSize: 12, color: '#1a1a1a', fontWeight: '600' },
  ssItemBase: { fontSize: 10, color: '#6b6b6b', marginTop: 2 },
  totalDue: { backgroundColor: '#f7f7f9', borderRadius: 10, padding: 12, gap: 6 },
  totalDueRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalDueLabel: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  totalDueDollar: { fontSize: 14, color: '#1a1a1a', fontWeight: '600' },
  totalDueLabelText: { fontSize: 13, color: '#1a1a1a', fontWeight: '600' },
  totalDueAmount: { fontSize: 16, color: '#534AB7', fontWeight: '700' },
  totalNote: { fontSize: 11, color: '#6b6b6b' },
  payBtn: { backgroundColor: '#534AB7', borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  payBtnDisabled: { backgroundColor: '#d8d4f3' },
  payBtnText: { color: '#ffffff', fontSize: 14, fontWeight: '700' },
  secureNote: { fontSize: 11, color: '#6b6b6b', textAlign: 'center' },
});

export default AddressRenewalScreen;
