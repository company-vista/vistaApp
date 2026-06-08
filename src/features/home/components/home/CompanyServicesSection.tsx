import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { useThemeColors } from '../../../../theme/colors';
import styles from './CompanyServicesSection.styles';

const services = [
  {
    title: 'Documents',
    subtitle: 'Manage company files and records',
    icon: 'file-text-o',
    color: '#fff4d8',
  },
  {
    title: 'Compliance',
    subtitle: 'Track filings and due dates',
    icon: 'check-square-o',
    color: '#e8faec',
  },
  {
    title: 'Invoices',
    subtitle: 'View billing and payments',
    icon: 'credit-card',
    color: '#eef4ff',
  },
];

function CompanyServicesSection() {
  const colors = useThemeColors();

  return (
    <>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Company Services</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalList}>
        {services.map(service => (
          <Pressable
            key={service.title}
            style={[styles.serviceCard, { backgroundColor: colors.surface }]}>
            <View style={styles.serviceTop}>
              <View style={styles.serviceCopy}>
                <Text style={[styles.serviceTitle, { color: colors.text }]}>
                  {service.title}
                </Text>
                <Text style={[styles.serviceSubtitle, { color: colors.muted }]}>
                  {service.subtitle}
                </Text>
              </View>
              <FontAwesome name="external-link" size={20} color={colors.text} />
            </View>
            <View style={[styles.serviceIconWrap, { backgroundColor: service.color }]}>
              <FontAwesome name={service.icon} size={25} color="#0f766e" />
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </>
  );
}



export default CompanyServicesSection;
