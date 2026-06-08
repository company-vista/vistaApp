import CompanyServicesSection from './home/CompanyServicesSection';
import PromotionCard from './home/PromotionCard';
import QuickAccessSection from './home/QuickAccessSection';
import RecentActivitySection from './home/RecentActivitySection';
import WelcomeCard from './home/WelcomeCard';
import type { QuickAccessItemId } from '../data/quickAccessItems';

type HomeTabContentProps = {
  onQuickAccessItemPress: (itemId: QuickAccessItemId) => void;
  onQuickAccessViewAllPress: () => void;
};

function HomeTabContent({
  onQuickAccessItemPress,
  onQuickAccessViewAllPress,
}: HomeTabContentProps) {
  return (
    <>
      <WelcomeCard />
      <CompanyServicesSection />
      <QuickAccessSection
        onItemPress={onQuickAccessItemPress}
        onViewAllPress={onQuickAccessViewAllPress}
      />
      <RecentActivitySection />
      <PromotionCard />
    </>
  );
}

export default HomeTabContent;
