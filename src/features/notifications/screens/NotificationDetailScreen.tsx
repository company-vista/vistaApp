import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { BackButton } from '../../../components/buttons';
import type { NotificationItem } from '../data/notifications';
import { useThemeColors } from '../../../theme/colors';

type NotificationDetailScreenProps = {
  notification: NotificationItem;
  onBackPress: () => void;
};

function NotificationDetailScreen({
  notification,
  onBackPress,
}: NotificationDetailScreenProps) {
  const safeAreaInsets = useSafeAreaInsets();
  const colors = useThemeColors();

  return (
    <View
      style={[
        styles.screen,
        { backgroundColor: colors.background, paddingTop: safeAreaInsets.top + 22 },
      ]}>
      <View style={styles.header}>
        <BackButton onPress={onBackPress} />
        <Text style={[styles.headerTitle, { color: colors.text }]}>Notification</Text>
      </View>

      <View style={[styles.detailCard, { backgroundColor: colors.surface }]}>
        <View style={[styles.iconWrap, { backgroundColor: colors.surfaceAlt }]}>
          <FontAwesome name={notification.icon} size={24} color={colors.accent} />
        </View>
        <Text style={[styles.title, { color: colors.text }]}>
          {notification.title}
        </Text>
        <Text style={[styles.time, { color: colors.subtle }]}>
          {notification.time}
        </Text>
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <Text style={[styles.message, { color: colors.muted }]}>
          {notification.message}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    color: '#111827',
    fontSize: 20,
    fontWeight: '400',
  },
  detailCard: {
    borderRadius: 18,
    backgroundColor: '#ffffff',
    marginTop: 24,
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  iconWrap: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: '#ecfeff',
  },
  title: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '400',
    lineHeight: 28,
    marginTop: 18,
  },
  time: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 18,
  },
  message: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 22,
  },
});

export default NotificationDetailScreen;
