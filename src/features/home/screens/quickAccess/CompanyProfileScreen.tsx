import QuickAccessDetailScreen from './QuickAccessDetailScreen';

type CompanyProfileScreenProps = {
  onBackPress: () => void;
};

function CompanyProfileScreen({ onBackPress }: CompanyProfileScreenProps) {
  return (
    <QuickAccessDetailScreen
      color="#38bdf8"
      description="View and manage company profile details, business information, and account records."
      icon="building-o"
      onBackPress={onBackPress}
      title="Company Profile"
    />
  );
}

export default CompanyProfileScreen;
