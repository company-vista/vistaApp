import { StyleSheet, Text, View } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import type { QuickAccessItemId } from '../data/quickAccessItems';
import type { CompanyCardItem } from '../screens/quickAccess/CompanyCard';
import ComplianceStatusSection from './home/ComplianceStatusSection';
import HomeHeroSection from './home/HomeHeroSection';
import OrderServicesSection from './home/OrderServicesSection';
import UpcomingDeadlinesSection from './home/UpcomingDeadlinesSection';

type HomeTabContentProps = {
  isLoadingCompanies?: boolean;
  onCompanySwitcherPress: () => void;
  onQuickAccessItemPress: (itemId: QuickAccessItemId) => void;
  onQuickAccessViewAllPress: () => void;
  selectedCompany?: CompanyCardItem | null;
};

function HomeTabContent({
  isLoadingCompanies = false,
  onCompanySwitcherPress,
  onQuickAccessItemPress,
  onQuickAccessViewAllPress,
  selectedCompany,
}: HomeTabContentProps) {
  return (
    <View style={styles.container}>
      <HomeHeroSection
        isLoadingCompanies={isLoadingCompanies}
        onCompanySwitcherPress={onCompanySwitcherPress}
        selectedCompany={selectedCompany}
      />

      <View style={styles.alert}>
        <FontAwesome name="exclamation-circle" size={15} color="#A32D2D" />
        <View style={styles.alertCopy}>
          <Text style={styles.alertTitle}>Action required</Text>
          <Text style={styles.alertText}>
            Delaware Franchise Tax is overdue. Late fees of $200/month apply.
            File immediately to maintain Good Standing.
          </Text>
        </View>
        <Text style={styles.alertAction}>Fix</Text>
      </View>
      
      <ComplianceStatusSection
        companyId={selectedCompany?.id}
        onViewAllPress={onQuickAccessViewAllPress}
      />
      <OrderServicesSection onQuickAccessItemPress={onQuickAccessItemPress} />
      <UpcomingDeadlinesSection />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 14,
  },
  alert: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    borderWidth: 1,
    borderColor: '#F7C1C1',
    borderRadius: 10,
    backgroundColor: '#FCEBEB',
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  alertCopy: {
    flex: 1,
  },
  alertTitle: {
    color: '#791F1F',
    fontSize: 11,
    fontWeight: '500',
  },
  alertText: {
    color: '#501313',
    fontSize: 11,
    lineHeight: 16,
    marginTop: 1,
  },
  alertAction: {
    color: '#A32D2D',
    fontSize: 11,
    fontWeight: '500',
    marginTop: 1,
  },
});

export default HomeTabContent;
