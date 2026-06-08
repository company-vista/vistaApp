import QuickAccessDetailScreen from './QuickAccessDetailScreen';

type BusinessReportsScreenProps = {
  onBackPress: () => void;
};

function BusinessReportsScreen({ onBackPress }: BusinessReportsScreenProps) {
  return (
    <QuickAccessDetailScreen
      color="#f59e0b"
      description="Review business reports, summaries, and performance insights for your account."
      icon="bar-chart"
      onBackPress={onBackPress}
      title="Business Reports"
    />
  );
}

export default BusinessReportsScreen;
