import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
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
import { fetchNotifications } from '../../notifications/api/notificationsApi';
import type { CompanyCardItem } from './quickAccess/CompanyCard';
import {
  fetchClientCompanies,
  fetchClientCompanyDetails,
  type ClientCompany,
} from '../api/clientProfileApi';
import { mapCompanyToListItem } from './quickAccess/companyListItem';
import BillingTabContent from '../components/InvoicesTabContent';
import CompanyTabContent from '../components/CompanyTabContent';
import DocumentsTabContent from '../components/DocumentsTabContent';
import DocumentViewScreen from './DocumentViewScreen';
import type { DocumentItem } from '../api/clientDocumentApi';
import HomeTabContent from '../components/HomeTabContent';
import MoreTabContent from '../components/MoreTabContent';
import ReportsTabContent from '../components/ReportsTabContent';
import type { QuickAccessItemId } from '../data/quickAccessItems';

type TabId = 'home' | 'company' | 'reports' | 'billing' | 'documents' | 'more';

const tabs: Array<{ id: TabId; title: string; icon: string }> = [
  { id: 'home', title: 'Home', icon: 'home' },
  { id: 'reports', title: 'Compliances', icon: 'check-square-o' },
  { id: 'billing', title: 'Invoices', icon: 'file-text-o' },
  { id: 'documents', title: 'Documents', icon: 'folder-o' },
  { id: 'more', title: 'More', icon: 'ellipsis-h' },
];
const emptyCompanies: ClientCompany[] = [];

function getBadgeCount(count: number) {
  return count > 9 ? '9+' : String(count);
}

type HomeScreenProps = {
  initialTab?: TabId;
  onFollowUsPress: () => void;
  onHelpFeedbackPress: () => void;
  onGoHome: () => void;
  onInvoicePress?: (invoice: Record<string, unknown>) => void;
  onNotificationPress: () => void;
  onProfilePress: () => void;
  onQuickAccessItemPress: (itemId: QuickAccessItemId) => void;
  onQuickAccessViewAllPress: () => void;
};

