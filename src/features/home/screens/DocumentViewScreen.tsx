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

import { useThemeColors } from '../../../theme/colors';
import type { DocumentItem } from '../api/clientDocumentApi';
import BackButton from '../../../components/buttons/BackButton';

type DocumentViewScreenProps = {
  document: DocumentItem;
  onBackPress: () => void;
};

function DocumentViewScreen({ document: doc, onBackPress }: DocumentViewScreenProps) {
  const colors = useThemeColors();

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
      ? { bg: '#E6F4EA', text: '#137333', dot: '#1E8E3E' }
      : { bg: '#FEF3C7', text: '#92400E', dot: '#D97706' };

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={colors.mode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border, backgroundColor: colors.background }]}>
        <BackButton onPress={onBackPress} />
        <Text style={[styles.headerTitle, { color: colors.text }]}>Document Details</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* Hero card */}
        <View style={[styles.heroCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={[styles.heroIcon, { backgroundColor: colors.surfaceAlt }]}>
            <FontAwesome name="file-text-o" size={32} color={colors.primary} />
          </View>
          <Text style={[styles.heroFileName, { color: colors.text }]} numberOfLines={2}>
            {doc.originalFileName ?? doc.fileName ?? 'Document'}
          </Text>
          <Text style={[styles.heroCompany, { color: colors.muted }]}>
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
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Document Information</Text>

          <InfoRow label="Document Type" value={doc.documentType ?? '—'} colors={colors} />
          <Divider color={colors.border} />
          <InfoRow label="File Name" value={doc.originalFileName ?? doc.fileName ?? '—'} colors={colors} />
          <Divider color={colors.border} />
          <InfoRow label="File Size" value={fileSizeText} colors={colors} />
          <Divider color={colors.border} />
          <InfoRow label="MIME Type" value={doc.mimeType ?? '—'} colors={colors} />
          <Divider color={colors.border} />
          <InfoRow label="Source Group" value={doc.sourceGroup ?? '—'} colors={colors} />
        </View>

        {/* Upload Info */}
        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Upload Information</Text>

          <InfoRow label="Uploaded By" value={doc.uploadedBy ?? '—'} colors={colors} />
          <Divider color={colors.border} />
          <InfoRow label="Uploaded At" value={uploadedDate} colors={colors} />
          <Divider color={colors.border} />
          <InfoRow label="Created At" value={createdDate} colors={colors} />
          <Divider color={colors.border} />
          <InfoRow label="Country" value={doc.country ?? '—'} colors={colors} />
        </View>

        {/* Company Info */}
        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Company Information</Text>
          <InfoRow label="Company Name" value={doc.companyName ?? '—'} colors={colors} />
          <Divider color={colors.border} />
          <InfoRow label="Company ID" value={doc.companyId ?? '—'} colors={colors} />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

/* ─── Helper Components ─── */

type InfoRowProps = {
  label: string;
  value: string;
  colors: ReturnType<typeof useThemeColors>;
};

function InfoRow({ label, value, colors }: InfoRowProps) {
  return (
    <View style={styles.infoRow}>
      <Text style={[styles.infoLabel, { color: colors.subtle }]}>{label.toUpperCase()}</Text>
      <Text style={[styles.infoValue, { color: colors.text }]}>{value}</Text>
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
