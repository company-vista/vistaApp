import { useEffect, useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { BackButton } from '../../../components/buttons';
import NotificationPageSkeleton from '../../../notification/NotificationPageSkeleton';
import type { NotificationItem } from '../data/notifications';
import { fetchNotifications } from '../api/notificationsApi';
import { useAppSelector } from '../../../store/hooks';
import { useThemeColors } from '../../../theme/colors';

const notificationFilters = ['All', 'Unread', 'Read'] as const;

type NotificationFilter = (typeof notificationFilters)[number];

function getBadgeCount(count: number) {
  return count > 9 ? '9+' : String(count);
}

type NotificationScreenProps = {
  onBackPress: () => void;
  onNotificationPress: (notification: NotificationItem) => void;
};

function NotificationScreen({
  onBackPress,
  onNotificationPress,
}: NotificationScreenProps) {
  const safeAreaInsets = useSafeAreaInsets();
  const colors = useThemeColors();
  const token = useAppSelector(state => state.auth.token);
  const [activeFilter, setActiveFilter] = useState<NotificationFilter>('All');
  const [notificationList, setNotificationList] = useState<NotificationItem[]>([]);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(true);
  const hasNotifications = notificationList.length > 0;
  const filteredNotifications = useMemo(() => {
    if (activeFilter === 'Unread') {
      return notificationList.filter(item => !item.isRead);
    }

    if (activeFilter === 'Read') {
      return notificationList.filter(item => item.isRead);
    }

    return notificationList;
  }, [activeFilter, notificationList]);
  const notificationFilterCounts = useMemo(
    () => ({
      All: notificationList.length,
      Read: notificationList.filter(item => item.isRead).length,
      Unread: notificationList.filter(item => !item.isRead).length,
    }),
    [notificationList],
  );

  useEffect(() => {
    let isMounted = true;

    setIsLoadingNotifications(true);

    fetchNotifications({ token }).then(result => {
      if (isMounted && result.isSuccess) {
        setNotificationList(result.notifications);
      }
    }).finally(() => {
      if (isMounted) {
        setIsLoadingNotifications(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [token]);

  return (
    <ScrollView
      contentContainerStyle={[
        styles.scrollContent,
        { paddingBottom: safeAreaInsets.bottom + 24 },
      ]}
      style={[
        styles.screen,
        { backgroundColor: colors.background, paddingTop: safeAreaInsets.top + 22 },
      ]}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <BackButton onPress={onBackPress} />
          <Text style={[styles.title, { color: colors.text }]}>Notifications</Text>
        </View>
        {hasNotifications ? (
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{getBadgeCount(notificationList.length)}</Text>
          </View>
        ) : null}
      </View>

      {isLoadingNotifications ? (
        <NotificationPageSkeleton />
      ) : hasNotifications ? (
        <>
          <View style={styles.filterRow}>
            {notificationFilters.map(filter => {
              const isActive = activeFilter === filter;

              return (
                <Pressable
                  key={filter}
                  onPress={() => setActiveFilter(filter)}
                  style={[
                    styles.filterButton,
                    { backgroundColor: colors.surface, borderColor: colors.border },
                    isActive ? { borderColor: colors.accent } : null,
                  ]}>
                  <Text
                    style={[
                      styles.filterButtonText,
                      { color: colors.text },
                      isActive ? [styles.activeFilterButtonText, { color: colors.accent }] : null,
                    ]}>
                    {filter} ({notificationFilterCounts[filter]})
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {filteredNotifications.length > 0 ? (
            <View style={[styles.listCard, { backgroundColor: colors.surface }]}>
              {filteredNotifications.map(item => (
                <Pressable
                  key={item.id}
                  onPress={() => onNotificationPress(item)}
                  style={[styles.notificationRow, { borderBottomColor: colors.border }]}>
                  <View
                    style={[
                      styles.notificationIcon,
                      { backgroundColor: colors.surfaceAlt },
                    ]}>
                    <FontAwesome name={item.icon} size={18} color={colors.accent} />
                  </View>
                  <View style={styles.notificationCopy}>
                    <View style={styles.notificationTitleRow}>
                      <Text style={[styles.notificationTitle, { color: colors.text }]}>
                        {item.title}
                      </Text>
                      {!item.isRead ? <View style={styles.unreadDot} /> : null}
                    </View>
                    <Text style={[styles.notificationMessage, { color: colors.muted }]}>
                      {item.message}
                    </Text>
                    <Text style={[styles.notificationTime, { color: colors.subtle }]}>
                      {item.time}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </View>
          ) : (
            <View style={[styles.emptyCard, { backgroundColor: colors.surface }]}>
              <View style={[styles.emptyIcon, { backgroundColor: colors.surfaceAlt }]}>
                <FontAwesome name="bell-o" size={30} color={colors.accent} />
              </View>
              <Text style={[styles.emptyTitle, { color: colors.text }]}>
                No {activeFilter.toLowerCase()} notifications
              </Text>
              <Text style={[styles.emptyText, { color: colors.muted }]}>
                Matching notifications will appear here.
              </Text>
            </View>
          )}
        </>
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
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
  title: {
    color: '#111827',
    fontSize: 20,
    fontWeight: '400',
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
    fontWeight: '500',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 24,
  },
  filterButton: {
    minHeight: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 18,
  },
  activeFilterButton: {
  },
  filterButtonText: {
    fontSize: 13,
    fontWeight: '500',
  },
  activeFilterButtonText: {
  },
  listCard: {
    borderRadius: 18,
    backgroundColor: '#ffffff',
    marginTop: 16,
    paddingHorizontal: 14,
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
  notificationTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  notificationTitle: {
    color: '#111827',
    fontSize: 15,
    fontWeight: '400',
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
  },
  notificationMessage: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '400',
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
