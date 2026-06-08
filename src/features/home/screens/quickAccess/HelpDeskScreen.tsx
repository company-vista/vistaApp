import QuickAccessDetailScreen from './QuickAccessDetailScreen';

type HelpDeskScreenProps = {
  onBackPress: () => void;
};

function HelpDeskScreen({ onBackPress }: HelpDeskScreenProps) {
  return (
    <QuickAccessDetailScreen
      color="#22c55e"
      description="Get support, raise help requests, and find answers for common service questions."
      icon="comments-o"
      onBackPress={onBackPress}
      title="Help Desk"
    />
  );
}

export default HelpDeskScreen;
