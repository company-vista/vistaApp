import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { useThemeColors } from '../../../theme/colors';
import styles from './TabPlaceholder.styles';

type TabPlaceholderProps = {
  icon?: string;
  title?: string;
};

// 1. Typescript Structure for Actions
interface ComplianceActionItem {
  id: string;
  title: string;
  subtitle: string;
  status: 'Overdue' | 'Pending' | 'Done';
  date: string;
  icon: string;
  details: { label: string; value: string }[];
}

const complianceData = {
  resident: {
    name: "Shivam Kumar",
    email: "shivam.kumar@compliance...",
  },
  // image_b242c0.png की पूरी लिस्ट का मॉक डेटा यहाँ सेट कर दिया है
  actions: [
    {
      id: 'federal_filing',
      title: 'Federal Filing ',
      subtitle: 'Annual federal tax',
      status: 'Overdue',
      date: 'March 24, 2026',
      icon: 'exclamation-circle',
      details: [
        { label: 'Year', value: '2025' },
        { label: 'Due Date', value: 'New Jersey' },
        { label: 'Status', value: 'pending' },
      ],
    },
    {
      id: 'annual_filing',
      title: 'Annual Filing',
      subtitle: 'State compliance',
      status: 'Done',
      date: 'Feb 24, 2026',
      icon: 'check-circle',
      details: [
        { label: 'Year', value: '2026' },
        { label: 'Due Date', value: 'Form 990' },
        { label: 'Status', value: 'Successfully Processed' },
      ],
    },
    {
      id: 'agent_renewal',
      title: 'Agent Renewal',
      subtitle: 'Registered agent',
      status: 'Pending',
      date: 'TBD',
      icon: 'clock-o',
      details: [
        { label: 'Info', value: 'Shivam kumar' },
        { label: 'Due Date', value: 'Extension Requested' },
        { label: 'Status', value: 'Documents shared with CPA' },
      ],
    },

     {
      id: 'address',
      title: 'Address Renewal',
      subtitle: 'Registered address',
      status: 'Pending',
      date: 'TBD',
      icon: 'clock-o',
      details: [
        { label: 'Street Address', value: '123 Business Street' },
        { label: 'State', value: 'New Jersey' },
        { label: 'Postal Code', value: '87110' },
        { label: 'Country', value: 'United States' },
        { label: 'Last Filed', value: 'March 15, 2026' },
      ],
    },
   
   
  ] as ComplianceActionItem[],
};

