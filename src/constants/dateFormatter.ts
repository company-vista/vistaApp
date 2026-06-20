export const formatDate = (isoString?: string) => {
    if (!isoString) return 'Not set';
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return 'Not set';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};