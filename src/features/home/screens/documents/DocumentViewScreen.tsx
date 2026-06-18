import React from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import BackButton from '../../../../components/buttons/BackButton';
import { useThemeColors, type AppTheme } from '../../../../theme/colors';
import type { DocumentItem } from '../../api/clientDocumentApi';

const HERO_COLORS = {
  accentBlue: '#1D4ED8',
  accentGreen: '#10B981',
  accentText: '#2563EB',
  darkText: '#0F172A',
  panel: '#0D2137',
  softBlue: '#DBEAFE',
  white: '#FFFFFF',
};

function getPalette(colors: AppTheme) {
  const isDark = colors.mode === 'dark';

  return {
    background: isDark ? colors.background : '#F8FAFC',
    bankCard: isDark ? '#0F172A' : '#F8FAFC',
    border: colors.border,
    card: colors.surface,
    cardMuted: isDark ? '#111827' : '#F8FAFC',
    companyText: isDark ? '#93C5FD' : HERO_COLORS.accentText,
    divider: isDark ? '#334155' : '#E2E8F0',
    downloadButton: HERO_COLORS.accentBlue,
    iconButton: isDark ? '#111827' : '#FFFFFF',
    iconButtonBorder: isDark ? '#334155' : '#CBD5E1',
    label: isDark ? '#94A3B8' : '#64748B',
    muted: colors.muted,
    statusBackground: isDark ? '#123B2F' : '#DCFCE7',
    statusBorder: isDark ? '#1F7A5A' : '#86EFAC',
    statusText: isDark ? '#6EE7B7' : '#047857',
    text: isDark ? colors.text : HERO_COLORS.darkText,
    textSoft: isDark ? '#CBD5E1' : '#334155',
  };
}

type DocumentViewScreenProps = {
  document: DocumentItem;
  onBackPress: () => void;
};

