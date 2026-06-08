import QuickAccessDetailScreen from './QuickAccessDetailScreen';

type InvoiceCenterScreenProps = {
  onBackPress: () => void;
};

function InvoiceCenterScreen({ onBackPress }: InvoiceCenterScreenProps) {
  return (
    <QuickAccessDetailScreen
      color="#4f7cff"
      description="Track invoices, payment status, billing records, and recent invoice activity."
      icon="file-text-o"
      onBackPress={onBackPress}
      title="Invoice Center"
    />
  );
}

export default InvoiceCenterScreen;