function TabPlaceholder({
  icon = 'exclamation-circle',
  title = 'Address Compliance',
}: TabPlaceholderProps) {
  const colors = useThemeColors();
  
  
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);


  const getStatusTheme = (status: 'Overdue' | 'Pending' | 'Done') => {
    switch (status) {
      case 'Overdue':
        return { text: '#DE3730', bg: '#FCE8E6' };
      case 'Pending':
        return { text: '#E28704', bg: '#FEF3D6' };
      case 'Done':
        return { text: '#256F46', bg: '#E6F4EA' };
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedCardId(prevId => (prevId === id ? null : id));
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      
      {/* --- 1. PROFILE HEADER SECTION --- */}
      <View style={styles.header}>
        <View style={styles.profileContainer}>
          {/* <View style={styles.avatarWrapper}>
            <View style={[styles.avatarPlaceholder, { backgroundColor: colors.border }]} />
            <View style={styles.activeDot} />
          </View> */}
          <View style={styles.userInfo}>
            {/* <Text style={[styles.welcomeText, { color: colors.muted }]}>Welcome back</Text> */}
            <Text style={[styles.userName, { color: colors.text }]}>{complianceData.resident.name}</Text>
            <Text style={[styles.userEmail, { color: colors.muted }]}>{complianceData.resident.email}</Text>
          </View>
        </View>
        {/* <Pressable style={[styles.themeButton, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <FontAwesome name="moon-o" size={20} color={colors.text} />
        </Pressable> */}
      </View>

      {/* --- 2. STATS COUNTER CARDS --- */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={[styles.statDot, { backgroundColor: '#DE3730' }]} />
          <Text style={[styles.statNumber, { color: colors.text }]}>1</Text>
          <Text style={[styles.statLabel, { color: colors.muted }]}>Overdue</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={[styles.statDot, { backgroundColor: '#E28704' }]} />
          <Text style={[styles.statNumber, { color: colors.text }]}>2</Text>
          <Text style={[styles.statLabel, { color: colors.muted }]}>Pending</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={[styles.statDot, { backgroundColor: '#256F46' }]} />
          <Text style={[styles.statNumber, { color: colors.text }]}>2</Text>
          <Text style={[styles.statLabel, { color: colors.muted }]}>Done</Text>
        </View>
      </View>

      {/* --- 3. COMPLIANCE HEALTH CARD --- */}
      <View style={[styles.healthCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.healthHeader}>
          <Text style={[styles.healthTitle, { color: colors.muted }]}>Compliance health</Text>
          <Text style={[styles.healthPercentage, { color: colors.text }]}>40%</Text>
        </View>
        <View style={[styles.progressBarBackground, { backgroundColor: colors.background }]}>
          <View style={[styles.progressBarFill, { backgroundColor: '#1E5631', width: '40%' }]} />
        </View>
        <Text style={[styles.healthSubtext, { color: colors.muted }]}>2 of 5 actions complete</Text>
      </View>

      {/* --- 4. SECTION TITLE --- */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitleText, { color: colors.muted }]}>COMPLIANCE ACTIONS</Text>
        {/* <Pressable>
          <FontAwesome name="sliders" size={18} color={colors.muted} />
        </Pressable> */}
      </View>

      {/* --- 5. DYNAMIC COMPLIANCE ACTIONS LIST (image_b242c0.png) --- */}
      {complianceData.actions.map((action) => {
        const isCurrentCardExpanded = expandedCardId === action.id;
        const theme = getStatusTheme(action.status);

        return (
          <Pressable 
            key={action.id}
            style={[
              styles.mainCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                marginBottom: 12, // कार्ड्स के बीच स्पेसिंग के लिए
              },
            ]}
            onPress={() => toggleExpand(action.id)}
          >
            <View style={styles.headerRow}>
              {/* स्टेटस के अनुसार डायनेमिक आइकॉन बैकग्राउंड और कलर */}
              <View style={[styles.iconWrap, { backgroundColor: theme.bg }]}>
                <FontAwesome name={action.icon} size={20} color={theme.text} />
              </View>

              <View style={styles.headerTextBlock}>
                <Text style={[styles.sectionTitle, { color: colors.text }]} numberOfLines={1}>
                  {action.title}
                </Text>
                <Text style={[styles.sectionSubtitle, { color: colors.muted }]} numberOfLines={1}>
                  {action.subtitle}
                </Text>
                <View style={styles.dateRow}>
                  <FontAwesome name="calendar" size={12} color={colors.muted} />
                  <Text style={[styles.dateText, { color: colors.muted }]}>
                    {action.date}
                  </Text>
                </View>
              </View>

              <View style={styles.rightBadgeWrapper}>
                <View style={[styles.badgeWrap, { backgroundColor: theme.bg }]}>
                  <Text style={[styles.badgeText, { color: theme.text }]}>{action.status}</Text>
                </View>
                <FontAwesome 
                  name={isCurrentCardExpanded ? "chevron-up" : "chevron-down"} 
                  size={12} 
                  color={colors.muted} 
                  style={{ marginTop: 6 }}
                />
              </View>
            </View>

            {/* --- EXPANDABLE DETAILS BLOCK --- */}
            {isCurrentCardExpanded && (
              <View style={styles.expandedDetails}>
                <View style={[styles.divider, { backgroundColor: colors.border }]} />
                
                {action.details.map((detail, idx) => (
                  <View key={idx} style={{ marginBottom: 8 }}>
                    <Text style={[styles.detailLabel, { color: colors.muted }]}>{detail.label}</Text>
                    <Text style={[styles.detailValue, { color: colors.text }]}>
                      {detail.value}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </Pressable>
        );
      })}

    </ScrollView>
  );
}

export default TabPlaceholder;