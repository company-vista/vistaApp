import { StyleSheet, Text, View } from 'react-native';


import { useThemeColors } from '../../../theme/colors';

function CompanyTabContent() {
  const colors = useThemeColors();

  return (
    <View style={styles.container}>
      <Text style={[styles.text, { color: colors.muted }]}>
        Company page
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 220,
  },
  text: {
    color: '#64748b',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CompanyTabContent;
