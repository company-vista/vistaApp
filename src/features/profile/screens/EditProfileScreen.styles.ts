import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    color: '#111827',
    fontSize: 20,
    fontWeight: '500',
  },
  content: {
    paddingTop: 24,
  },
  avatarCard: {
    alignItems: 'center',
    borderRadius: 18,
    backgroundColor: '#ffffff',
    padding: 24,
  },
  avatarWrap: {
    position: 'relative',
    width: 104,
    height: 104,
  },
  avatar: {
    width: 104,
    height: 104,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#7dd3fc',
    borderRadius: 52,
    backgroundColor: '#ecfeff',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  cameraButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderRadius: 16,
    backgroundColor: '#0f766e',
  },
  formCard: {
    borderRadius: 18,
    backgroundColor: '#ffffff',
    marginTop: 18,
    padding: 16,
    gap: 14,
  },
  inputGroup: {
    gap: 7,
  },
  inputLabel: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '800',
  },
  inputRow: {
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 14,
    backgroundColor: '#ecfeff',
    paddingHorizontal: 14,
  },
  input: {
    flex: 1,
    color: '#111827',
    fontSize: 15,
    fontWeight: '600',
    paddingVertical: 0,
  },
  saveButton: {
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: '#0f766e',
    marginTop: 24,
  },
  saveText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '900',
  },
});

export default styles;
