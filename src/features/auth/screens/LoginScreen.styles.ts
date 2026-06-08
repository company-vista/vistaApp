import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  brandMark: {
    width: 250,
    height: 66,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#0f172a', // 0f172a
    borderRadius: 4,
    padding: 2,
    // backgroundColor: '#0f766e',
    marginBottom: 48,
  },
  brandLogo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 4,
  },
  header: {
    alignItems: 'center',
    marginBottom: 28,
  },
  title: {
    color: '#f8fafc',
    fontSize: 30,
    fontWeight: '400',
    textAlign: 'center',
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 8,
    textAlign: 'center',
  },
  form: {
    width: '100%',
    maxWidth: 360,
    gap: 18,
  },
  field: {
    gap: 8,
  },
  label: {
    color: '#cbd5e1a9', // cbd5e1
    fontSize: 14,
    fontWeight: '700',
  },
  inputWrap: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 12,
    backgroundColor: '#111827',
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    height: '100%',
    padding: 0,
    color: '#f8fafc',
    fontSize: 16,
  },
  passwordToggle: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -6,
  },
  inputError: {
    borderColor: '#f87171',
  },
  errorText: {
    color: '#fca5a5',
    fontSize: 12,
    fontWeight: '700',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 54,
    borderRadius: 14,
    backgroundColor: '#14b8a6',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#042f2e',
    fontSize: 16,
    fontWeight: '800',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#334155',
  },
  dividerText: {
    color: '#cbd5e1',
    fontSize: 14,
    fontWeight: '700',
  },
  googleAuthButton: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    borderWidth: 1,
    // borderColor: '#cbd5e1',
    borderRadius: 12,
    backgroundColor: '#ffffffa2',
  },
  googleAuthText: {
    color: '#475569',
    fontSize: 14,
    fontWeight: '700',
  },
  authLinkText: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  authLink: {
    color: '#5eead4',
    fontWeight: '800',
  },
  socialSection: {
    alignItems: 'center',
    gap: 12,
    marginTop: 10,
  },
  socialTitle: {
    color: '#64748b',
    fontSize: 13,
    fontWeight: '700',
  },
  socialRow: {
    flexDirection: 'row',
    gap: 12,
  },
  socialButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  facebookButton: {
    backgroundColor: '#1877f2',
  },
  instagramButton: {
    backgroundColor: '#e1306c',
  },
  linkedinButton: {
    backgroundColor: '#0a66c2',
  },
});

export default styles;