function HomeScreen({
  initialTab,
  onFollowUsPress,
  onHelpFeedbackPress,
  onGoHome,
  onInvoicePress,
  onNotificationPress,
  onProfilePress,
  onQuickAccessItemPress,
  onQuickAccessViewAllPress,
}: HomeScreenProps) {
  const safeAreaInsets = useSafeAreaInsets();
  const colors = useThemeColors();
  const user = useAppSelector(state => state.auth.user);
  const token = useAppSelector(state => state.auth.token);
  const userCompanies = useAppSelector(
    state => state.auth.user?.companies ?? emptyCompanies,
  );
  const [activeTab, setActiveTab] = useState<TabId>(initialTab ?? 'home');
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isFabMenuOpen, setIsFabMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationCount, setNotificationCount] = useState(0);
  const [selectedCompany, setSelectedCompany] = useState<CompanyCardItem | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<DocumentItem | null>(null);
  const [companyOptions, setCompanyOptions] = useState<CompanyCardItem[]>([]);
  const [isCompanySwitcherOpen, setIsCompanySwitcherOpen] = useState(false);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(false);
  const fabMenuAnim = useRef(new Animated.Value(0)).current;
  const companySwitcherAnim = useRef(new Animated.Value(0)).current;
  const moreSlideAnim = useRef(new Animated.Value(320)).current;
  const fabMenuOpacity = fabMenuAnim;
  const fabMenuScale = fabMenuAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.2, 1],
  });
  const fabMenuTranslateY = fabMenuAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [22, 0],
  });
  const fabIconRotate = fabMenuAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });
  const companySwitcherOpacity = companySwitcherAnim;
  const companySwitcherTranslateY = companySwitcherAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-10, 0],
  });
  const profileImage =
    user?.profileImage ?? user?.profilePicture ?? user?.avatar ?? user?.image ?? user?.photo;
  const displayName =
    user?.name ?? [user?.firstName, user?.lastName].filter(Boolean).join(' ') ?? 'User';

  useEffect(() => {
    let isMounted = true;

    fetchNotifications({ token }).then(result => {
      if (isMounted && result.isSuccess) {
        setNotificationCount(result.notifications.length);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [token]);

  useEffect(() => {
    let isMounted = true;

    setIsLoadingCompanies(true);

    fetchClientCompanies({ token }).then(result => {
      if (!isMounted) {
        return;
      }

      const loadedCompanies =
        result.companies.length > 0 ? result.companies : userCompanies;
      const mappedCompanies = loadedCompanies.map(mapCompanyToListItem);

      setCompanyOptions(mappedCompanies);

      setSelectedCompany(currentCompany => currentCompany ?? mappedCompanies[0] ?? null);
    }).finally(() => {
      if (isMounted) {
        setIsLoadingCompanies(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [token, userCompanies]);

  useEffect(() => {
    if (!selectedCompany?.id) {
      return;
    }

    let isMounted = true;

    fetchClientCompanyDetails({
      companyId: selectedCompany.id,
      token,
    }).then(result => {
      if (!isMounted || !result.company) {
        return;
      }

      const detailCompany = mapCompanyToListItem(result.company, 0);

      setSelectedCompany(currentCompany => {
        if (!currentCompany || currentCompany.id !== selectedCompany.id) {
          return currentCompany;
        }

        return {
          ...currentCompany,
          companyType:
            detailCompany.companyType || currentCompany.companyType,
          countryOfIncorporation:
            detailCompany.countryOfIncorporation ||
            currentCompany.countryOfIncorporation,
          date: detailCompany.date === 'N/A' ? currentCompany.date : detailCompany.date,
          ein: detailCompany.ein || currentCompany.ein,
          status: detailCompany.status || currentCompany.status,
        };
      });

      setCompanyOptions(currentCompanies => currentCompanies.map(company => {
        if (company.id !== selectedCompany.id) {
          return company;
        }

        return {
          ...company,
          companyType: detailCompany.companyType || company.companyType,
          countryOfIncorporation:
            detailCompany.countryOfIncorporation ||
            company.countryOfIncorporation,
          date: detailCompany.date === 'N/A' ? company.date : detailCompany.date,
          ein: detailCompany.ein || company.ein,
          status: detailCompany.status || company.status,
        };
      }));
    });

    return () => {
      isMounted = false;
    };
  }, [selectedCompany?.id, token]);

  function openMoreSheet() {
    closeFabMenu();
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
    closeFabMenu();

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

  function openFabMenu() {
    setIsFabMenuOpen(true);
    Animated.timing(fabMenuAnim, {
      toValue: 1,
      duration: 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }

  function closeFabMenu() {
    Animated.timing(fabMenuAnim, {
      toValue: 0,
      duration: 170,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      setIsFabMenuOpen(false);
    });
  }

  function toggleFabMenu() {
    if (isFabMenuOpen) {
      closeFabMenu();
      return;
    }

    openFabMenu();
  }

  function openCompanySwitcher() {
    setIsCompanySwitcherOpen(true);
    companySwitcherAnim.setValue(0);
    requestAnimationFrame(() => {
      Animated.timing(companySwitcherAnim, {
        toValue: 1,
        duration: 240,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();
    });
  }

  function closeCompanySwitcher() {
    Animated.timing(companySwitcherAnim, {
      toValue: 0,
      duration: 160,
      easing: Easing.in(Easing.quad),
      useNativeDriver: true,
    }).start(() => {
      setIsCompanySwitcherOpen(false);
    });
  }

  function selectCompanyFromSwitcher(company: CompanyCardItem) {
    setSelectedCompany(company);
    closeCompanySwitcher();
  }

  if (selectedDocument) {
    return (
      <DocumentViewScreen
        document={selectedDocument}
        onBackPress={() => setSelectedDocument(null)}
      />
    );
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
            source={logoImage}
            style={styles.avatar}
          />
          <Text numberOfLines={1} style={[styles.greeting, { color: colors.text }]}>
            Hi, {displayName || 'User'}
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open search"
            onPress={() => {
              closeFabMenu();
              setIsSearchOpen(true);
            }}
            style={styles.headerIcon}>
            <FontAwesome name="search" size={22} color={colors.muted} />
          </Pressable>
          <Pressable
            onPress={onNotificationPress}
            style={[styles.headerIcon, styles.notificationButton]}>
            <FontAwesome name="bell-o" size={21} color={colors.text} />
            {notificationCount > 0 ? (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>
                  {getBadgeCount(notificationCount)}
                </Text>
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
            isLoadingCompanies={isLoadingCompanies}
            selectedCompany={selectedCompany}
            onCompanyInfoPress={() => setActiveTab('company')}
            onCompanySwitcherPress={openCompanySwitcher}
            onQuickAccessItemPress={onQuickAccessItemPress}
            onQuickAccessViewAllPress={onQuickAccessViewAllPress}
          />
        ) : null}
        {activeTab === 'company' ? <CompanyTabContent selectedCompany={selectedCompany} /> : null}
        {activeTab === 'reports' ? <ReportsTabContent /> : null}
        {activeTab === 'billing' ? (
          <BillingTabContent
            onInvoicePress={onInvoicePress}
            onGoHome={() => setActiveTab('home')}
            selectedCompany={selectedCompany}
          />
        ) : null}
        {activeTab === 'documents' ? (
          <DocumentsTabContent
            selectedCompany={selectedCompany}
            onDocumentViewPress={doc => setSelectedDocument(doc)}
          />
        ) : null}
      </ScrollView>

      {isFabMenuOpen ? (
        <>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close quick actions"
            onPress={closeFabMenu}
            style={styles.fabMenuBackdrop}
          />
          <Animated.View
            style={[
              styles.fabMenu,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                bottom: safeAreaInsets.bottom + 168,
                opacity: fabMenuOpacity,
                transform: [
                  { translateY: fabMenuTranslateY },
                  { scale: fabMenuScale },
                ],
              },
            ]}>
            <Pressable style={styles.fabMenuItem}>
              <FontAwesome name="building-o" size={19} color="#2563eb" />
              <Text style={[styles.fabMenuText, { color: colors.text }]}>
                Company
              </Text>
            </Pressable>
            <Pressable style={styles.fabMenuItem}>
              <FontAwesome name="file-text-o" size={19} color="#0f766e" />
              <Text style={[styles.fabMenuText, { color: colors.text }]}>
                Invoice
              </Text>
            </Pressable>
            <Pressable style={styles.fabMenuItem}>
              <FontAwesome name="credit-card" size={19} color="#f59e0b" />
              <Text style={[styles.fabMenuText, { color: colors.text }]}>
                Payment
              </Text>
            </Pressable>
            <Pressable style={styles.fabMenuItem}>
              <FontAwesome name="comments-o" size={19} color="#7c3aed" />
              <Text style={[styles.fabMenuText, { color: colors.text }]}>
                Support
              </Text>
            </Pressable>
          </Animated.View>
        </>
      ) : null}

      <Pressable
        onPress={toggleFabMenu}
        style={[
          styles.fab,
          {
            backgroundColor: colors.activeNav,
            bottom: safeAreaInsets.bottom + 104,
          },
        ]}>
        <Animated.View style={{ transform: [{ rotate: fabIconRotate }] }}>
          <FontAwesome
            name="plus"
            size={24}
            color={colors.text}
            style={styles.fabIcon}
          />
        </Animated.View>
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
              numberOfLines={1}
              adjustsFontSizeToFit
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

      {isCompanySwitcherOpen ? (
        <View style={styles.companySwitcherOverlay}>
          <Pressable
            onPress={closeCompanySwitcher}
            style={[styles.companySwitcherBackdrop, { backgroundColor: colors.backdrop }]}
          />
          <Animated.View
            style={[
              styles.companySwitcherDropdown,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                opacity: companySwitcherOpacity,
                top: safeAreaInsets.top + 236,
                transform: [{ translateY: companySwitcherTranslateY }],
              },
            ]}>
            <View style={styles.companySwitcherHeader}>
              <View>
                <Text style={[styles.companySwitcherTitle, { color: colors.text }]}>
                  Switch company
                </Text>
                <Text style={[styles.companySwitcherSubtitle, { color: colors.muted }]}>
                  Select company context for the dashboard
                </Text>
              </View>
              <Pressable
                onPress={closeCompanySwitcher}
                style={[styles.sheetCloseButton, { backgroundColor: colors.surface }]}>
                <FontAwesome name="close" size={18} color={colors.text} />
              </Pressable>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.companySwitcherList}>
              {isLoadingCompanies ? (
                <Text style={[styles.companySwitcherEmptyText, { color: colors.muted }]}>
                  Loading companies...
                </Text>
              ) : null}
              {!isLoadingCompanies && companyOptions.length === 0 ? (
                <Text style={[styles.companySwitcherEmptyText, { color: colors.muted }]}>
                  No companies available.
                </Text>
              ) : null}
              {!isLoadingCompanies && companyOptions.map(company => {
                const isSelected = selectedCompany?.id === company.id;

                return (
                  <Pressable
                    key={company.id}
                    onPress={() => selectCompanyFromSwitcher(company)}
                    style={[
                      styles.companySwitcherRow,
                      {
                        backgroundColor: colors.surface,
                        borderColor: isSelected ? colors.accentSoft : colors.border,
                      },
                    ]}>
                    <View
                      style={[
                        styles.companySwitcherAvatar,
                        { backgroundColor: company.avatarColor },
                      ]}>
                      <Text
                        style={[
                          styles.companySwitcherAvatarText,
                          { color: company.initialsColor },
                        ]}>
                        {company.initials}
                      </Text>
                    </View>
                    <View style={styles.companySwitcherCopy}>
                      <Text
                        numberOfLines={1}
                        style={[styles.companySwitcherName, { color: colors.text }]}>
                        {company.name}
                      </Text>
                      <Text
                        numberOfLines={1}
                        style={[styles.companySwitcherMeta, { color: colors.muted }]}>
                        {company.companyType} - EIN {company.ein}
                      </Text>
                    </View>
                    {isSelected ? (
                      <FontAwesome name="check-circle" size={20} color={colors.accent} />
                    ) : (
                      <FontAwesome name="angle-right" size={20} color={colors.muted} />
                    )}
                  </Pressable>
                );
              })}
            </ScrollView>
          </Animated.View>
        </View>
      ) : null}
    </View>
  );
}

export default HomeScreen;
