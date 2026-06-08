import { useRef, useState } from 'react';
import {
  Animated,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import styles from './HomeScreen.styles';

import logoImage from '../../../assets/images/logo.jpg';
import { useAppSelector } from '../../../store/hooks';
import { useThemeColors } from '../../../theme/colors';
import { notifications } from '../../notifications/data/notifications';
import BillingTabContent from '../components/BillingTabContent';
import CompanyTabContent from '../components/CompanyTabContent';
import HomeTabContent from '../components/HomeTabContent';
import MoreTabContent from '../components/MoreTabContent';
import ReportsTabContent from '../components/ReportsTabContent';
import type { QuickAccessItemId } from '../data/quickAccessItems';

type TabId = 'home' | 'company' | 'reports' | 'billing' | 'more';

const tabs: Array<{ id: TabId; title: string; icon: string }> = [
  { id: 'home', title: 'Home', icon: 'home' },
  { id: 'company', title: 'Company', icon: 'building-o' },
  { id: 'reports', title: 'Compliances', icon: 'check-square-o' },
  { id: 'billing', title: 'Billing', icon: 'credit-card' },
  { id: 'more', title: 'More', icon: 'ellipsis-h' },
];

type HomeScreenProps = {
  onFollowUsPress: () => void;
  onHelpFeedbackPress: () => void;
  onNotificationPress: () => void;
  onProfilePress: () => void;
  onQuickAccessItemPress: (itemId: QuickAccessItemId) => void;
  onQuickAccessViewAllPress: () => void;
};

function HomeScreen({
  onFollowUsPress,
  onHelpFeedbackPress,
  onNotificationPress,
  onProfilePress,
  onQuickAccessItemPress,
  onQuickAccessViewAllPress,
}: HomeScreenProps) {
  const safeAreaInsets = useSafeAreaInsets();
  const colors = useThemeColors();
  const user = useAppSelector(state => state.auth.user);
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const moreSlideAnim = useRef(new Animated.Value(320)).current;
  const notificationCount = notifications.length;
  const profileImage =
    user?.profileImage ?? user?.profilePicture ?? user?.avatar ?? user?.image ?? user?.photo;
  const displayName =
    user?.name ?? [user?.firstName, user?.lastName].filter(Boolean).join(' ') ?? 'User';

  function openMoreSheet() {
    setIsMoreOpen(true);
    Animated.timing(moreSlideAnim, {
      toValue: 0,
      duration: 260,
      useNativeDriver: true,
    }).start();
  }

  function closeMoreSheet(onClosed?: () => void) {
    Animated.timing(moreSlideAnim, {
      toValue: 320,
      duration: 220,
      useNativeDriver: true,
    }).start(() => {
      setIsMoreOpen(false);
      onClosed?.();
    });
  }

  function handleTabPress(tabId: TabId) {
    if (tabId === 'more') {
      openMoreSheet();
      return;
    }

    setActiveTab(tabId);
  }

  function openHelpFeedback() {
    closeMoreSheet(onHelpFeedbackPress);
  }

  function openFollowUs() {
    closeMoreSheet(onFollowUsPress);
  }

  function closeSearch() {
    setIsSearchOpen(false);
    setSearchQuery('');
  }

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: safeAreaInsets.top + 22,
            paddingBottom: safeAreaInsets.bottom + 116,
          },
        ]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Image
            onError={event => console.log('Header avatar failed', event.nativeEvent.error, profileImage)}
            source={profileImage ? { uri: profileImage } : logoImage}
            style={styles.avatar}
          />
          <Text numberOfLines={1} style={[styles.greeting, { color: colors.text }]}>
            Hi, {displayName || 'User'}
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open search"
            onPress={() => setIsSearchOpen(true)}
            style={styles.headerIcon}>
            <FontAwesome name="search" size={22} color={colors.muted} />
          </Pressable>
          <Pressable
            onPress={onNotificationPress}
            style={[styles.headerIcon, styles.notificationButton]}>
            <FontAwesome name="bell" size={22} color="#f59e0b" />
            {notificationCount > 0 ? (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>{notificationCount}</Text>
              </View>
            ) : null}
          </Pressable>
          <Pressable
            onPress={onProfilePress}
            style={[
              styles.profileButton,
              { backgroundColor: colors.surface, borderColor: colors.accentSoft },
            ]}>
            {profileImage ? (
              <Image
                onError={event => console.log('Profile button avatar failed', event.nativeEvent.error, profileImage)}
                source={{ uri: profileImage }}
                style={styles.profileImage}
              />
            ) : (
              <FontAwesome name="user" size={23} color={colors.accent} />
            )}
          </Pressable>
        </View>

        {activeTab === 'home' ? (
          <HomeTabContent
            onQuickAccessItemPress={onQuickAccessItemPress}
            onQuickAccessViewAllPress={onQuickAccessViewAllPress}
          />
        ) : null}
        {activeTab === 'company' ? <CompanyTabContent /> : null}
        {activeTab === 'reports' ? <ReportsTabContent /> : null}
        {activeTab === 'billing' ? <BillingTabContent /> : null}
      </ScrollView>

      <Pressable
        style={[
          styles.fab,
          {
            backgroundColor: colors.activeNav,
            bottom: safeAreaInsets.bottom + 104,
          },
        ]}>
        <FontAwesome name="plus" size={24} color={colors.text} />
      </Pressable>

      <View
        style={[
          styles.bottomNav,
          {
            backgroundColor: colors.surface,
            paddingBottom: safeAreaInsets.bottom + 10,
          },
        ]}>
        {tabs.map(tab => (
          <Pressable
            key={tab.title}
            onPress={() => handleTabPress(tab.id)}
            style={[
              styles.navItem,
              activeTab === tab.id || (tab.id === 'more' && isMoreOpen)
                ? { backgroundColor: colors.activeNav }
                : null,
            ]}>
            <FontAwesome
              name={tab.icon}
              size={22}
              color={
                activeTab === tab.id || (tab.id === 'more' && isMoreOpen)
                  ? colors.text
                  : colors.muted
              }
            />
            <Text
              style={[
                styles.navText,
                { color: colors.muted },
                activeTab === tab.id || (tab.id === 'more' && isMoreOpen)
                  ? [styles.activeNavText, { color: colors.text }]
                  : null,
              ]}>
              {tab.title}
            </Text>
          </Pressable>
        ))}
      </View>

      {isMoreOpen ? (
        <View style={styles.moreOverlay}>
          <Pressable
            onPress={() => closeMoreSheet()}
            style={[styles.moreBackdrop, { backgroundColor: colors.backdrop }]}
          />
          <Animated.View
            style={[
              styles.moreSheet,
              {
                backgroundColor: colors.sheet,
                paddingBottom: safeAreaInsets.bottom + 24,
                transform: [{ translateY: moreSlideAnim }],
              },
            ]}>
            <View style={[styles.sheetHandle, { backgroundColor: colors.border }]} />
            <View style={styles.sheetHeader}>
              <Text style={[styles.sheetTitle, { color: colors.text }]}>More</Text>
              <Pressable
                onPress={() => closeMoreSheet()}
                style={[styles.sheetCloseButton, { backgroundColor: colors.surface }]}>
                <FontAwesome name="close" size={18} color={colors.text} />
              </Pressable>
            </View>
            <MoreTabContent
              onFollowUsPress={openFollowUs}
              onHelpFeedbackPress={openHelpFeedback}
            />
          </Animated.View>
        </View>
      ) : null}

      {isSearchOpen ? (
        <View style={styles.searchOverlay}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close search"
            onPress={closeSearch}
            style={[styles.searchBackdrop, { backgroundColor: colors.backdrop }]}
          />
          <View
            style={[
              styles.searchPopup,
              {
                backgroundColor: colors.sheet,
                borderColor: colors.border,
                marginTop: safeAreaInsets.top + 18,
              },
            ]}>
            <View style={styles.searchHeader}>
              <Text style={[styles.searchTitle, { color: colors.text }]}>Search</Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close search"
                onPress={closeSearch}
                style={[styles.searchCloseButton, { backgroundColor: colors.surface }]}>
                <FontAwesome name="close" size={18} color={colors.text} />
              </Pressable>
            </View>

            <View
              style={[
                styles.searchInputWrap,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}>
              <FontAwesome name="search" size={18} color={colors.muted} />
              <TextInput
                autoFocus
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search services, invoices, reports..."
                placeholderTextColor={colors.muted}
                returnKeyType="search"
                style={[styles.searchInput, { color: colors.text }]}
              />
              {searchQuery.length > 0 ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Clear search"
                  onPress={() => setSearchQuery('')}
                  style={styles.clearSearchButton}>
                  <FontAwesome name="times-circle" size={18} color={colors.muted} />
                </Pressable>
              ) : null}
            </View>

            <Text style={[styles.searchHint, { color: colors.muted }]}>
              {searchQuery.trim().length > 0
                ? `Searching for "${searchQuery.trim()}"`
                : 'Type to find company services, invoices, reports, and support.'}
            </Text>
          </View>
        </View>
      ) : null}
    </View>
  );
}

export default HomeScreen;
