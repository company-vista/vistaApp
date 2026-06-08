import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { notifications } from '../data/notifications';
import { useThemeColors } from '../../../theme/colors';

const hasNotifications = notifications.length > 0;

type NotificationScreenProps = {
  onBackPress: () => void;
};

function NotificationScreen({ onBackPress }: NotificationScreenProps) {
  const safeAreaInsets = useSafeAreaInsets();
  const colors = useThemeColors();

  return (
    <View
      style={[
        styles.screen,
        { backgroundColor: colors.background, paddingTop: safeAreaInsets.top + 22 },
      ]}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Pressable
            onPress={onBackPress}
            style={[styles.backButton, { backgroundColor: colors.surface }]}>
            <FontAwesome name="arrow-left" size={18} color={colors.text} />
          </Pressable>
          <Text style={[styles.title, { color: colors.text }]}>Notifications</Text>
        </View>
        {hasNotifications ? (
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{notifications.length}</Text>
          </View>
        ) : null}
      </View>

      {hasNotifications ? (
        <View style={[styles.listCard, { backgroundColor: colors.surface }]}>
          {notifications.map(item => (
            <View
              key={item.title}
              style={[styles.notificationRow, { borderBottomColor: colors.border }]}>
              <View style={[styles.notificationIcon, { backgroundColor: colors.surfaceAlt }]}>
                <FontAwesome name={item.icon} size={18} color={colors.accent} />
              </View>
              <View style={styles.notificationCopy}>
                <Text style={[styles.notificationTitle, { color: colors.text }]}>
                  {item.title}
                </Text>
                <Text style={[styles.notificationMessage, { color: colors.muted }]}>
                  {item.message}
                </Text>
                <Text style={[styles.notificationTime, { color: colors.subtle }]}>
                  {item.time}
                </Text>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <View style={[styles.emptyCard, { backgroundColor: colors.surface }]}>
          <View style={[styles.emptyIcon, { backgroundColor: colors.surfaceAlt }]}>
            <FontAwesome name="bell-o" size={30} color={colors.accent} />
          </View>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>No notifications</Text>
          <Text style={[styles.emptyText, { color: colors.muted }]}>
            You are all caught up. New updates will appear here.
          </Text>
        </View>
      )}
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
    justifyContent: 'space-between',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    color: '#111827',
    fontSize: 22,
    fontWeight: '500',
  },
  countBadge: {
    minWidth: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 17,
    backgroundColor: '#ef4444',
  },
  countText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '900',
  },
  listCard: {
    borderRadius: 18,
    backgroundColor: '#ffffff',
    marginTop: 24,
    paddingHorizontal: 16,
  },
  emptyCard: {
    alignItems: 'center',
    borderRadius: 18,
    backgroundColor: '#ffffff',
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  emptyIcon: {
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 35,
    backgroundColor: '#ecfeff',
  },
  emptyTitle: {
    color: '#111827',
    fontSize: 20,
    fontWeight: '900',
    marginTop: 18,
  },
  emptyText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
    marginTop: 8,
    textAlign: 'center',
  },
  notificationRow: {
    flexDirection: 'row',
    gap: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingVertical: 16,
  },
  notificationIcon: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 13,
    backgroundColor: '#ecfeff',
  },
  notificationCopy: {
    flex: 1,
  },
  notificationTitle: {
    color: '#111827',
    fontSize: 15,
    fontWeight: '600',
  },
  notificationMessage: {
    color: '#64748b',
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 19,
    marginTop: 4,
  },
  notificationTime: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 8,
  },
});

export default NotificationScreen;
