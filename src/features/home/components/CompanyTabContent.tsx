import { StyleSheet, View } from 'react-native';

import CompanyDetailScreen, { type CompanyDetailSection } from './CompanyDetailScreen';
import type { CompanyCardItem } from '../screens/quickAccess/CompanyCard';

type CompanyTabContentProps = {
  onSectionPress?: (section: CompanyDetailSection) => void;
  selectedCompany: CompanyCardItem | null;
};

function CompanyTabContent({ onSectionPress, selectedCompany }: CompanyTabContentProps) {
  return (
    <View style={styles.container}>
      <CompanyDetailScreen
        selectedCompany={selectedCompany}
        onSectionPress={onSectionPress}
      />
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
