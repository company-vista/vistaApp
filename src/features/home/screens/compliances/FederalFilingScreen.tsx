import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Switch,
  SafeAreaView,
  Alert,
  Pressable, // TouchableOpacity se behtar click handle karne ke liye
} from 'react-native';
import BackButton from '../../../../components/buttons/BackButton';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { pick, types } from '@react-native-documents/picker';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { useAppSelector } from '../../../../store/hooks';
import { fetchClientCompanies } from '../../api/clientProfileApi';
import { API_BASE_URL } from '../../../../config/api';

type FederalFilingScreenProps = {
  onBackPress: () => void;
  selectedAction?: {
    title: string;
    subtitle: string;
    status: string;
    date: string;
    details: { label: string; value: string; icon?: string }[];
    companyId?: string | null;
    price?: number;
    years?: number;
  } | null;
};

type SelectedFile = {
  uri: string;
  name: string;
  type?: string | null;
};

export default function FederalTaxFiling({ onBackPress, selectedAction }: FederalFilingScreenProps) {
  const userCompanies = useAppSelector(state => state.auth.user?.companies ?? []);
  const token = useAppSelector(state => state.auth.token);

  // States
  const [company, setCompany] = useState('Select company');
  const [companyOptions, setCompanyOptions] = useState<Array<{ id: string; label: string }>>([]);
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const [taxYear, setTaxYear] = useState('2025 - 2026');
  const [isTaxYearDropdownOpen, setIsTaxYearDropdownOpen] = useState(false);
  const [bookkeeping, setBookkeeping] = useState(false);
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [selectedBankStatements, setSelectedBankStatements] = useState<SelectedFile[]>([]);
  const [selectedFinancialStatements, setSelectedFinancialStatements] = useState<SelectedFile[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<{ status: string; message: string } | null>(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(selectedAction?.companyId ?? null);
  const companiesLoadedKeyRef = useRef<string | null>(null);

  const buildCompanyOptions = (companies: Array<Record<string, any>>) =>
    companies.map((companyItem, index) => {
      const label =
        companyItem?.name ??
        companyItem?.companyName ??
        companyItem?.legalName ??
        companyItem?.businessName ??
        companyItem?.company?.name ??
        `Company ${index + 1}`;

      return {
        id: companyItem?._id ?? companyItem?.id ?? `${label}-${index}`,
        label,
      };
    });

  useEffect(() => {
    let isMounted = true;
    const authKey = token ?? 'guest';

    if (companiesLoadedKeyRef.current === authKey) {
      return () => {
        isMounted = false;
      };
    }

    companiesLoadedKeyRef.current = authKey;

    const loadCompanies = async () => {
      const fallbackCompanies = buildCompanyOptions(userCompanies as Array<Record<string, any>>);

      if (!token) {
        if (isMounted) {
          setCompanyOptions(fallbackCompanies);
        }
        return;
      }

      try {
        const result = await fetchClientCompanies({ token });

        if (!isMounted) {
          return;
        }

        const loadedCompanies = result?.companies?.length > 0 ? result.companies : userCompanies;
        const options = buildCompanyOptions(loadedCompanies as Array<Record<string, any>>);
        setCompanyOptions(options);
      } catch (error) {
        if (isMounted) {
          setCompanyOptions(fallbackCompanies);
        }
      }
    };

    loadCompanies();

    return () => {
      isMounted = false;
    };
  }, [token]);

  useEffect(() => {
    if (companyOptions.length > 0) {
      const defaultCompany = companyOptions.find(option => option.id === selectedCompanyId) ?? companyOptions[0];
      setCompany(prevCompany => {
        if (prevCompany === 'Select company' || !companyOptions.some(option => option.label === prevCompany)) {
          setSelectedCompanyId(defaultCompany.id);
          return defaultCompany.label;
        }

        const matchedOption = companyOptions.find(option => option.label === prevCompany);
        if (matchedOption) {
          setSelectedCompanyId(matchedOption.id);
        }
        return prevCompany;
      });
    }
  }, [companyOptions, selectedCompanyId]);

  const taxYearOptions = ['2023 - 2024', '2024 - 2025', '2025 - 2026', '2026 - 2027'];

  const handlePickDocument = async (type: 'bank' | 'financial') => {
    try {
      const response = await pick({
        type: [types.pdf, types.images, types.docx, types.plainText],
        allowMultiSelection: true,
      });

      const selectedFiles = response
        .filter(item => item?.uri)
        .map(item => ({
          uri: item.uri,
          name: item.name ?? `${type === 'bank' ? 'bank-statement' : 'financial-statement'}-${Date.now()}`,
          type: item.type ?? 'application/octet-stream',
        }));

      if (selectedFiles.length === 0) {
        Alert.alert('No files selected', 'Please choose at least one file.');
        return;
      }

      if (type === 'bank') {
        setSelectedBankStatements(prev => [...prev, ...selectedFiles]);
      } else {
        setSelectedFinancialStatements(prev => [...prev, ...selectedFiles]);
      }

      Alert.alert('Files selected', `${selectedFiles.length} file(s) added.`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to open the picker right now.';
      Alert.alert('Document picker error', message);
    }
  };

  const removeSelectedFile = (type: 'bank' | 'financial', indexToRemove: number) => {
    if (type === 'bank') {
      setSelectedBankStatements(prev => prev.filter((_, index) => index !== indexToRemove));
    } else {
      setSelectedFinancialStatements(prev => prev.filter((_, index) => index !== indexToRemove));
    }
  };

  const handleSubmit = async () => {
    const selectedCompany = selectedCompanyId ?? companyOptions.find(option => option.label === company)?.id ?? null;

    if (!selectedCompany) {
      Toast.show({ type: 'error', text1: 'Please select a company' });
      return;
    }

    if (!taxYear) {
      Toast.show({ type: 'error', text1: 'No pending tax year is available for filing' });
      return;
    }

    if (selectedBankStatements.length === 0) {
      Toast.show({ type: 'error', text1: 'Please upload at least one bank statement' });
      return;
    }

    if (bookkeeping && selectedFinancialStatements.length === 0) {
      Toast.show({ type: 'error', text1: 'Please upload financial statements (bookkeeping selected)' });
      return;
    }

    setSubmitting(true);
    const formData = new FormData();

    formData.append('companyId', selectedCompany);
    formData.append("taxYear", taxYear.split(" - ")[0]);
    formData.append('hasBookkeeping', bookkeeping ? 'true' : 'false');
    formData.append('notes', additionalNotes.trim());

    selectedBankStatements.forEach(file => {
      formData.append('bankStatements', {
        uri: file.uri,
        name: file.name,
        type: file.type ?? 'application/octet-stream',
      } as any);
    });

    selectedFinancialStatements.forEach(file => {
      formData.append('financials', {
        uri: file.uri,
        name: file.name,
        type: file.type ?? 'application/octet-stream',
      } as any);
    });

    try {
      if (!token) {
        Toast.show({ type: 'error', text1: 'Authentication token is missing. Please sign in again.' });
        setSubmitting(false);
        return;
      }

      const response = await axios.post(`${API_BASE_URL}/api/federal-filing/submit`, formData, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
          'x-auth-token': token,
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.data?.success) {
        Toast.show({
          type: 'success',
          text1: response.data.message || 'Federal filing submitted successfully!',
        });

        setSelectedBankStatements([]);
        setSelectedFinancialStatements([]);
        setAdditionalNotes('');
        setBookkeeping(false);
        setSubmissionStatus({
          status: 'submitted',
          message: 'Your filing has been submitted and is under review.',
        });

        setTimeout(() => setSubmissionStatus(null), 5000);
      } else {
        Toast.show({
          type: 'error',
          text1: response.data?.message || 'Failed to submit filing',
        });
      }
    } catch (error: any) {
      console.error('Error submitting filing:', error);
      Toast.show({
        type: 'error',
        text1: error?.response?.data?.message || 'Failed to submit filing',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <BackButton onPress={onBackPress} />
        <View style={styles.topBarText}>
          <Text style={styles.headerTitle}>{selectedAction?.title ?? 'Federal Tax Filing'}</Text>
          <Text style={styles.headerSubtitle}>{selectedAction?.subtitle ?? 'Submit your annual federal tax return documents'}</Text>
        </View>
        <View style={styles.topBarSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIconContainer}>
            <FontAwesome name="file-text" color="#fff" size={24} />
          </View>
          <View>
            <Text style={styles.headerTitle}>Federal Tax Filing</Text>
            <Text style={styles.headerSubtitle}>Submit your annual federal tax return documents</Text>
          </View>
        </View>

        {/* Status Tracker */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Status Tracker</Text>
          <View style={styles.trackerContainer}>
            <View style={styles.stepRow}>
              <FontAwesome name="check-circle" color="#10B981" size={20} />
              <Text style={[styles.stepText, styles.completedStep]}>Company Selection</Text>
            </View>
            <View style={styles.stepLine} />
            <View style={styles.stepRow}>
              <FontAwesome name="check-circle" color="#10B981" size={20} />
              <Text style={[styles.stepText, styles.completedStep]}>Document Upload</Text>
            </View>
            <View style={styles.stepLineActive} />
            <View style={styles.stepRow}>
              <FontAwesome name="clock-o" color="#4F46E5" size={20} />
              <Text style={[styles.stepText, styles.activeStep]}>Submission (Current)</Text>
            </View>
          </View>
        </View>

        {/* Select Company Dropdown */}
        <View style={[styles.card, { zIndex: 20 }]}>
          <View style={styles.labelRow}>
            <FontAwesome name="building" color="#4F46E5" size={18} style={styles.fieldIcon} />
            <Text style={styles.fieldLabel}>Select Company</Text>
          </View>
          <Pressable
            style={styles.dropdownSelector}
            onPress={() => setIsCompanyDropdownOpen(prev => !prev)}
          >
            <Text style={styles.selectorText}>{company}</Text>
            <FontAwesome name={isCompanyDropdownOpen ? 'chevron-up' : 'chevron-down'} size={14} color="#64748B" />
          </Pressable>
          {isCompanyDropdownOpen ? (
            <View style={styles.dropdownList}>
              {companyOptions.length > 0 ? (
                companyOptions.map(option => (
                  <Pressable
                    key={option.id}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setCompany(option.label);
                      setSelectedCompanyId(option.id);
                      setIsCompanyDropdownOpen(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{option.label}</Text>
                  </Pressable>
                ))
              ) : (
                <View style={styles.dropdownItem}>
                  <Text style={styles.dropdownItemText}>No companies available</Text>
                </View>
              )}
            </View>
          ) : null}
        </View>

        {/* Tax Year Dropdown */}
        <View style={[styles.card, { zIndex: 10 }]}>
          <View style={styles.labelRow}>
            <FontAwesome name="calendar" color="#4F46E5" size={18} style={styles.fieldIcon} />
            <Text style={styles.fieldLabel}>Tax Year</Text>
          </View>
          <Pressable
            style={styles.dropdownSelector}
            onPress={() => setIsTaxYearDropdownOpen(prev => !prev)}
          >
            <Text style={styles.selectorText}>{taxYear}</Text>
            <FontAwesome name={isTaxYearDropdownOpen ? 'chevron-up' : 'chevron-down'} size={14} color="#64748B" />
          </Pressable>
          {isTaxYearDropdownOpen ? (
            <View style={styles.dropdownList}>
              {taxYearOptions.map(option => (
                <Pressable
                  key={option}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setTaxYear(option);
                    setIsTaxYearDropdownOpen(false);
                  }}
                >
                  <Text style={styles.dropdownItemText}>{option}</Text>
                </Pressable>
              ))}
            </View>
          ) : null}
          <Text style={styles.helpText}>Filing deadline: April 15, 2026</Text>
          <Text style={styles.subHelpText}>Only pending tax years are shown here.</Text>
        </View>

        {/* Bookkeeping Service Switch */}
        <View style={[styles.card, styles.rowBetween]}>
          <View style={{ flex: 1, paddingRight: 10 }}>
            <View style={styles.labelRow}>
              <FontAwesome name="book" color="#4F46E5" size={18} style={styles.fieldIcon} />
              <Text style={styles.fieldLabel}>Bookkeeping Service</Text>
            </View>
            <Text style={styles.subHelpText}>Enable if you need bookkeeping services for this filing</Text>
          </View>
          <Switch
            value={bookkeeping}
            onValueChange={(value) => setBookkeeping(value)}
            trackColor={{ false: '#D1D5DB', true: '#C7D2FE' }}
            thumbColor={bookkeeping ? '#4F46E5' : '#F3F4F6'}
          />
        </View>

        {/* Bank Statements Upload Area */}
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <View style={styles.labelRow}>
              <FontAwesome name="upload" color="#4F46E5" size={18} style={styles.fieldIcon} />
              <Text style={styles.fieldLabel}>Bank Statements</Text>
            </View>
            <Text style={styles.requiredBadge}>* Required</Text>
          </View>
          
          <Pressable 
            style={({ pressed }) => [styles.uploadArea, pressed && { opacity: 0.7 }]} 
            onPress={() => handlePickDocument('bank')}
          >
            <FontAwesome name="upload" color="#9CA3AF" size={32} />
            <Text style={styles.uploadText}>
              {selectedBankStatements.length > 0 ? `Selected: ${selectedBankStatements.length} file(s)` : 'Click to upload bank statements'}
            </Text>
            <Text style={styles.uploadSubText}>PDF, JPG, PNG, DOC (Max 10MB each)</Text>
            {selectedBankStatements.length > 0 ? (
              <View style={styles.fileList}>
                {selectedBankStatements.map((file, index) => (
                  <View key={`${file.uri}-${index}`} style={styles.fileItem}>
                    <FontAwesome name="file" size={12} color="#4F46E5" />
                    <Text numberOfLines={1} style={styles.fileItemText}>{file.name}</Text>
                    <Pressable onPress={() => removeSelectedFile('bank', index)} style={styles.removeButton}>
                      <FontAwesome name="times" size={12} color="#EF4444" />
                    </Pressable>
                  </View>
                ))}
              </View>
            ) : null}
          </Pressable>
        </View>

        {/* Financial Statements (Conditional) */}
        {bookkeeping ? (
          <View style={styles.card}>
            <View style={styles.rowBetween}>
              <View style={styles.labelRow}>
                <FontAwesome name="file-text" color="#4F46E5" size={18} style={styles.fieldIcon} />
                <Text style={styles.fieldLabel}>Financial Statements</Text>
              </View>
              <Text style={styles.requiredBadge}>* Required</Text>
            </View>

            <Pressable 
              style={({ pressed }) => [styles.uploadArea, pressed && { opacity: 0.7 }]} 
              onPress={() => handlePickDocument('financial')}
            >
              <FontAwesome name="file-text" color="#9CA3AF" size={32} />
              <Text style={styles.uploadText}>
                {selectedFinancialStatements.length > 0 ? `Selected: ${selectedFinancialStatements.length} file(s)` : 'Upload financial statements'}
              </Text>
              <Text style={styles.uploadSubText}>PDF, JPG, PNG, DOC (Max 10MB each)</Text>
              {selectedFinancialStatements.length > 0 ? (
                <View style={styles.fileList}>
                  {selectedFinancialStatements.map((file, index) => (
                    <View key={`${file.uri}-${index}`} style={styles.fileItem}>
                      <FontAwesome name="file" size={12} color="#4F46E5" />
                      <Text numberOfLines={1} style={styles.fileItemText}>{file.name}</Text>
                      <Pressable onPress={() => removeSelectedFile('financial', index)} style={styles.removeButton}>
                        <FontAwesome name="times" size={12} color="#EF4444" />
                      </Pressable>
                    </View>
                  ))}
                </View>
              ) : null}
            </Pressable>
          </View>
        ) : null}

        {/* Additional Notes Input */}
        <View style={styles.card}>
          <View style={styles.labelRow}>
            <FontAwesome name="file-text" color="#4F46E5" size={18} style={styles.fieldIcon} />
            <Text style={styles.fieldLabel}>Additional Notes</Text>
          </View>
          <TextInput
            style={styles.textArea}
            multiline={true}
            numberOfLines={4}
            placeholder="Any additional information you'd like to share with our tax team..."
            placeholderTextColor="#9CA3AF"
            value={additionalNotes}
            onChangeText={(text) => setAdditionalNotes(text)}
          />
        </View>

        {/* Need Assistance Support Box */}
        <View style={styles.supportBox}>
          <View style={styles.labelRow}>
            <FontAwesome name="question-circle" color="#fff" size={20} style={styles.fieldIcon} />
            <Text style={styles.supportTitle}>Need Assistance?</Text>
          </View>
          <Text style={styles.supportDesc}>
            Our tax experts are here to help you with your federal filing requirements.
          </Text>
          <Pressable style={styles.supportButton}>
            <Text style={styles.supportButtonText}>Contact Support</Text>
          </Pressable>
        </View>

        {/* Submit Button */}
        <Pressable
          style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          <Text style={styles.submitButtonText}>{submitting ? 'Submitting...' : 'Submit Federal Filing'}</Text>
        </Pressable>
        {submissionStatus ? <Text style={styles.statusMessage}>{submissionStatus.message}</Text> : null}

        {/* Footer Text */}
        <Text style={styles.footerDisclaimer}>
          By submitting, you confirm that the information provided is accurate and complete.
        </Text>

      </ScrollView>
    </SafeAreaView>
  );
}

// Mobile Responsive Styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  topBarText: {
    flex: 1,
    marginLeft: 12,
  },
  topBarSpacer: {
    width: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  headerIconContainer: {
    backgroundColor: '#4F46E5',
    padding: 10,
    borderRadius: 12,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 12,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  fieldIcon: {
    marginRight: 6,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#F8FAFC',
  },
  dropdownList: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#334155',
  },
  selectorText: {
    fontSize: 14,
    color: '#334155',
  },
  helpText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 6,
    fontWeight: '500',
  },
  subHelpText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  requiredBadge: {
    fontSize: 11,
    color: '#EF4444',
    fontWeight: '600',
  },
  uploadArea: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#CBD5E1',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    marginTop: 4,
  },
  uploadText: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '500',
    marginTop: 8,
    textAlign: 'center',
  },
  uploadSubText: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  fileList: {
    width: '100%',
    marginTop: 10,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 6,
  },
  fileItemText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 12,
    color: '#334155',
  },
  removeButton: {
    marginLeft: 8,
    padding: 4,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
    minHeight: 80,
    backgroundColor: '#F8FAFC',
    textAlignVertical: 'top',
    fontSize: 14,
    color: '#334155',
  },
  trackerContainer: {
    paddingLeft: 4,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepText: {
    fontSize: 13,
    marginLeft: 8,
  },
  completedStep: {
    color: '#64748B',
    textDecorationLine: 'line-through',
  },
  activeStep: {
    color: '#4F46E5',
    fontWeight: '600',
  },
  stepLine: {
    width: 2,
    height: 15,
    backgroundColor: '#10B981',
    marginLeft: 9,
    marginVertical: 2,
  },
  stepLineActive: {
    width: 2,
    height: 15,
    backgroundColor: '#4F46E5',
    marginLeft: 9,
    marginVertical: 2,
  },
  supportBox: {
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  supportTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  supportDesc: {
    fontSize: 12,
    color: '#E0E7FF',
    lineHeight: 16,
    marginBottom: 12,
  },
  supportButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  supportButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  footerDisclaimer: {
    fontSize: 11,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 14,
  },
  submitButtonDisabled: {
    backgroundColor: '#A5B4FC', // Submitting ke waqt button ka color light karne ke liye
    shadowOpacity: 0,
    elevation: 0,
  },
  statusMessage: {
    fontSize: 13,
    color: '#10B981', // Success message ke liye green color
    textAlign: 'center',
    marginTop: 10,
    fontWeight: '600',
  },
});