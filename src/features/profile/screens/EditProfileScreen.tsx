import { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { updateProfileUser } from '../../../store/slices/authSlice';
import { useThemeColors } from '../../../theme/colors';
import styles from './EditProfileScreen.styles';

type EditProfileScreenProps = {
  onBackPress: () => void;
};

function EditProfileScreen({ onBackPress }: EditProfileScreenProps) {
  const safeAreaInsets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const colors = useThemeColors();
  const user = useAppSelector(state => state.auth.user);
  const [name, setName] = useState(user?.name ?? 'Demo User');
  const [email, setEmail] = useState(user?.email ?? 'demo@vista.com');
  const [phone, setPhone] = useState(user?.phone ?? '+91 98765 43210');
  const [company, setCompany] = useState(user?.company ?? 'Company Vista');
  const [role, setRole] = useState(user?.role ?? 'Client Admin');
  const profileImage =
    user?.profileImage ?? user?.profilePicture ?? user?.avatar ?? user?.image ?? user?.photo;

  const handleSavePress = () => {
    dispatch(updateProfileUser({ company, email, name, phone, role }));
    onBackPress();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
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
          <Text style={[styles.title, { color: colors.text }]}>Edit Profile</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(safeAreaInsets.bottom, 24) },
        ]}>
        <View style={[styles.avatarCard, { backgroundColor: colors.surface }]}>
          <View style={styles.avatarWrap}>
            <View
              style={[
                styles.avatar,
                { backgroundColor: colors.surfaceAlt, borderColor: colors.accentSoft },
              ]}>
              {profileImage ? (
                <Image
                  onError={event => console.log('Edit profile avatar failed', event.nativeEvent.error, profileImage)}
                  source={{ uri: profileImage }}
                  style={styles.avatarImage}
                />
              ) : (
                <FontAwesome name="user" size={42} color={colors.accent} />
              )}
            </View>
            <Pressable
              style={[
                styles.cameraButton,
                { backgroundColor: colors.accent, borderColor: colors.surface },
              ]}>
              <FontAwesome name="camera" size={14} color="#ffffff" />
            </Pressable>
          </View>
        </View>

        <View style={[styles.formCard, { backgroundColor: colors.surface }]}>
          <ProfileInput
            icon="user-o"
            label="Name"
            onChangeText={setName}
            value={name}
          />
          <ProfileInput
            icon="envelope-o"
            label="Email"
            keyboardType="email-address"
            onChangeText={setEmail}
            value={email}
          />
          <ProfileInput
            icon="phone"
            label="Phone"
            keyboardType="phone-pad"
            onChangeText={setPhone}
            value={phone}
          />
          <ProfileInput
            icon="building-o"
            label="Company"
            onChangeText={setCompany}
            value={company}
          />
          <ProfileInput
            icon="user-o"
            label="Role"
            onChangeText={setRole}
            value={role}
          />
        </View>

        <Pressable
          onPress={handleSavePress}
          style={[styles.saveButton, { backgroundColor: colors.accent }]}>
          <Text style={styles.saveText}>Save</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

type ProfileInputProps = {
  icon: string;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
  label: string;
  onChangeText: (value: string) => void;
  value: string;
};

function ProfileInput({
  icon,
  keyboardType = 'default',
  label,
  onChangeText,
  value,
}: ProfileInputProps) {
  const colors = useThemeColors();

  return (
    <View style={styles.inputGroup}>
      <Text style={[styles.inputLabel, { color: colors.subtle }]}>{label}</Text>
      <View
        style={[
          styles.inputRow,
          { backgroundColor: colors.surfaceAlt, borderColor: colors.border },
        ]}>
        <FontAwesome name={icon} size={16} color={colors.accent} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          placeholderTextColor={colors.muted}
          style={[styles.input, { color: colors.text }]}
        />
      </View>
    </View>
  );
}

export default EditProfileScreen;
