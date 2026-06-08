import { Pressable, StyleSheet, Text, View } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { quickAccessItems, type QuickAccessItemId } from '../../data/quickAccessItems';
import { useThemeColors } from '../../../../theme/colors';

type QuickAccessSectionProps = {
  onItemPress: (itemId: QuickAccessItemId) => void;
  onViewAllPress: () => void;
};

function QuickAccessSection({
  onItemPress,
  onViewAllPress,
}: QuickAccessSectionProps) {
  const colors = useThemeColors();
  const visibleItems = quickAccessItems.slice(0, 4);

  return (
    <>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Access</Text>
        <Pressable onPress={onViewAllPress} style={styles.viewAllButton}>
          <Text style={[styles.viewAllText, { color: colors.danger }]}>View all</Text>
        </Pressable>
      </View>
      <View style={styles.favouritesGrid}>
        {visibleItems.map(item => (
          <Pressable
            key={item.title}
            onPress={() => onItemPress(item.id)}
            style={[
              styles.favouriteCard,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}>
            <FontAwesome name={item.icon} size={24} color={item.color} />
            <Text style={[styles.favouriteTitle, { color: colors.text }]}>
              {item.title}
            </Text>
          </Pressable>
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 32,
    marginBottom: 18,
  },
  sectionTitle: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '600',
  },
  viewAllButton: {
    minHeight: 34,
    justifyContent: 'center',
    borderRadius: 17,
    paddingHorizontal: 4,
  },
  viewAllText: {
    color: '#dc2626',
    fontSize: 14,
    fontWeight: '900',
  },
  favouritesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  favouriteCard: {
    width: '47.8%',
    minHeight: 92,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#d8b4fe',
    borderRadius: 12,
    backgroundColor: '#ffffff',
    padding: 10,
  },
  favouriteTitle: {
    color: '#111827',
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 19,
    marginTop: 8,
    textAlign: 'center',
  },
});

export default QuickAccessSection;
