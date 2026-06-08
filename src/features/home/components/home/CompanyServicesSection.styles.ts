import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  sectionTitle: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 32,
    marginBottom: 18,
  },
  horizontalList: {
    gap: 18,
    paddingRight: 18,
  },
  serviceCard: {
    width: 206,
    height: 146,
    overflow: 'hidden',
    borderRadius: 12,
    backgroundColor: '#ffffff',
    padding: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    marginBottom: 10,
    marginLeft: 2,
  },
  serviceTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  serviceCopy: {
    flex: 1,
  },
  serviceTitle: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '600',
  },
  serviceSubtitle: {
    color: '#6b7280',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 5,
  },
  serviceIconWrap: {
    position: 'absolute',
    right: -18,
    bottom: -22,
    width: 126,
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 70,
  },
});

export default styles