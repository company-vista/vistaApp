import { Pressable, StyleSheet, Text, View } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { useThemeColors } from '../../../../theme/colors';
import type { QuickAccessItemId } from '../../data/quickAccessItems';

type OrderServicesSectionProps = {
  onQuickAccessItemPress: (itemId: QuickAccessItemId) => void;
};

const serviceItems = [
  {
    title: 'File Franchise Tax',
    subtitle: 'Delaware - Resolve overdue status',
    tag: 'Urgent',
    icon: 'file-text-o',
    tone: 'red',
  },
  {
    title: 'IRS Tax Filing',
    subtitle: 'Form 1120 / 5472 preparation',
    tag: 'Due Jul 15',
    icon: 'file-text',
    tone: 'amber',
  },
  {
    title: 'Add a New Entity',
    subtitle: 'LLC, C-Corp or S-Corp - Any state',
    tag: undefined,
    icon: 'building-o',
    tone: 'blue',
  },
  {
    title: 'Change Registered Agent',
    subtitle: 'Nationwide - Same day processing',
    tag: undefined,
    icon: 'exchange',
    tone: 'purple',
  },
] as const;

type Tone = (typeof serviceItems)[number]['tone'];

function getToneStyles(tone: Tone) {
  const toneStyles = {
    amber: {
      icon: styles.iconAmber,
      iconText: styles.iconTextAmber,
      tag: styles.tagAmber,
      tagText: styles.tagTextAmber,
    },
    blue: {
      icon: styles.iconBlue,
      iconText: styles.iconTextBlue,
      tag: styles.tagBlue,
      tagText: styles.tagTextBlue,
    },
    purple: {
      icon: styles.iconPurple,
      iconText: styles.iconTextPurple,
      tag: styles.tagPurple,
      tagText: styles.tagTextPurple,
    },
    red: {
      icon: styles.iconRed,
      iconText: styles.iconTextRed,
      tag: styles.tagRed,
      tagText: styles.tagTextRed,
    },
  };

  return toneStyles[tone];
}

function OrderServicesSection({
  onQuickAccessItemPress,
}: OrderServicesSectionProps) {
  const colors = useThemeColors();

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Order services
        </Text>
      </View>
      <View style={styles.serviceList}>
        {serviceItems.map(item => {
          const tone = getToneStyles(item.tone);

          return (
            <Pressable key={item.title} style={[styles.serviceRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={[styles.serviceIcon, tone.icon]}>
                <FontAwesome
                  name={item.icon}
                  size={17}
                  style={tone.iconText}
                />
              </View>
              <View style={styles.serviceCopy}>
                <Text style={[styles.serviceTitle, { color: colors.text }]}>{item.title}</Text>
                <Text style={[styles.serviceSubtitle, { color: colors.muted }]}>{item.subtitle}</Text>
              </View>
              <View style={styles.serviceRight}>
                {item.tag ? (
                  <View style={[styles.pill, tone.tag]}>
                    <Text style={[styles.pillText, tone.tagText]}>{item.tag}</Text>
                  </View>
                ) : null}
                <FontAwesome name="angle-right" size={18} color={colors.muted} />
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 9,
  },
  sectionTitle: {
    color: '#2C2C2A',
    fontSize: 13,
    fontWeight: '500',
  },
  sectionLink: {
    color: '#D85A30',
    fontSize: 11,
    fontWeight: '500',
  },
  iconBlue: {
    backgroundColor: '#DBEAFE',
  },
  iconAmber: {
    backgroundColor: '#FEF3C7',
  },
  iconRed: {
    backgroundColor: '#FEE2E2',
  },
  iconPurple: {
    backgroundColor: '#EDE9FE',
  },
  iconTextBlue: {
    color: '#1D4ED8',
  },
  iconTextAmber: {
    color: '#B45309',
  },
  iconTextRed: {
    color: '#DC2626',
  },
  iconTextPurple: {
    color: '#7C3AED',
  },
  tagBlue: {
    backgroundColor: '#DBEAFE',
  },
  tagAmber: {
    backgroundColor: '#FEF3C7',
  },
  tagRed: {
    backgroundColor: '#FEE2E2',
  },
  tagPurple: {
    backgroundColor: '#EDE9FE',
  },
  tagTextBlue: {
    color: '#1D4ED8',
  },
  tagTextAmber: {
    color: '#B45309',
  },
  tagTextRed: {
    color: '#DC2626',
  },
  tagTextPurple: {
    color: '#7C3AED',
  },
  serviceList: {
    gap: 7,
  },
  serviceRow: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 13,
    paddingVertical: 11,
  },
  serviceIcon: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
  },
  serviceCopy: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 13,
    fontWeight: '500',
  },
  serviceSubtitle: {
    fontSize: 11,
    marginTop: 1,
  },
  serviceRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pill: {
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  pillText: {
    fontSize: 10,
    fontWeight: '500',
  },
});

export default OrderServicesSection;
