import { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import styles from './SignupScreen.styles';

import logoImage from '../../../assets/images/logoR.png';
import {
  clearSignupError,
  signupUser,
} from '../../../store/slices/authSlice';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { useThemeColors } from '../../../theme/colors';

type SignupScreenProps = {
  onLoginPress: () => void;
};

const socialLinks = {
  facebook: 'https://www.facebook.com',
  instagram: 'https://www.instagram.com',
  linkedin: 'https://www.linkedin.com',
};

function openSocialLink(url: string) {
  Linking.openURL(url);
}

function SignupScreen({ onLoginPress }: SignupScreenProps) {
  const safeAreaInsets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const colors = useThemeColors();
  const { isLoading, signupErrors: errors } = useAppSelector(state => state.auth);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const nameBorderColor = errors.name ? '#f87171' : colors.inputBorder;
  const emailBorderColor = errors.email ? '#f87171' : colors.inputBorder;
  const passwordBorderColor = errors.password ? '#f87171' : colors.inputBorder;

  async function handleSignup() {
    if (isLoading) {
      return;
    }

    const result = await dispatch(signupUser({ name, email, password }));

    if (signupUser.fulfilled.match(result)) {
      setName(result.payload.name);
      setEmail(result.payload.email);
      onLoginPress();
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[
        styles.screen,
        { backgroundColor: colors.authBackground, paddingTop: safeAreaInsets.top },
      ]}>
      <View style={styles.container}>
        <View style={styles.brandMark}>
          <Image source={logoImage} style={styles.brandLogo} />
        </View>

        <View style={styles.header}>
          {/* <Text style={styles.title}>Create account</Text>
          <Text style={styles.subtitle}>Sign up to start using Company Vista</Text> */}
        </View>

        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={[styles.label, { color: colors.muted }]}>Full Name</Text>
            <View
              style={[
                styles.inputWrap,
                {
                  backgroundColor: colors.inputBackground,
                  borderColor: nameBorderColor,
                },
              ]}>
              <FontAwesome name="user" size={18} color={colors.inputPlaceholder} />
              <TextInput
                autoCapitalize="words"
                onChangeText={value => {
                  setName(value);
                  dispatch(clearSignupError('name'));
                }}
                placeholder="Enter full name"
                placeholderTextColor={colors.inputPlaceholder}
                style={[styles.input, { color: colors.inputText }]}
                value={name}
              />
            </View>
            {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
          </View>

          <View style={styles.field}>
            <Text style={[styles.label, { color: colors.muted }]}>Email</Text>
            <View
              style={[
                styles.inputWrap,
                {
                  backgroundColor: colors.inputBackground,
                  borderColor: emailBorderColor,
                },
              ]}>
              <FontAwesome name="envelope" size={16} color={colors.inputPlaceholder} />
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                onChangeText={value => {
                  setEmail(value);
                  dispatch(clearSignupError('email'));
                }}
                placeholder="name@example.com"
                placeholderTextColor={colors.inputPlaceholder}
                style={[styles.input, { color: colors.inputText }]}
                value={email}
              />
            </View>
            {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
          </View>

          <View style={styles.field}>
            <Text style={[styles.label, { color: colors.muted }]}>Password</Text>
            <View
              style={[
                styles.inputWrap,
                {
                  backgroundColor: colors.inputBackground,
                  borderColor: passwordBorderColor,
                },
              ]}>
              <FontAwesome name="lock" size={20} color={colors.inputPlaceholder} />
              <TextInput
                onChangeText={value => {
                  setPassword(value);
                  dispatch(clearSignupError('password'));
                }}
                placeholder="Create password"
                placeholderTextColor={colors.inputPlaceholder}
                secureTextEntry={!isPasswordVisible}
                style={[styles.input, { color: colors.inputText }]}
                value={password}
              />
              <Pressable
                accessibilityLabel={isPasswordVisible ? 'Hide password' : 'Show password'}
                accessibilityRole="button"
                onPress={() => setIsPasswordVisible(current => !current)}
                style={styles.passwordToggle}>
                <FontAwesome
                  name={isPasswordVisible ? 'eye-slash' : 'eye'}
                  size={18}
                  color={colors.subtle}
                />
              </Pressable>
            </View>
            {errors.password ? (
              <Text style={styles.errorText}>{errors.password}</Text>
            ) : null}
          </View>

          <Pressable
            disabled={isLoading}
            onPress={handleSignup}
            style={[
              styles.button,
              { backgroundColor: colors.primary },
              isLoading ? styles.buttonDisabled : null,
            ]}>
            <Text style={[styles.buttonText, { color: colors.primaryText }]}>
              {isLoading ? 'Creating...' : 'Sign Up'}
            </Text>
          </Pressable>

          <Pressable onPress={onLoginPress}>
            <Text style={[styles.authLinkText, { color: colors.subtle }]}>
              Already have an account?{' '}
              <Text style={[styles.authLink, { color: colors.accent }]}>Login</Text>
            </Text>
          </Pressable>

          <View style={styles.socialSection}>
            <Text style={[styles.socialTitle, { color: colors.inputPlaceholder }]}>
              Continue with
            </Text>
            <View style={styles.socialRow}>
              <Pressable
                onPress={() => openSocialLink(socialLinks.facebook)}
                style={[styles.socialButton, styles.facebookButton]}>
                <FontAwesome name="facebook" size={15} color="#f8fafc" />
              </Pressable>
              <Pressable
                onPress={() => openSocialLink(socialLinks.instagram)}
                style={[styles.socialButton, styles.instagramButton]}>
                <FontAwesome name="instagram" size={15} color="#f8fafc" />
              </Pressable>
              <Pressable
                onPress={() => openSocialLink(socialLinks.linkedin)}
                style={[styles.socialButton, styles.linkedinButton]}>
                <FontAwesome name="linkedin" size={15} color="#f8fafc" />
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

export default SignupScreen;
