import React from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import styles from '../HomeScreen.styles';

type SearchModalProps = {
  isOpen: boolean;
  searchQuery: string;
  onSearchQueryChange: (text: string) => void;
  onClose: () => void;
  colors: any;
  safeAreaInsets: any;
};

export function SearchModal({
  isOpen,
  searchQuery,
  onSearchQueryChange,
  onClose,
  colors,
  safeAreaInsets,
}: SearchModalProps) {
  if (!isOpen) return null;

  return (
    <View style={styles.searchOverlay}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Close search"
        onPress={onClose}
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
            onPress={onClose}
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
            onChangeText={onSearchQueryChange}
            placeholder="Search services, invoices, reports..."
            placeholderTextColor={colors.muted}
            returnKeyType="search"
            style={[styles.searchInput, { color: colors.text }]}
          />
          {searchQuery.length > 0 ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Clear search"
              onPress={() => onSearchQueryChange('')}
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
  );
}
