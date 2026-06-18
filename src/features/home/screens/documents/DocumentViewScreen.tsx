import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { useThemeColors, type AppTheme } from '../../../../theme/colors';
import type { DocumentItem } from '../../api/clientDocumentApi';
import BackButton from '../../../../components/buttons/BackButton';

const HOME_HERO_COLORS = {
  panel: '#0D2137',
  accentBlue: '#85B7EB',
  accentYellow: '#FAC775',
  accentPink: '#F09595',
};

function getDocumentPalette(colors: AppTheme) {
  const isDark = colors.mode === 'dark';

  return {
    primaryText: isDark ? colors.text : HOME_HERO_COLORS.panel,
    accentText: isDark ? HOME_HERO_COLORS.accentBlue : '#2F6FAE',
    panelButton: isDark ? '#183A5C' : HOME_HERO_COLORS.panel,
    panelButtonBorder: isDark ? 'rgba(133,183,235,0.35)' : '#C7DFF6',
    iconSurface: isDark ? 'rgba(133,183,235,0.14)' : '#EAF4FF',
    iconColor: isDark ? HOME_HERO_COLORS.accentBlue : HOME_HERO_COLORS.panel,
    statusActive: isDark ? HOME_HERO_COLORS.accentYellow : '#9A640F',
    statusWarning: HOME_HERO_COLORS.accentPink,
  };
}

type DocumentViewScreenProps = {
  document: DocumentItem;
  onBackPress: () => void;
};

function DocumentViewScreen({ document: doc, onBackPress }: DocumentViewScreenProps) {
  const colors = useThemeColors();
  const palette = getDocumentPalette(colors);

  const uploadedDate = doc.uploadedAt
    ? new Date(doc.uploadedAt).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : 'N/A';

  const createdDate = doc.createdAt
    ? new Date(doc.createdAt).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : 'N/A';

  const fileSizeText = doc.fileSize
    ? doc.fileSize > 1024 * 1024
      ? `${(doc.fileSize / (1024 * 1024)).toFixed(2)} MB`
      : `${(doc.fileSize / 1024).toFixed(1)} KB`
    : 'N/A';

  const statusColor =
    doc.status === 'active' || doc.status === 'Active'
      ? { bg: palette.panelButton, text: palette.statusActive, dot: palette.statusActive }
      : { bg: palette.panelButton, text: palette.statusWarning, dot: palette.statusWarning };

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={colors.mode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border, backgroundColor: colors.background }]}>
        <BackButton onPress={onBackPress} />
        <Text style={[styles.headerTitle, { color: palette.primaryText }]}>Document Details</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* Hero card */}
        <View style={[styles.heroCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={[styles.heroIcon, { backgroundColor: palette.iconSurface, borderColor: palette.panelButtonBorder }]}>
            <FontAwesome name="file-text-o" size={30} color={palette.iconColor} />
          </View>
          <Text style={[styles.heroFileName, { color: palette.primaryText }]} numberOfLines={2}>
            {doc.originalFileName ?? doc.fileName ?? 'Document'}
          </Text>
          <Text style={[styles.heroCompany, { color: palette.accentText }]}>
            {doc.companyName ?? '—'}
          </Text>

          {doc.status ? (
            <View style={[styles.statusBadge, { backgroundColor: statusColor.bg }]}>
              <View style={[styles.statusDot, { backgroundColor: statusColor.dot }]} />
              <Text style={[styles.statusBadgeText, { color: statusColor.text }]}>
                {doc.status}
              </Text>
            </View>
          ) : null}
        </View>

        {/* Document Info */}
        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: palette.primaryText }]}>Document Information</Text>

          <InfoRow label="Document Type" value={doc.documentType ?? '—'} palette={palette} />
          <Divider color={colors.border} />
          <InfoRow label="File Name" value={doc.originalFileName ?? doc.fileName ?? '—'} palette={palette} />
          <Divider color={colors.border} />
          <InfoRow label="File Size" value={fileSizeText} palette={palette} />
          <Divider color={colors.border} />
          <InfoRow label="MIME Type" value={doc.mimeType ?? '—'} palette={palette} />
          <Divider color={colors.border} />
          <InfoRow label="Source Group" value={doc.sourceGroup ?? '—'} palette={palette} />
        </View>

        {/* Upload Info */}
        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: palette.primaryText }]}>Upload Information</Text>

          <InfoRow label="Uploaded By" value={doc.uploadedBy ?? '—'} palette={palette} />
          <Divider color={colors.border} />
          <InfoRow label="Uploaded At" value={uploadedDate} palette={palette} />
          <Divider color={colors.border} />
          <InfoRow label="Created At" value={createdDate} palette={palette} />
          <Divider color={colors.border} />
          <InfoRow label="Country" value={doc.country ?? '—'} palette={palette} />
        </View>

        {/* Company Info */}
        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: palette.primaryText }]}>Company Information</Text>
          <InfoRow label="Company Name" value={doc.companyName ?? '—'} palette={palette} />
          <Divider color={colors.border} />
          <InfoRow label="Company ID" value={doc.companyId ?? '—'} palette={palette} />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

/* ─── Helper Components ─── */

type InfoRowProps = {
  label: string;
  value: string;
  palette: ReturnType<typeof getDocumentPalette>;
};

function InfoRow({ label, value, palette }: InfoRowProps) {
  return (
    <View style={styles.infoRow}>
      <Text style={[styles.infoLabel, { color: palette.accentText }]}>{label.toUpperCase()}</Text>
      <Text style={[styles.infoValue, { color: palette.primaryText }]}>{value}</Text>
    </View>
  );
}

function Divider({ color }: { color: string }) {
  return <View style={[styles.divider, { backgroundColor: color }]} />;
}

/* ─── Styles ─── */

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },

  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 14,
  },
  heroCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    alignItems: 'center',
    gap: 8,
  },
  heroIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    borderWidth: 1,
  },
  heroFileName: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  heroCompany: {
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 5,
    marginTop: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  section: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 12,
  },
  infoRow: {
    paddingVertical: 4,
  },
  infoLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 18,
  },
  divider: {
    height: 1,
    marginVertical: 8,
  },
});

export default DocumentViewScreen;
