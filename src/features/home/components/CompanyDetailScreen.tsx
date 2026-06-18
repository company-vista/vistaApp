import React, { useState } from 'react';
import {
  Text,
  View,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { styles } from "./CompanyDetailScreenStyle"
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useThemeColors } from '../../../theme/colors';
import BackButton from '../../../components/buttons/BackButton';
import type { CompanyCardItem } from '../screens/quickAccess/CompanyCard';
import CompanyInfo from './companyInformationSection/CompanyInfo';
import ShareHolders from './companyInformationSection/ShareHolders';

type CompanyDetailScreenProps = {
  activeSection?: CompanyDetailSection;
  onBackPress?: () => void;
  onSectionPress?: (section: CompanyDetailSection) => void;
  selectedCompany: CompanyCardItem | null;
};

export type CompanyDetailSection = 'companyInfo' | 'shareholders';
type Section = CompanyDetailSection | null;

type MenuItem = {
  id: Section;
  label: string;
  icon: string;
  iconBg: string;
  iconColor: string;
};

const menuItems: MenuItem[] = [
  { id: 'companyInfo', label: 'Company Information', icon: 'building', iconBg: '#EEF2FF', iconColor: '#4F46E5' },
  { id: 'shareholders', label: 'Shareholders', icon: 'users', iconBg: '#F0FDF4', iconColor: '#16A34A' },
];

const CompanyDetailScreen: React.FC<CompanyDetailScreenProps> = ({
  activeSection: controlledActiveSection,
  onBackPress,
  onSectionPress,
  selectedCompany,
}) => {
  const colors = useThemeColors();
  const companyData = selectedCompany;
  const [localActiveSection, setLocalActiveSection] = useState<Section>(null);
  const activeSection = controlledActiveSection ?? localActiveSection;
  const isControlledSection = controlledActiveSection !== undefined;

  function handleBackPress() {
    if (isControlledSection) {
      onBackPress?.();
      return;
    }

    setLocalActiveSection(null);
  }

  function handleSectionPress(section: CompanyDetailSection) {
    if (onSectionPress) {
      onSectionPress(section);
      return;
    }

    setLocalActiveSection(section);
  }

  /* ── empty state ─────────────────────────────────────────────── */
  if (!companyData) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar
          barStyle={colors.mode === 'dark' ? 'light-content' : 'dark-content'}
          backgroundColor={colors.background}
        />
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Company Details</Text>
        </View>
        <View style={styles.emptyState}>
          <Text style={[styles.emptyText, { color: colors.muted }]}>No company selected</Text>
        </View>
      </SafeAreaView>
    );
  }

  const statusColor =
    companyData.status === 'Active'
      ? { bg: '#E6F4EA', text: '#137333', dot: '#1E8E3E' }
      : { bg: '#FCE8E6', text: '#C5221F', dot: '#D93025' };

  /* ── sub-section view ────────────────────────────────────────── */
  const renderSection = () => {
    switch (activeSection) {
      case 'companyInfo':
        return <CompanyInfo companyData={companyData} />;
      case 'shareholders':
        return <ShareHolders companyId={companyData.id} />;

      default:
        return null;
    }
  };

  /* ── main render ─────────────────────────────────────────────── */
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={colors.mode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      {/* ── HEADER ─────────────────────────────────────────── */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        {/* Left: back btn only (sub-section) OR title (main screen) */}
        <View style={styles.headerLeft}>
          {activeSection ? (
            <BackButton onPress={handleBackPress} />
          ) : (
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              Company Info
            </Text>
          )}
        </View>

        <TouchableOpacity activeOpacity={0.7} style={styles.editBtn}>
          <Text style={[styles.requestChangesText, { color: colors.primary }]}>
            {activeSection ? 'Edit' : 'Request Changes'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* ── HERO CARD ─────────────────────────────────────── */}
        <View style={[styles.heroCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {/* Avatar */}
          <View style={[styles.avatarCircle, { backgroundColor: '#E0E7FF' }]}>
            <Text style={styles.avatarText}>
              {companyData.initials ?? companyData.name.slice(0, 2).toUpperCase()}
            </Text>
          </View>

          {/* Name + Status */}
          <View style={styles.heroInfo}>
            <Text style={[styles.heroName, { color: colors.text }]} numberOfLines={1}>
              {companyData.name}
            </Text>
            <Text style={[styles.heroMeta, { color: colors.muted }]}>
              {companyData.companyType} · EIN {companyData.ein}
            </Text>
          </View>

          <View style={[styles.statusBadge, { backgroundColor: statusColor.bg }]}>
            <View style={[styles.statusDot, { backgroundColor: statusColor.dot }]} />
            <Text style={[styles.statusText, { color: statusColor.text }]}>{companyData.status}</Text>
          </View>
        </View>

        {/* ── SECTION CONTENT (when a row is selected) ────── */}
        {activeSection ? (
          <View style={styles.sectionContent}>{renderSection()}</View>
        ) : (
          /* ── SETTINGS-STYLE MENU LIST ───────────────────── */
          <View style={[styles.menuCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            {menuItems.map((item, index) => (
              <View key={item.id}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => item.id && handleSectionPress(item.id)}
                  style={styles.menuRow}>
                  {/* Icon bubble */}
                  <View style={[styles.iconBubble, { backgroundColor: item.iconBg }]}>
                    <FontAwesome name={item.icon} size={15} color={item.iconColor} />
                  </View>

                  {/* Label */}
                  <Text style={[styles.menuLabel, { color: colors.text }]}>{item.label}</Text>

                  {/* Chevron */}
                  <FontAwesome name="angle-right" size={18} color={colors.muted} />
                </TouchableOpacity>

                {/* Divider (skip after last item) */}
                {index < menuItems.length - 1 && (
                  <View style={[styles.divider, { backgroundColor: colors.border }]} />
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default CompanyDetailScreen;
