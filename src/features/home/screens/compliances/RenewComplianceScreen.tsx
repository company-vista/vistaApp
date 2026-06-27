import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Linking } from "react-native";
import axios from "axios";
import BackButton from "../../../../components/buttons/BackButton";
import { API_BASE_URL } from "../../../../config/api";
import { useAppSelector } from "../../../../store/hooks";

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

interface BreakdownRowProps {
  label: string;
  value: string;
  isTotal?: boolean;
}

const BreakdownRow: React.FC<BreakdownRowProps> = ({ label, value, isTotal = false }) => (
  <View style={[styles.breakdownRow, isTotal && styles.breakdownRowTotal]}>
    <Text style={[styles.breakdownLabel, isTotal && styles.breakdownLabelTotal]}>
      {label}
    </Text>
    <Text style={[styles.breakdownValue, isTotal && styles.breakdownValueTotal]}>
      {value}
    </Text>
  </View>
);

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
};

type RenewComplianceProps = {
  onBackPress: () => void;
  selectedAction?: RenewActionData | null;
};

const RenewCompliance: React.FC<RenewComplianceProps> = ({ onBackPress, selectedAction }) => {
  const authUser = useAppSelector(state => state.auth.user);
  const token = useAppSelector(state => state.auth.token);
  const companyId = selectedAction?.companyId ?? authUser?._id ?? authUser?.id ?? authUser?.company ?? authUser?.companyName ?? authUser?.businessName ?? authUser?.legalName ?? null;
  const [services, setServices] = useState<Service[]>([
    {
      id: 1,
      name: selectedAction?.title ?? "Registered Address",
      lastDate: selectedAction?.date ?? "N/A",
      dueDate: selectedAction?.date ?? "N/A",
      price: selectedAction?.price ?? 0,
      years: selectedAction?.years ?? 0,
      isExpired: (selectedAction?.status ?? "Pending") === "Expired",
      isSelected: false,
    },
  ]);

  useEffect(() => {
    setServices([
      {
        id: 1,
        name: selectedAction?.title ?? "Registered Address",
        lastDate: selectedAction?.date ?? "N/A",
        dueDate: selectedAction?.date ?? "N/A",
        price: selectedAction?.price ?? 0,
        years: selectedAction?.years ?? 0,
        isExpired: (selectedAction?.status ?? "Expired") === "Expired",
        isSelected: false,
      },
    ]);
  }, [selectedAction]);

  const toggleService = (id: number): void => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isSelected: !s.isSelected } : s))
    );
  };

  const deselectAll = (): void => {
    setServices((prev) => prev.map((s) => ({ ...s, isSelected: false })));
  };

  const selectedServices = services.filter((s) => s.isSelected);
  const totalDue = selectedServices.reduce((sum, s) => sum + s.price * s.years, 0);
