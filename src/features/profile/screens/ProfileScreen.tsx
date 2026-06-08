import { Image, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { logoutUser } from '../../../store/slices/authSlice';
import { useThemeColors } from '../../../theme/colors';
import styles from './ProfileScreen.styles';

type ProfileScreenProps = {
  onBackPress: () => void;
  onEditPress: () => void;
};

function ProfileScreen({ onBackPress, onEditPress }: ProfileScreenProps) {
  const safeAreaInsets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const colors = useThemeColors();
  const user = useAppSelector(state => state.auth.user);
  console.log(user);
  
  const profileImage =
    user?.profileImage ?? user?.profilePicture ?? user?.avatar ?? user?.image ?? user?.photo;
  const profileItems = [
    { label: 'Email', value: user?.email ?? 'demo@vista.com', icon: 'envelope-o' },
    { label: 'Phone', value: user?.phone ?? '+91 98765 43210', icon: 'phone' },
    { label: 'Company', value: user?.company ?? 'Company Vista', icon: 'building-o' },
    { label: 'Role', value: user?.role ?? 'Client Admin', icon: 'user-o' },
  ];

  return (
    <View
      style={[
        styles.screen,
        { backgroundColor: colors.background, paddingTop: safeAreaInsets.top + 22 },
      ]}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Pressable
            onPress={onBackPress}
            style={[styles.backButton, { backgroundColor: colors.surface }]}>
            <FontAwesome name="arrow-left" size={18} color={colors.text} />
          </Pressable>
          <Text style={[styles.title, { color: colors.text }]}>Profile</Text>
        </View>
        <Pressable onPress={onEditPress} style={styles.editButton}>
          <FontAwesome name="pencil" size={16} color={colors.accent} />
          <Text style={[styles.editText, { color: colors.accent }]}>Edit</Text>
        </Pressable>
      </View>

      <View style={[styles.profileCard, { backgroundColor: colors.surface }]}>
        <View style={styles.avatarWrap}>
          <View
            style={[
              styles.avatar,
              { backgroundColor: colors.surfaceAlt, borderColor: colors.accentSoft },
            ]}>
            {profileImage ? (
              <Image
                onError={event => console.log('Profile avatar failed', event.nativeEvent.error, profileImage)}
                source={{ uri: profileImage }}
                style={styles.avatarImage}
              />
            ) : (
              <FontAwesome name="user" size={42} color={colors.accent} />
            )}
          </View>
          <View
            style={[
              styles.cameraButton,
              { backgroundColor: colors.accent, borderColor: colors.surface },
            ]}>
            <FontAwesome name="camera" size={14} color="#ffffff" />
          </View>
        </View>
        <Text style={[styles.name, { color: colors.text }]}>{user?.name ?? 'Demo User'}</Text>
        <Text style={[styles.subtitle, { color: colors.muted }]}>Client Portal Account</Text>
      </View>

      <View style={[styles.detailsCard, { backgroundColor: colors.surface }]}>
        {profileItems.map(item => (
          <View key={item.label} style={[styles.detailRow, { borderBottomColor: colors.border }]}>
            <View style={[styles.detailIcon, { backgroundColor: colors.surfaceAlt }]}>
              <FontAwesome name={item.icon} size={17} color={colors.accent} />
            </View>
            <View style={styles.detailCopy}>
              <Text style={[styles.detailLabel, { color: colors.subtle }]}>
                {item.label}
              </Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>{item.value}</Text>
            </View>
          </View>
        ))}
      </View>

      <Pressable onPress={() => dispatch(logoutUser())} style={styles.logoutButton}>
        <FontAwesome name="sign-out" size={18} color="#ffffff" />
        <Text style={styles.logoutText}>Logout</Text>
      </Pressable>

      <Text style={[styles.versionText, { color: colors.subtle }]}>
        Company Vista v0.0.4
      </Text>
    </View>
  );
}
export default ProfileScreen;