function formatDateTime(value?: string) {
  if (!value) {
    return '13-Dec-2026, 03:50 AM';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString('en-GB', {
    day: '2-digit',
    hour: '2-digit',
    hour12: true,
    minute: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatCurrencyFromSize(fileSize?: number) {
  const amount = typeof fileSize === 'number' && Number.isFinite(fileSize)
    ? Math.max(fileSize / 10, 1180)
    : 1180;

  return new Intl.NumberFormat('en-IN', {
    currency: 'INR',
    style: 'currency',
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(amount);
}

function getInvoiceNumber(doc: DocumentItem) {
  const source = doc._id ?? doc.companyId ?? doc.fileName ?? '20255322006';
  const numeric = source.replace(/[^0-9]/g, '');

  if (numeric.length >= 10) {
    return `INV-${numeric.slice(0, 10)}`;
  }

  return `INV-${numeric.padEnd(10, '0')}`;
}

function getRecipientName(doc: DocumentItem) {
  return doc.companyName ?? 'Luck Solution Private Limited';
}

function getDocumentTitle(doc: DocumentItem) {
  return doc.documentType ?? 'Tax Invoice';
}

function DocumentViewScreen({ document: doc, onBackPress }: DocumentViewScreenProps) {
  const colors = useThemeColors();
  const palette = getPalette(colors);

  const documentTitle = getDocumentTitle(doc);
  const companyName = doc.companyName ?? 'Koshika International';
  const documentDate = formatDateTime(doc.uploadedAt ?? doc.createdAt);
  const fileAmount = formatCurrencyFromSize(doc.fileSize);
  const subtotal = formatCurrencyFromSize((doc.fileSize ?? 11800) / 1.1);
  const invoiceNumber = getInvoiceNumber(doc);
  const recipientName = getRecipientName(doc);
  const fileName = doc.originalFileName ?? doc.fileName ?? 'Tax_Invoice.pdf';

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: palette.background }]}>
      <StatusBar
        barStyle={colors.mode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={palette.background}
      />

      <View style={[styles.header, { backgroundColor: palette.background }]}>
        <BackButton onPress={onBackPress} />
        <Text style={[styles.headerTitle, { color: palette.text }]}>{documentTitle}</Text>
        <View style={styles.headerActions}>
          <Pressable
            accessibilityRole="button"
            style={[
              styles.headerIconButton,
              { backgroundColor: palette.iconButton, borderColor: palette.iconButtonBorder },
            ]}>
            <FontAwesome name="clone" size={14} color={palette.companyText} />
          </Pressable>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={[styles.invoiceCard, { backgroundColor: palette.card, borderColor: palette.border }]}>
          <View style={styles.companyHeader}>
            <View style={styles.companyCopy}>
              <Text style={styles.documentHeading}>{documentTitle}</Text>
              <Text style={[styles.companyName, { color: palette.companyText }]}>{companyName}</Text>
              <Text style={[styles.companyAddress, { color: palette.label }]}>
                GC-302, 5th Floor, Gaur City Center,{'\n'}Greater Noida West, U.P. 201309
              </Text>
            </View>
            <View style={[styles.statusPill, { backgroundColor: palette.statusBackground, borderColor: palette.statusBorder }]}>
              <Text style={[styles.statusText, { color: palette.statusText }]}>ORIGINAL</Text>
            </View>
          </View>

          <View style={[styles.summaryStrip, { borderColor: palette.divider }]}>
            <InfoBlock label="INVOICE NO." value={invoiceNumber} valueColor={palette.text} />
            <InfoBlock label="DATE & TIME" value={documentDate} valueColor={palette.text} align="right" />
          </View>

          <View style={[styles.partyCard, { backgroundColor: palette.cardMuted, borderColor: palette.divider }]}>
            <View style={styles.partyRow}>
              <View style={styles.partyColumn}>
                <Text style={[styles.partyLabel, { color: palette.label }]}>BILL TO</Text>
                <Text style={[styles.partyTitle, { color: palette.text }]}>{recipientName}</Text>
                <Text style={[styles.partyAddress, { color: palette.label }]}>Uttar Pradesh, India</Text>
              </View>
            </View>
          </View>

          <Text style={[styles.serviceTitle, { color: palette.label }]}>SERVICE PARTICULARS</Text>

          <View style={[styles.lineItemCard, { borderColor: palette.divider }]}>
            <View style={styles.lineItemTop}>
              <View>
                <Text style={[styles.lineItemName, { color: palette.text }]}>{doc.documentType ?? 'Federal Filing'}</Text>
                <Text style={[styles.lineItemMeta, { color: palette.label }]}>1</Text>
              </View>
              <View style={styles.amountColumn}>
                <Text style={[styles.lineItemAmount, { color: palette.companyText }]}>{fileAmount}</Text>
              </View>
            </View>
            <View style={[styles.lineItemFooter, { borderTopColor: palette.divider }]}>
              <FooterAmount label="QTY" value="1" palette={palette} />
              <FooterAmount label="RATE" value={fileAmount} palette={palette} />
              <FooterAmount label="AMOUNT" value={fileAmount} palette={palette} align="right" />
            </View>
          </View>

          <View style={[styles.lineItemCard, { borderColor: palette.divider }]}>
            <View style={styles.lineItemTop}>
              <View>
                <Text style={[styles.lineItemName, { color: palette.text }]}>State Filing</Text>
                <Text style={[styles.lineItemMeta, { color: palette.label }]}>1</Text>
              </View>
              <View style={styles.amountColumn}>
                <Text style={[styles.lineItemAmount, { color: palette.companyText }]}>{fileAmount}</Text>
              </View>
            </View>
            <View style={[styles.lineItemFooter, { borderTopColor: palette.divider }]}>
              <FooterAmount label="QTY" value="1" palette={palette} />
              <FooterAmount label="RATE" value={subtotal} palette={palette} />
              <FooterAmount label="AMOUNT" value={subtotal} palette={palette} align="right" />
            </View>
          </View>

          <View style={[styles.totalSection, { borderColor: palette.divider, backgroundColor: palette.cardMuted }]}>
            <TotalRow label="Sub Total" value={subtotal} palette={palette} />
            <TotalRow label="Total CGST" value="₹ 361.00" palette={palette} />
            <View style={[styles.totalDivider, { backgroundColor: palette.divider }]} />
            <TotalRow label="Grand Total" value="₹ 2,124.00" palette={palette} highlight />
            <Text style={[styles.totalNote, { color: palette.label }]}>
              The Number Rounded Amount Twenty Four only
            </Text>
          </View>

          <View style={[styles.bankCard, { backgroundColor: palette.bankCard, borderColor: palette.divider }]}>
            <View style={styles.bankIconWrap}>
              <FontAwesome name="university" size={14} color={palette.companyText} />
            </View>
            <View style={styles.bankCopy}>
              <Text style={[styles.bankLabel, { color: palette.label }]}>BANK DETAILS</Text>
              <Text style={[styles.bankTitle, { color: palette.text }]}>AXIS BANK, AL NAHDA, GHAZIABAD</Text>
              <Text style={[styles.bankMeta, { color: palette.label }]}>A/C: 918100001889</Text>
              <Text style={[styles.bankMeta, { color: palette.label }]}>IFSC: UTIB0001632</Text>
            </View>
          </View>

          <View style={styles.signatureBlock}>
            <Text style={[styles.signatureText, { color: palette.label }]}>Authorized Signatory</Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footerBar, { backgroundColor: palette.background, borderTopColor: palette.divider }]}>
        <Pressable style={[styles.downloadButton, { backgroundColor: palette.downloadButton }]}>
          <FontAwesome name="download" size={13} color={HERO_COLORS.white} />
          <Text style={styles.downloadButtonText}>Download PDF</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          style={[
            styles.footerIconButton,
            { backgroundColor: palette.iconButton, borderColor: palette.iconButtonBorder },
          ]}>
          <FontAwesome name="share-alt" size={14} color={palette.companyText} />
        </Pressable>
      </View>

      <View style={styles.hiddenFileLabel}>
        <Text>{fileName}</Text>
      </View>
    </SafeAreaView>
  );
}

type InfoBlockProps = {
  align?: 'left' | 'right';
  label: string;
  value: string;
  valueColor: string;
};

function InfoBlock({ align = 'left', label, value, valueColor }: InfoBlockProps) {
  return (
    <View style={[styles.infoBlock, align === 'right' ? styles.infoBlockRight : null]}>
      <Text style={styles.infoBlockLabel}>{label}</Text>
      <Text style={[styles.infoBlockValue, { color: valueColor, textAlign: align }]}>{value}</Text>
    </View>
  );
}

type FooterAmountProps = {
  align?: 'left' | 'right';
  label: string;
  palette: ReturnType<typeof getPalette>;
  value: string;
};

function FooterAmount({ align = 'left', label, palette, value }: FooterAmountProps) {
  return (
    <View style={[styles.footerAmount, align === 'right' ? styles.footerAmountRight : null]}>
      <Text style={[styles.footerAmountLabel, { color: palette.label }]}>{label}</Text>
      <Text style={[styles.footerAmountValue, { color: palette.text, textAlign: align }]}>{value}</Text>
    </View>
  );
}

type TotalRowProps = {
  highlight?: boolean;
  label: string;
  palette: ReturnType<typeof getPalette>;
  value: string;
};

function TotalRow({ highlight = false, label, palette, value }: TotalRowProps) {
  return (
    <View style={styles.totalRow}>
      <Text style={[styles.totalLabel, { color: highlight ? palette.text : palette.label }]}>{label}</Text>
      <Text style={[styles.totalValue, { color: highlight ? palette.companyText : palette.text }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 10,
    paddingHorizontal: 14,
    paddingTop: 44,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  headerActions: {
    alignItems: 'flex-end',
    minWidth: 36,
  },
  headerIconButton: {
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  scrollContent: {
    paddingBottom: 96,
    paddingHorizontal: 10,
    paddingTop: 6,
  },
  invoiceCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 12,
  },
  companyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  companyCopy: {
    flex: 1,
    paddingRight: 10,
  },
  documentHeading: {
    color: HERO_COLORS.panel,
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 8,
  },
  companyName: {
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 19,
  },
  companyAddress: {
    fontSize: 9,
    fontWeight: '500',
    lineHeight: 13,
    marginTop: 4,
  },
  statusPill: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 7,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  summaryStrip: {
    borderTopWidth: 1,
    flexDirection: 'row',
    marginTop: 12,
    paddingTop: 12,
  },
  infoBlock: {
    flex: 1,
  },
  infoBlockRight: {
    alignItems: 'flex-end',
  },
  infoBlockLabel: {
    color: '#64748B',
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 0.4,
    marginBottom: 4,
  },
  infoBlockValue: {
    fontSize: 11,
    fontWeight: '800',
    lineHeight: 14,
  },
  partyCard: {
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 12,
    padding: 10,
  },
  partyRow: {
    flexDirection: 'row',
  },
  partyColumn: {
    flex: 1,
  },
  partyLabel: {
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  partyTitle: {
    fontSize: 12,
    fontWeight: '800',
    marginTop: 5,
  },
  partyAddress: {
    fontSize: 9,
    fontWeight: '500',
    lineHeight: 13,
    marginTop: 3,
  },
  serviceTitle: {
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginTop: 14,
  },
  lineItemCard: {
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 10,
    overflow: 'hidden',
  },
  lineItemTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  lineItemName: {
    fontSize: 12,
    fontWeight: '800',
  },
  lineItemMeta: {
    fontSize: 9,
    fontWeight: '600',
    marginTop: 3,
  },
  amountColumn: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  lineItemAmount: {
    fontSize: 12,
    fontWeight: '800',
  },
  lineItemFooter: {
    borderTopWidth: 1,
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  footerAmount: {
    flex: 1,
  },
  footerAmountRight: {
    alignItems: 'flex-end',
  },
  footerAmountLabel: {
    fontSize: 7,
    fontWeight: '700',
    letterSpacing: 0.35,
    marginBottom: 3,
  },
  footerAmountValue: {
    fontSize: 9,
    fontWeight: '700',
  },
  totalSection: {
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 12,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 3,
  },
  totalDivider: {
    height: 1,
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 11,
    fontWeight: '700',
  },
  totalValue: {
    fontSize: 11,
    fontWeight: '800',
  },
  totalNote: {
    fontSize: 8,
    fontStyle: 'italic',
    marginTop: 8,
  },
  bankCard: {
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    marginTop: 12,
    padding: 10,
  },
  bankIconWrap: {
    alignItems: 'center',
    backgroundColor: HERO_COLORS.softBlue,
    borderRadius: 10,
    height: 34,
    justifyContent: 'center',
    marginRight: 10,
    width: 34,
  },
  bankCopy: {
    flex: 1,
  },
  bankLabel: {
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 0.35,
  },
  bankTitle: {
    fontSize: 10,
    fontWeight: '800',
    lineHeight: 14,
    marginTop: 4,
  },
  bankMeta: {
    fontSize: 8,
    fontWeight: '600',
    marginTop: 2,
  },
  signatureBlock: {
    alignItems: 'flex-end',
    marginTop: 18,
  },
  signatureText: {
    fontSize: 8,
    fontStyle: 'italic',
    fontWeight: '600',
  },
  footerBar: {
    alignItems: 'center',
    borderTopWidth: 1,
    bottom: 0,
    flexDirection: 'row',
    left: 0,
    paddingHorizontal: 10,
    paddingVertical: 10,
    position: 'absolute',
    right: 0,
  },
  downloadButton: {
    alignItems: 'center',
    borderRadius: 10,
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    height: 42,
    justifyContent: 'center',
  },
  downloadButtonText: {
    color: HERO_COLORS.white,
    fontSize: 13,
    fontWeight: '700',
  },
  footerIconButton: {
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    height: 42,
    justifyContent: 'center',
    marginLeft: 10,
    width: 42,
  },
  hiddenFileLabel: {
    display: 'none',
  },
});

export default DocumentViewScreen;
