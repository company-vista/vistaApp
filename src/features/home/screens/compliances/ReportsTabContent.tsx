import TabPlaceholder from '../../components/TabPlaceholder';
import type { CompanyCardItem } from '../quickAccess/CompanyCard';

type ReportsTabContentProps = {
  selectedCompany?: CompanyCardItem | null;
};

function ReportsTabContent({ selectedCompany }: ReportsTabContentProps) {
  return <TabPlaceholder title="Compliances" icon="check-square-o" companyId={selectedCompany?.id} />;
}

export default ReportsTabContent;
