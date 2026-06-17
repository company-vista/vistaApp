import { StyleSheet, Text, View } from 'react-native';

import { useThemeColors } from '../../../theme/colors';
import CompanyDetailScreen from './CompanyDetailScreen';
import type { CompanyCardItem } from '../screens/quickAccess/CompanyCard';

type CompanyTabContentProps = {
  selectedCompany: CompanyCardItem | null;
};

function CompanyTabContent({ selectedCompany }: CompanyTabContentProps) {
  const colors = useThemeColors();

  return (
    <View style={styles.container}>
      <CompanyDetailScreen selectedCompany={selectedCompany} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 'auto',
    // alignItems: 'center',
    // justifyContent: 'center',
    // minHeight: 220,
    marginTop: 40
  },
  text: {
    color: '#64748b',
    // fontSize: 16,
    fontWeight: '600',
  },
});

export default CompanyTabContent;