//   console.log("Selected services:", selectedServices);
  const handlePay = async () => {
    if (selectedServices.length === 0) {
      Alert.alert("Payment", "Please select at least one service to continue.");
      return;
    }

    if (!token) {
      Alert.alert("Payment", "Your session has expired. Please sign in again.");
      return;
    }

    try {
      const payload = {
        companyId: companyId ?? "",
        services: selectedServices.map((service) => ({
          service: service.name.toLowerCase().includes("address") ? "address" : "resident",
          years: service.years,
          base: service.price,
          penalty: 0,
          total: service.price * service.years,
        })),
      };

      const response = await axios.post(
        `${API_BASE_URL}/api/payment/painility/compliance-renewal/create-checkout`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-auth-token": token,
            "Content-Type": "application/json",
          },
        },
      );

      const checkoutUrl = response?.data?.url;
      if (checkoutUrl) {
        await Linking.openURL(checkoutUrl);
      } else {
        Alert.alert("Payment", "Checkout URL not returned by server.");
      }
    } catch (error) {
      console.error("Checkout error", error);
      Alert.alert("Payment", "Unable to start Stripe checkout right now.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <View style={styles.header}>
        <BackButton onPress={onBackPress} />
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>{selectedAction?.title ?? "Renew compliance"}</Text>
          <Text style={styles.headerSubtitle}>
            {selectedAction?.subtitle ?? "Company · 1 renewable service"}
          </Text>
        </View>
        <View style={styles.headerRightPlaceholder} />
      </View>

      {/* Scrollable Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Year Section Header */}
        <View style={styles.yearHeader}>
          <View style={styles.yearLabel}>
            <View style={styles.yearIconBox}>
              <Text style={styles.yearIconText}>📅</Text>
            </View>
            <View>
              <Text style={styles.yearTitle}>{selectedAction?.date ?? "2026"}</Text>
              <Text style={styles.yearSubtitle}>
                {services.length} service available for renewal
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.deselectBtn} onPress={deselectAll}>
            <Text style={styles.deselectBtnText}>Deselect all</Text>
          </TouchableOpacity>
        </View>

        {/* Service Cards */}
        {services.map((service) => (
          <View
            key={service.id}
            style={[
              styles.serviceCard,
              {
                borderColor: service.isSelected ? "#534AB7" : "#e0e0e0",
                borderWidth: service.isSelected ? 1.5 : 0.5,
              },
            ]}
          >
            <View style={styles.cardTop}>
              {/* Checkbox */}
              <TouchableOpacity
                style={[
                  styles.checkbox,
                  {
                    backgroundColor: service.isSelected ? "#534AB7" : "transparent",
                    borderWidth: service.isSelected ? 0 : 1.5,
                    borderColor: "#ccc",
                  },
                ]}
                onPress={() => toggleService(service.id)}
              >
                {service.isSelected && (
                  <Text style={styles.checkboxTick}>✓</Text>
                )}
              </TouchableOpacity>

              {/* Card Icon */}
              <View style={styles.cardIcon}>
                <Text style={styles.cardIconText}>🏠</Text>
              </View>

              {/* Card Info */}
              <View style={styles.cardInfo}>
                <Text style={styles.cardName}>{service.name}</Text>
                {service.isExpired && (
                  <View style={styles.expiredBadge}>
                    <Text style={styles.expiredBadgeText}>⚠ {selectedAction?.status ?? "Expired"}</Text>
                  </View>
                )}
                <Text style={styles.cardDates}>
                  Last: {service.lastDate} ·{" "}
                  <Text style={styles.dueDateText}>Due: {service.dueDate}</Text>
                </Text>
              </View>
            </View>

            <Text style={styles.cardPrice}>${service.isSelected ? service.price.toFixed(2) : '0.00'}</Text>
            <Text style={styles.cardSubLabel}>{selectedAction?.subtitle ?? "1 year from backend"}</Text>

            <View style={styles.breakdown}>
              <BreakdownRow label="Years" value={String(service.isSelected ? service.years : 0)} />
              <BreakdownRow label="Base total" value={`$${service.isSelected ? service.price.toFixed(2) : '0.00'}`} />
              <BreakdownRow
                label="Total"
                value={`$${service.isSelected ? (service.price * service.years).toFixed(2) : '0.00'}`}
                isTotal
              />
            </View>
          </View>
        ))}

        {selectedAction?.details?.length ? (
          <View style={styles.checkoutSection}>
            <Text style={styles.checkoutEyebrow}>SELECTED ACTION</Text>
            <Text style={styles.checkoutTitle}>Details</Text>
            {selectedAction.details.map((detail, index) => (
              <View key={`${detail.label}-${index}`} style={styles.ssItem}>
                <View style={styles.ssItemInfo}>
                  <Text style={styles.ssItemName}>{detail.label}</Text>
                  <Text style={styles.ssItemMeta}>{detail.value}</Text>
                </View>
              </View>
            ))}
          </View>
        ) : null}

        {/* Checkout Section */}
        <View style={styles.checkoutSection}>
          <Text style={styles.checkoutEyebrow}>CHECKOUT</Text>
          <Text style={styles.checkoutTitle}>Stripe payment</Text>
          <Text style={styles.checkoutDesc}>
            Review the services you selected and continue to secure checkout.
          </Text>

          {/* Selected Services */}
          <View style={styles.selectedServices}>
            <View style={styles.ssHeader}>
              <Text style={styles.ssHeaderLabel}>Selected services</Text>
              <View style={styles.ssCount}>
                <Text style={styles.ssCountText}>{selectedServices.length}</Text>
              </View>
            </View>

            {selectedServices.length > 0 ? (
              selectedServices.map((s) => (
                <View key={s.id} style={styles.ssItem}>
                  <View style={styles.ssItemIcon}>
                    <Text style={styles.ssItemIconText}>🏠</Text>
                  </View>
                  <View style={styles.ssItemInfo}>
                    <Text style={styles.ssItemName}>{s.name}</Text>
                    <Text style={styles.ssItemMeta}>2026 · {s.years} year</Text>
                  </View>
                  <View style={styles.ssItemPriceBox}>
                    <Text style={styles.ssItemPrice}>${s.price.toFixed(2)}</Text>
                    <Text style={styles.ssItemBase}>Base ${s.price.toFixed(2)}</Text>
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

          {/* Total Due */}
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

          {/* Pay Button */}
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
  safeArea: {
    flex: 1,
    backgroundColor: "#f4f4f8",
  },
  header: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: "#e8e8e8",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 40,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#1a1a1a",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#6b6b6b",
    marginTop: 1,
  },
  headerRightPlaceholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    gap: 14,
  },
  yearHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  yearLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  yearIconBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
  },
  yearIconText: {
    fontSize: 14,
  },
  yearTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1a1a1a",
  },
  yearSubtitle: {
    fontSize: 11,
    color: "#6b6b6b",
  },
  deselectBtn: {
    backgroundColor: "#EEEDFE",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  deselectBtnText: {
    fontSize: 11,
    fontWeight: "500",
    color: "#534AB7",
  },
  serviceCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderStyle: "solid",
    padding: 14,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  checkboxTick: {
    color: "white",
    fontSize: 12,
  },
  cardIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#EAF3DE",
    alignItems: "center",
    justifyContent: "center",
  },
  cardIconText: {
    fontSize: 16,
  },
  cardInfo: {
    flex: 1,
  },
  cardName: {
    fontSize: 13,
    fontWeight: "500",
    color: "#1a1a1a",
  },
  expiredBadge: {
    backgroundColor: "#FCEBEB",
    borderRadius: 20,
    paddingHorizontal: 7,
    paddingVertical: 2,
    alignSelf: "flex-start",
    marginTop: 3,
  },
  expiredBadgeText: {
    color: "#A32D2D",
    fontSize: 10,
    fontWeight: "500",
  },
  cardDates: {
    fontSize: 11,
    color: "#6b6b6b",
    marginTop: 4,
  },
  dueDateText: {
    color: "#A32D2D",
    fontWeight: "500",
  },
  cardPrice: {
    fontSize: 18,
    fontWeight: "500",
    color: "#534AB7",
    marginTop: 10,
  },
  cardSubLabel: {
    fontSize: 11,
    color: "#6b6b6b",
  },
  breakdown: {
    backgroundColor: "#f6f6f8",
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
    gap: 4,
  },
  breakdownRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  breakdownRowTotal: {
    borderTopWidth: 0.5,
    borderTopColor: "#e0e0e0",
    paddingTop: 6,
    marginTop: 4,
  },
  breakdownLabel: {
    fontSize: 12,
    color: "#6b6b6b",
  },
  breakdownLabelTotal: {
    color: "#1a1a1a",
    fontWeight: "500",
  },
  breakdownValue: {
    fontSize: 12,
    color: "#6b6b6b",
  },
  breakdownValueTotal: {
    color: "#1a1a1a",
    fontWeight: "500",
  },
  checkoutSection: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: "#e8e8e8",
    padding: 14,
  },
  checkoutEyebrow: {
    fontSize: 10,
    fontWeight: "500",
    letterSpacing: 0.6,
    color: "#6b6b6b",
    marginBottom: 4,
  },
  checkoutTitle: {
    fontSize: 17,
    fontWeight: "500",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  checkoutDesc: {
    fontSize: 12,
    color: "#6b6b6b",
    lineHeight: 18,
  },
  selectedServices: {
    backgroundColor: "#f6f6f8",
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  },
  ssHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  ssHeaderLabel: {
    fontSize: 12,
    color: "#6b6b6b",
  },
  ssCount: {
    backgroundColor: "#ffffff",
    borderWidth: 0.5,
    borderColor: "#e0e0e0",
    borderRadius: 9,
    width: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  ssCountText: {
    fontSize: 11,
    fontWeight: "500",
    color: "#1a1a1a",
  },
  ssItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  ssItemIcon: {
    width: 26,
    height: 26,
    backgroundColor: "#EAF3DE",
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
  },
  ssItemIconText: {
    fontSize: 14,
  },
  ssItemInfo: {
    flex: 1,
  },
  ssItemName: {
    fontSize: 12,
    fontWeight: "500",
    color: "#1a1a1a",
  },
  ssItemMeta: {
    fontSize: 11,
    color: "#6b6b6b",
  },
  ssItemPriceBox: {
    alignItems: "flex-end",
  },
  ssItemPrice: {
    fontSize: 13,
    fontWeight: "500",
    color: "#1a1a1a",
  },
  ssItemBase: {
    fontSize: 11,
    color: "#6b6b6b",
  },
  totalDue: {
    backgroundColor: "#F0F0FD",
    borderRadius: 8,
    padding: 14,
    marginTop: 10,
  },
  totalDueRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  totalDueLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  totalDueDollar: {
    color: "#534AB7",
    fontSize: 15,
  },
  totalDueLabelText: {
    fontSize: 13,
    color: "#6b6b6b",
  },
  totalDueAmount: {
    fontSize: 22,
    fontWeight: "500",
    color: "#534AB7",
  },
  totalNote: {
    fontSize: 11,
    color: "#6b6b6b",
    lineHeight: 16,
  },
  payBtn: {
    backgroundColor: "#534AB7",
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  payBtnDisabled: {
    backgroundColor: "#c9c6df",
    opacity: 0.8,
  },
  payBtnText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
  secureNote: {
    textAlign: "center",
    fontSize: 11,
    color: "#6b6b6b",
    marginTop: 8,
  },
});

export default RenewCompliance;
