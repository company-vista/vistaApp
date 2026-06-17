import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: { flex: 1 },

    /* header */
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 2,
        paddingTop: 14,
        paddingBottom: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
        gap: 16,
    },
    backBtn: { width: 28, alignItems: 'flex-start', justifyContent: 'center' },
    headerLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 4 },
    editBtn: { alignItems: 'flex-end' },
    headerTitle: { fontSize: 16, fontWeight: '600', textAlign: 'left' },
    requestChangesText: { fontSize: 12, fontWeight: '500' },

    /* scroll */
    scrollContent: { paddingHorizontal: 4, paddingTop: 16, paddingBottom: 40 },

    /* hero card */
    heroCard: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 14,
        padding: 14,
        borderWidth: 1,
        marginBottom: 16,
        gap: 12,
    },
    avatarCircle: {
        width: 46,
        height: 46,
        borderRadius: 23,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: { fontSize: 16, fontWeight: '700', color: '#4F46E5' },
    heroInfo: { flex: 1 },
    heroName: { fontSize: 14, fontWeight: '600' },
    heroMeta: { fontSize: 11, marginTop: 2 },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 20,
        gap: 5,
    },
    statusDot: { width: 6, height: 6, borderRadius: 3 },
    statusText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.2 },

    /* settings menu card */
    menuCard: {
        borderRadius: 14,
        borderWidth: 1,
        overflow: 'hidden',
    },
    menuRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 14,
        gap: 14,
    },
    iconBubble: {
        width: 36,
        height: 36,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    menuLabel: { flex: 1, fontSize: 14, fontWeight: '500' },
    divider: { height: StyleSheet.hairlineWidth, marginHorizontal: 16 },

    /* sub-section content */
    sectionContent: {},

    /* placeholder cards */
    placeholderCard: {
        borderRadius: 14,
        borderWidth: 1,
        padding: 40,
        alignItems: 'center',
        gap: 12,
    },
    placeholderText: { fontSize: 14 },

    /* empty state */
    emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80 },
    emptyText: { fontSize: 16, fontWeight: '500' },
});