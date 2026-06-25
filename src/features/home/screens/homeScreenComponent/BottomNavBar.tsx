import React from 'react';
import { Pressable, Text, View } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import styles from '../HomeScreen.styles';

export type TabId = 'home' | 'company' | 'reports' | 'billing' | 'documents' | 'more';

const tabs: Array<{ id: TabId; title: string; icon: string }> = [
  { id: 'home', title: 'Home', icon: 'home' },
  { id: 'reports', title: 'Compliances', icon: 'check-square-o' },
  { id: 'billing', title: 'Invoices', icon: 'file-text-o' },
  { id: 'documents', title: 'Documents', icon: 'folder-o' },
  { id: 'more', title: 'More', icon: 'ellipsis-h' },
];

type BottomNavBarProps = {
  activeTab: TabId;
  isMoreOpen: boolean;
  onTabPress: (tabId: TabId) => void;
  colors: any;
  safeAreaInsets: any;
};

export function BottomNavBar({
  activeTab,
  isMoreOpen,
  onTabPress,
  colors,
  safeAreaInsets,
}: BottomNavBarProps) {
  return (
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
          onPress={() => onTabPress(tab.id)}
          style={styles.navItem}>
          <FontAwesome
            name={tab.icon}
            size={22}
            style={{ width: 24, textAlign: 'center' }}
            color={
              activeTab === tab.id || (tab.id === 'more' && isMoreOpen)
                ? colors.accent
                : colors.muted
            }
          />
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            style={[
              styles.navText,
              { color: activeTab === tab.id || (tab.id === 'more' && isMoreOpen) ? colors.accent : colors.muted },
              activeTab === tab.id || (tab.id === 'more' && isMoreOpen) ? styles.activeNavText : null,
            ]}>
            {tab.title}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
