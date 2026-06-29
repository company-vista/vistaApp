import React, { useState } from 'react';
import { BackButton } from '../../../../components/buttons';
import { useThemeColors } from '../../../../theme/colors';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';

// ─── Types ───────────────────────────────────────────────────────────────────

type FieldKey =
  | 'name'
  | 'alt'
  | 'reg'
  | 'web'
  | 'act'
  | 'intro'
  | 'sh'
  | 'addr'
  | 'rep';

interface Field {
  key: FieldKey;
  label: string;
  shortLabel: string;
}

interface ShareholderForm {
  firstName: string;
  lastName: string;
  designation: string;
  phone: string;
  dob: string;
  sharePercent: string;
  address1: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface FormValues {
  name: string;
  alt: string;
  reg: string;
  web: string;
  act: string;
  intro: string;
  addr: string;
  rep: string;
  sh: ShareholderForm;
}

interface ThemeColors {
  background: string;
  surface: string;
  text: string;
  muted: string;
  primary: string;
  border: string;
  mode: 'light' | 'dark';
  inputPlaceholder: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const FIELDS: Field[] = [
  { key: 'name', label: 'Company name', shortLabel: 'Company' },
  { key: 'alt', label: 'Alternate name', shortLabel: 'Alternate' },
  { key: 'reg', label: 'Registration number', shortLabel: 'Reg. No.' },
  { key: 'web', label: 'Company website', shortLabel: 'Website' },
  { key: 'act', label: 'Principal activity', shortLabel: 'Activity' },
  { key: 'intro', label: 'Company introduction', shortLabel: 'Intro' },
  { key: 'sh', label: 'Shareholders / Directors', shortLabel: 'Holders' },
  { key: 'addr', label: 'Local address', shortLabel: 'Address' },
  { key: 'rep', label: 'Local representative', shortLabel: 'Rep' },
];

const INITIAL_SHAREHOLDER: ShareholderForm = {
  firstName: '',
  lastName: '',
  designation: '',
  phone: '',
  dob: '',
  sharePercent: '',
  address1: '',
  city: '',
  state: '',
  postalCode: '',
  country: '',
};

const INITIAL_FORM: FormValues = {
  name: '',
  alt: '',
  reg: '',
  web: '',
  act: '',
  intro: '',
  addr: '',
  rep: '',
  sh: { ...INITIAL_SHAREHOLDER },
};

// ─── Sub-components ──────────────────────────────────────────────────────────────────────

interface ChipProps {
  field: Field;
  selected: boolean;
  onPress: () => void;
  colors: ThemeColors;
}

const Chip: React.FC<ChipProps> = ({ field, selected, onPress, colors }) => {
  const s = styles(colors);
  return (
    <TouchableOpacity
      style={[s.chip, selected && s.chipSelected]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text
        style={[
          s.chipText,
          selected && s.chipTextSelected,
          { textAlign: 'center' },
        ]}
        numberOfLines={1}
      >
        {field.shortLabel}
        {selected ? '  ✓' : ''}
      </Text>
    </TouchableOpacity>
  );
};

interface FormFieldProps {
  label: string;
  value: string;
  placeholder: string;
  onChangeText: (text: string) => void;
  multiline?: boolean;
  keyboardType?: 'default' | 'url' | 'phone-pad' | 'numeric';
  colors: ThemeColors;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  value,
  placeholder,
  onChangeText,
  multiline = false,
  keyboardType = 'default',
  colors,
}) => {
  const s = styles(colors);
  return (
    <View style={s.fieldBlock}>
      <Text style={s.fieldLabel}>{label}</Text>
      <TextInput
        style={[s.fieldInput, multiline && s.fieldInputMulti]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
        keyboardType={keyboardType}
        autoCapitalize="none"
      />
    </View>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

interface BasicInfoScreenProps {
  onBackPress?: () => void;
}

const BasicInfoScreen: React.FC<BasicInfoScreenProps> = ({ onBackPress }) => {
  const colors = useThemeColors();
  const [selected, setSelected] = useState<Set<FieldKey>>(new Set());
  const [formValues, setFormValues] = useState<FormValues>(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);

  const totalCount = FIELDS.length;
  const selectedCount = selected.size;
  const allSelected = selectedCount === totalCount;

  const toggleField = (key: FieldKey) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const toggleAll = () => {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(FIELDS.map(f => f.key)));
    }
  };

  const setField = (key: keyof Omit<FormValues, 'sh'>, value: string) => {
    setFormValues(prev => ({ ...prev, [key]: value }));
  };

  const setShField = (key: keyof ShareholderForm, value: string) => {
    setFormValues(prev => ({
      ...prev,
      sh: { ...prev.sh, [key]: value },
    }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <SafeAreaView style={styles(colors).safe}>
        <StatusBar
          barStyle={colors.mode === 'dark' ? 'light-content' : 'dark-content'}
          backgroundColor={colors.background}
        />
        <View style={styles(colors).successContainer}>
          <Text style={styles(colors).successIcon}>✓</Text>
          <Text style={styles(colors).successTitle}>Update submitted</Text>
          <Text style={styles(colors).successSub}>
            {selectedCount} field{selectedCount !== 1 ? 's' : ''} updated successfully.
          </Text>
          <TouchableOpacity
            style={styles(colors).successBtn}
            onPress={() => {
              setSubmitted(false);
              setSelected(new Set());
              setFormValues(INITIAL_FORM);
              onBackPress?.();
            }}
          >
            <Text style={styles(colors).successBtnText}>Start over</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles(colors).safe}>
      <StatusBar
        barStyle={colors.mode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles(colors).scroll}
          contentContainerStyle={styles(colors).scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles(colors).headerRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
              <BackButton onPress={onBackPress} />
              <Text style={styles(colors).headerTitle} numberOfLines={1}>
                Select fields to update
              </Text>
            </View>
            <TouchableOpacity onPress={toggleAll}>
              <Text style={styles(colors).selectAllBtn}>
                {allSelected ? 'Deselect all' : 'Select all'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* 3-Column Buttons Layout */}
          <View style={styles(colors).chipsGrid}>
            {FIELDS.map(field => (
              <Chip
                key={field.key}
                field={field}
                selected={selected.has(field.key)}
                onPress={() => toggleField(field.key)}
                colors={colors}
              />
            ))}
          </View>

          {/* Counter */}
          <View style={styles(colors).footBar}>
            <Text style={styles(colors).countText}>
              {selectedCount} of {totalCount} selected
            </Text>
          </View>

          {/* Dynamic Form */}
          {selectedCount > 0 && (
            <View style={styles(colors).formArea}>

              {selected.has('name') && (
                <FormField
                  label="New company name"
                  value={formValues.name}
                  placeholder="Enter the registered company name..."
                  onChangeText={v => setField('name', v)}
                  colors={colors}
                />
              )}

              {selected.has('alt') && (
                <FormField
                  label="New alternate name"
                  value={formValues.alt}
                  placeholder="Enter the updated alternate name..."
                  onChangeText={v => setField('alt', v)}
                  colors={colors}
                />
              )}

              {selected.has('reg') && (
                <FormField
                  label="New registration number"
                  value={formValues.reg}
                  placeholder="Enter new registration number..."
                  onChangeText={v => setField('reg', v)}
                  colors={colors}
                />
              )}

              {selected.has('web') && (
                <FormField
                  label="New company website"
                  value={formValues.web}
                  placeholder="https://company.com"
                  onChangeText={v => setField('web', v)}
                  keyboardType="url"
                  colors={colors}
                />
              )}

              {selected.has('act') && (
                <FormField
                  label="New principal activity"
                  value={formValues.act}
                  placeholder="Describe the updated business activity..."
                  onChangeText={v => setField('act', v)}
                  colors={colors}
                />
              )}

              {selected.has('intro') && (
                <FormField
                  label="Updated company introduction"
                  value={formValues.intro}
                  placeholder="Enter the updated company introduction..."
                  onChangeText={v => setField('intro', v)}
                  multiline
                  colors={colors}
                />
              )}

              {selected.has('addr') && (
                <FormField
                  label="Updated local address"
                  value={formValues.addr}
                  placeholder="Enter full local / business address..."
                  onChangeText={v => setField('addr', v)}
                  colors={colors}
                />
              )}

              {selected.has('rep') && (
                <FormField
                  label="Updated local representative details"
                  value={formValues.rep}
                  placeholder="Enter name and contact details..."
                  onChangeText={v => setField('rep', v)}
                  colors={colors}
                />
              )}

              {selected.has('sh') && (
                <View style={styles(colors).shCard}>
                  <Text style={styles(colors).shCardTitle}>
                    Shareholder / director details
                  </Text>
                  <View style={styles(colors).shGrid}>
                    <View style={styles(colors).shGridHalf}>
                      <FormField
                        label="First name"
                        value={formValues.sh.firstName}
                        placeholder="First name"
                        onChangeText={v => setShField('firstName', v)}
                        colors={colors}
                      />
                    </View>
                    <View style={styles(colors).shGridHalf}>
                      <FormField
                        label="Last name"
                        value={formValues.sh.lastName}
                        placeholder="Last name"
                        onChangeText={v => setShField('lastName', v)}
                        colors={colors}
                      />
                    </View>
                    <View style={styles(colors).shGridHalf}>
                      <FormField
                        label="Designation"
                        value={formValues.sh.designation}
                        placeholder="Designation"
                        onChangeText={v => setShField('designation', v)}
                        colors={colors}
                      />
                    </View>
                    <View style={styles(colors).shGridHalf}>
                      <FormField
                        label="Phone"
                        value={formValues.sh.phone}
                        placeholder="Phone"
                        onChangeText={v => setShField('phone', v)}
                        keyboardType="phone-pad"
                        colors={colors}
                      />
                    </View>
                    <View style={styles(colors).shGridHalf}>
                      <FormField
                        label="DOB (DD/MM/YYYY)"
                        value={formValues.sh.dob}
                        placeholder="DD/MM/YYYY"
                        onChangeText={v => setShField('dob', v)}
                        colors={colors}
                      />
                    </View>
                    <View style={styles(colors).shGridHalf}>
                      <FormField
                        label="Share %"
                        value={formValues.sh.sharePercent}
                        placeholder="0%"
                        onChangeText={v => setShField('sharePercent', v)}
                        keyboardType="numeric"
                        colors={colors}
                      />
                    </View>
                    
                    <View style={{ width: '100%', marginBottom: 4 }}>
                      <FormField
                        label="Address line 1"
                        value={formValues.sh.address1}
                        placeholder="Address line 1"
                        onChangeText={v => setShField('address1', v)}
                        colors={colors}
                      />
                    </View>

                    <View style={styles(colors).shGridHalf}>
                      <FormField
                        label="City"
                        value={formValues.sh.city}
                        placeholder="City"
                        onChangeText={v => setShField('city', v)}
                        colors={colors}
                      />
                    </View>
                    <View style={styles(colors).shGridHalf}>
                      <FormField
                        label="State"
                        value={formValues.sh.state}
                        placeholder="State"
                        onChangeText={v => setShField('state', v)}
                        colors={colors}
                      />
                    </View>
                    <View style={styles(colors).shGridHalf}>
                      <FormField
                        label="Postal code"
                        value={formValues.sh.postalCode}
                        placeholder="Postal code"
                        onChangeText={v => setShField('postalCode', v)}
                        keyboardType="numeric"
                        colors={colors}
                      />
                    </View>
                    <View style={styles(colors).shGridHalf}>
                      <FormField
                        label="Country"
                        value={formValues.sh.country}
                        placeholder="Country"
                        onChangeText={v => setShField('country', v)}
                        colors={colors}
                      />
                    </View>
                  </View>
                </View>
              )}

              <TouchableOpacity
                style={styles(colors).submitBtn}
                onPress={handleSubmit}
                activeOpacity={0.8}
              >
                <Text style={styles(colors).submitBtnText}>Submit update</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = (colors: ThemeColors) => StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 14,
    paddingBottom: 40,
    marginTop: 70
  },

  // Header
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    flexShrink: 1,
    marginRight: 8,
  },
  selectAllBtn: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },

  // Fixed 3-Column Grid for Buttons
  chipsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between', 
    rowGap: 10,
    marginBottom: 12,
  },
  chip: {
    width: '31.5%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  chipSelected: {
    backgroundColor: colors.primary + '20',
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.muted,
    textAlign: 'center',
  },
  chipTextSelected: {
    color: colors.primary,
    fontWeight: '600',
  },

  // Footer bar
  footBar: {
    marginBottom: 16,
    marginTop: 18,
  },
  countText: {
    fontSize: 14,
    color: colors.muted,
  },

  // Form area
  formArea: {
    rowGap: 16,
  },
  fieldBlock: {
    rowGap: 6,
    marginBottom: 4,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.text,
    textTransform: 'none',
    letterSpacing: 0.4,
  },
  fieldInput: {
    borderWidth: 0.5,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 11,
    fontSize: 13,
    color: colors.text,
    backgroundColor: colors.surface,
  },
  fieldInputMulti: {
    minHeight: 72,
    textAlignVertical: 'top',
    paddingTop: 9,
  },

  // Shareholder card
  shCard: {
    backgroundColor: colors.surface,
    borderWidth: 0.5,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 16,
    gap: 14,
  },
  shCardTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  shGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
  },
  shGridHalf: {
    width: '48%',
  },

  // Submit Button
  submitBtn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    width: '100%',
    marginTop: 14,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
    overflow: 'hidden',
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  // Success screen
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
  successIcon: {
    fontSize: 48,
    color: '#22C55E',
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  successSub: {
    fontSize: 14,
    color: colors.muted,
    textAlign: 'center',
    marginBottom: 16,
  },
  successBtn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  successBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});

export default BasicInfoScreen;