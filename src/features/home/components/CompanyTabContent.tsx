import CompanyDetailScreen, { type CompanyDetailSection } from './CompanyDetailScreen';
import type { CompanyCardItem } from '../screens/quickAccess/CompanyCard';

type CompanyTabContentProps = {
  onSectionPress?: (section: CompanyDetailSection) => void;
  selectedCompany: CompanyCardItem | null;
};

function CompanyTabContent({ onSectionPress, selectedCompany }: CompanyTabContentProps) {
  return (
    <CompanyDetailScreen
      selectedCompany={selectedCompany}
      onSectionPress={onSectionPress}
    />
  );
}

export default CompanyTabContent;
