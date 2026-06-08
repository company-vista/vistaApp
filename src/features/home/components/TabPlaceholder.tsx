import { StyleSheet, Text, View } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { useThemeColors } from '../../../theme/colors';
import styles from './TabPlaceholder.styles';

type TabPlaceholderProps = {
  icon: string;
  title: string;
};

function TabPlaceholder({ icon, title }: TabPlaceholderProps) {
  const colors = useThemeColors();

  return (
    <View style={[styles.placeholderCard, { backgroundColor: colors.surface }]}>
      <View style={[styles.placeholderIcon, { backgroundColor: colors.accentSoft }]}>
        <FontAwesome name={icon} size={28} color={colors.accent} />
      </View>
      <Text style={[styles.placeholderTitle, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.placeholderText, { color: colors.muted }]}>
        {title} content will appear here.
      </Text>
    </View>
  );
}


export default TabPlaceholder;
