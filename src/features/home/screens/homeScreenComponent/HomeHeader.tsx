import React from 'react';
import { Animated, Image, Pressable, Text, View } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import logoImage from '../../../../assets/images/logo.jpg';
import styles from '../HomeScreen.styles';

type HomeHeaderProps = {
  displayName: string;
  profileImage?: string | null;
  notificationCount: number;
  bellRotation: any;
  onSearchPress: () => void;
  onNotificationPress: () => void;
  onProfilePress: () => void;
  colors: any;
};

export function HomeHeader({
  displayName,
  profileImage,
  notificationCount,
  bellRotation,
  onSearchPress,
  onNotificationPress,
  onProfilePress,
  colors,
}: HomeHeaderProps) {
  return (
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
        onPress={onSearchPress}
        style={styles.headerIcon}>
        <FontAwesome name="search" size={22} color={colors.muted} />
      </Pressable>
      <Pressable
        onPress={onNotificationPress}
        style={[styles.headerIcon, styles.notificationButton]}>
        <Animated.View style={{ transform: [{ rotate: bellRotation }] }}>
          <FontAwesome name="bell-o" size={21} color={colors.text} />
        </Animated.View>
        {notificationCount > 0 ? (
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationBadgeText}>
              {notificationCount > 9 ? '9+' : String(notificationCount)}
            </Text>
          </View>
        ) : null}
      </Pressable>
      <Pressable
        onPress={onProfilePress}
        style={[
          styles.profileButton,
          { backgroundColor: colors.surface, borderColor: colors.accent },
        ]}>
        {profileImage ? (
          <Image
            onError={event => console.log('Profile button avatar failed', event.nativeEvent.error, profileImage)}
            source={{ uri: profileImage }}
            style={styles.profileImage}
          />
        ) : (
          <FontAwesome name="user" size={18} color={colors.accent} />
        )}
      </Pressable>
    </View>
  );
}
