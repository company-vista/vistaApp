import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useThemeColors } from '../../../../theme/colors';
import type { CompanyCardItem } from '../../screens/quickAccess/CompanyCard';

type CompanyInfoProps = {
    companyData: CompanyCardItem;
};

const CompanyInfo: React.FC<CompanyInfoProps> = ({ companyData }) => {
    const colors = useThemeColors();
    const iconColor = colors.mode === 'dark' ? '#85B7EB' : '#0D2137';
    const iconBg = colors.mode === 'dark' ? 'rgba(133,183,235,0.14)' : '#EAF4FF';
    const iconBorder = colors.mode === 'dark' ? 'rgba(133,183,235,0.35)' : '#C7DFF6';
    const statusColor = companyData.status === 'Active'
        ? { bg: '#E6F4EA', text: '#137333', dot: '#1E8E3E' }
        : { bg: '#FCE8E6', text: '#C5221F', dot: '#D93025' };

    const iconStyle = {
        backgroundColor: iconBg,
        borderColor: iconBorder,
    };

    return (
        <View>
            {/* HERO SECTION */}
            <View style={styles.heroSection}>
                <View style={styles.companyNameRow}>
                    <Text style={[styles.companyMainTitle, { color: colors.text }]}>{companyData.name}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: statusColor.bg }]}>
                        <View style={[styles.statusDot, { backgroundColor: statusColor.dot }]} />
                        <Text style={[styles.statusBadgeText, { color: statusColor.text }]}>{companyData.status}</Text>
                    </View>
                </View>
                <Text style={[styles.companyIdText, { color: colors.muted }]}>ID: {companyData.id}</Text>
                <View style={styles.locationRow}>
                    <Text style={styles.locationIcon}>📍</Text>
                    <Text style={[styles.locationText, { color: colors.muted }]}>{companyData.countryOfIncorporation}</Text>
                </View>
            </View>

            {/* COMPANY INFORMATION SECTION */}
            <View style={[styles.sectionContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Text style={[styles.sectionHeader, { color: colors.text }]}>Company Information</Text>
                <View style={styles.fieldGroup}>
                    <View style={[styles.fieldIcon, iconStyle]}>
                        <FontAwesome name="building" size={15} color={iconColor} />
                    </View>
                    <View style={styles.fieldCopy}>
                        <Text style={[styles.fieldLabel, { color: colors.subtle }]}>COMPANY NAME</Text>
                        <Text style={[styles.fieldValue, { color: colors.text }]}>{companyData.name}</Text>
                    </View>
                </View>
                <View style={styles.divider} />
                <View style={styles.fieldGroup}>
                    <View style={[styles.fieldIcon, iconStyle]}>
                        <FontAwesome name="map-marker" size={16} color={iconColor} />
                    </View>
                    <View style={styles.fieldCopy}>
                        <Text style={[styles.fieldLabel, { color: colors.subtle }]}>COUNTRY OF INCORPORATION</Text>
                        <Text style={[styles.fieldValue, { color: colors.text }]}>{companyData.countryOfIncorporation}</Text>
                    </View>
                </View>
                <View style={styles.divider} />
                <View style={styles.fieldGroup}>
                    <View style={[styles.fieldIcon, iconStyle]}>
                        <FontAwesome name="briefcase" size={14} color={iconColor} />
                    </View>
                    <View style={styles.fieldCopy}>
                        <Text style={[styles.fieldLabel, { color: colors.subtle }]}>COMPANY TYPE</Text>
                        <Text style={[styles.fieldValue, { color: colors.text }]}>{companyData.companyType}</Text>
                    </View>
                </View>
                <View style={styles.divider} />
                <View style={styles.fieldGroup}>
                    <View style={[styles.fieldIcon, iconStyle]}>
                        <FontAwesome name="id-card-o" size={14} color={iconColor} />
                    </View>
                    <View style={styles.fieldCopy}>
                        <Text style={[styles.fieldLabel, { color: colors.subtle }]}>EIN</Text>
                        <Text style={[styles.fieldValue, { color: colors.text }]}>{companyData.ein}</Text>
                    </View>
                </View>
                <View style={styles.divider} />
                <View style={styles.fieldGroup}>
                    <View style={[styles.fieldIcon, iconStyle]}>
                        <FontAwesome name="calendar" size={14} color={iconColor} />
                    </View>
                    <View style={styles.fieldCopy}>
                        <Text style={[styles.fieldLabel, { color: colors.subtle }]}>DATE ADDED</Text>
                        <Text style={[styles.fieldValue, { color: colors.text }]}>{companyData.date}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default CompanyInfo;

const styles = StyleSheet.create({
    heroSection: { marginBottom: 20, padding: 16 },
    companyNameRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    companyMainTitle: { fontSize: 18, fontWeight: '500' },
    statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 6, paddingVertical: 3, borderRadius: 6, gap: 4 },
    statusDot: { width: 5, height: 5, borderRadius: 2.5 },
    statusBadgeText: { fontSize: 10, fontWeight: '700', letterSpacing: 0.3 },
    companyIdText: { fontSize: 12, marginTop: 2 },
    locationRow: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 6, gap: 2 },
    locationIcon: { fontSize: 12 },
    locationText: { fontSize: 12, fontWeight: '500' },
    sectionContainer: { borderRadius: 10, padding: 16, marginBottom: 14, borderWidth: 1 },
    sectionHeader: { fontSize: 13, fontWeight: '700', marginBottom: 12 },
    fieldGroup: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    fieldIcon: {
        width: 34,
        height: 34,
        borderRadius: 17,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    fieldCopy: { flex: 1 },
    fieldLabel: { fontSize: 10, fontWeight: '600', letterSpacing: 0.4, marginBottom: 4 },
    fieldValue: { fontSize: 13, fontWeight: '400', lineHeight: 18 },
    divider: { height: 1, backgroundColor: '#e0e0e0', marginVertical: 10 },
});
