import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View, Pressable, ActivityIndicator } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { useAppSelector } from '../../../../store/hooks';
import { useThemeColors, type AppTheme } from '../../../../theme/colors';
import { fetchCompanyDocuments, type DocumentItem } from '../../api/clientDocumentApi';
import type { CompanyCardItem } from '../quickAccess/CompanyCard';

const FILTERS = ['All Docs', 'Recent', 'Compliance', 'Reports'];

type DocumentsTabContentProps = {
  selectedCompany?: CompanyCardItem | null;
  onDocumentViewPress?: (doc: import('../../api/clientDocumentApi').DocumentItem) => void;
};

function DocumentsTabContent({ selectedCompany, onDocumentViewPress }: DocumentsTabContentProps) {
  const [activeFilter, setActiveFilter] = useState('All Docs');
  const [searchQuery, setSearchQuery] = useState('');
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const token = useAppSelector(state => state.auth.token);
  const colors = useThemeColors();
  const styles = getStyles(colors);

  useEffect(() => {
    let isMounted = true;
    
    if (selectedCompany?.id) {
      setIsLoading(true);
      fetchCompanyDocuments({ companyId: selectedCompany.id, token }).then(result => {
        if (isMounted) {
          setDocuments(result.documents);
          setIsLoading(false);
        }
      });
    } else {
      setDocuments([]);
    }

    return () => {
      isMounted = false;
    };
  }, [selectedCompany?.id, token]);

  const filteredDocuments = documents.filter(doc => {
    if (!searchQuery) return true;
    const lowerQuery = searchQuery.toLowerCase();
    const fileName = (doc.originalFileName ?? doc.fileName ?? '').toLowerCase();
    const companyName = (doc.companyName ?? '').toLowerCase();
    return fileName.includes(lowerQuery) || companyName.includes(lowerQuery);
  });

  return (
    <View style={styles.container}>
      
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View>
              <Text style={styles.headerTitle}>{selectedCompany?.name ?? 'Documents'}</Text>
              <Text style={styles.headerSubtitle}>Company Portal</Text>
            </View>
          </View>
          <View style={styles.totalBadge}>
            <Text style={styles.totalBadgeText}>{documents.length} Docs</Text>
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <FontAwesome name="search" size={16} color={colors.subtle} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search documents..."
            placeholderTextColor={colors.subtle}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContainer}
        >
          {FILTERS.map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <Pressable
                key={filter}
                style={[styles.filterButton, isActive && styles.filterButtonActive]}
                onPress={() => setActiveFilter(filter)}
              >
                <Text style={[styles.filterText, isActive && styles.filterTextActive]}>{filter}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Document List */}
        <View style={styles.listContainer}>
          {isLoading ? (
            <ActivityIndicator size="large" color={colors.text} style={{ marginTop: 40 }} />
          ) : filteredDocuments.length > 0 ? (
            filteredDocuments.map((doc, index) => (
              <View key={doc._id ?? String(index)} style={styles.card}>
                <View style={styles.cardTop}>
                  <View style={styles.cardIconContainer}>
                    <FontAwesome name="file-text-o" size={18} color={colors.primary} />
                  </View>
                  <View style={styles.cardInfo}>
                    <Text style={styles.cardTitle}>{doc.companyName ?? 'Company'}</Text>
                    <Text numberOfLines={1} style={styles.cardSubtitle}>
                      {doc.originalFileName ?? doc.documentType ?? 'Document'}
                    </Text>
                  </View>
                  <View style={styles.cardActions}>
                    <Pressable style={styles.actionButton} onPress={() => onDocumentViewPress?.(doc)}>
                      <FontAwesome name="eye" size={16} color={colors.text} />
                    </Pressable>
                    <Pressable style={styles.actionButton}>
                      <FontAwesome name="download" size={16} color={colors.text} />
                    </Pressable>
                  </View>
                </View>

                <View style={styles.cardDivider} />

                <View style={styles.cardBottom}>
                  <Text style={styles.cardDate}>
                    Uploaded: {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                  </Text>
                  <Pressable>
                    <Text style={styles.cardLink}>View Details</Text>
                  </Pressable>
                </View>
              </View>
            ))
          ) : (
            <Text style={{ textAlign: 'center', marginTop: 40, color: colors.muted }}>No documents found.</Text>
          )}
        </View>

    </View>
  );
}

const getStyles = (colors: AppTheme) => StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.muted,
    marginTop: 2,
  },
  totalBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.surfaceAlt,
    justifyContent: 'center',
    alignItems: 'center',
  },
  totalBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: colors.text,
  },
  filtersContainer: {
    gap: 12,
    marginBottom: 24,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterButtonActive: {
    backgroundColor: colors.text,
    borderColor: colors.text,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.muted,
  },
  filterTextActive: {
    color: colors.background,
  },
  listContainer: {
    gap: 16,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceAlt,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  cardInfo: {
    flex: 1,
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 11,
    color: colors.muted,
    fontWeight: '500',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 10,
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardDate: {
    fontSize: 11,
    color: colors.muted,
  },
  cardLink: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
});

export default DocumentsTabContent;
