import { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { launchImageLibrary } from 'react-native-image-picker';
import styles from './HelpFeedbackScreen.styles';

import { useThemeColors } from '../../../theme/colors';

type HelpFeedbackScreenProps = {
  onBackPress: () => void;
};

const helpItems = [
  {
    icon: 'question-circle-o',
    title: 'Help centre',
    subtitle: 'Get help, contact us',
  },
  {
    icon: 'bug',
    title: 'Send feedback',
    subtitle: 'Report technical issues',
  },
  {
    icon: 'file-text-o',
    title: 'Terms and Privacy Policy',
  },
  {
    icon: 'exclamation-circle',
    title: 'Channel reports',
  },
  {
    icon: 'info-circle',
    title: 'App info',
  },
];

function HelpFeedbackScreen({ onBackPress }: HelpFeedbackScreenProps) {
  const safeAreaInsets = useSafeAreaInsets();
  const colors = useThemeColors();
  const [activePage, setActivePage] = useState<'helpList' | 'sendFeedback'>(
    'helpList',
  );
  const [feedback, setFeedback] = useState('');
  const [selectedMediaUri, setSelectedMediaUri] = useState<string | null>(null);
  const canSend = feedback.trim().length > 0;

  //----------------Send Feedback form---------------
  const handleAddMediaPress = async () => {
    try {
      if (typeof launchImageLibrary !== 'function') {
        Alert.alert(
          'Gallery unavailable',
          'Please rebuild the app once after installing the gallery picker.',
        );
        return;
      }

      const response = await launchImageLibrary({
        mediaType: 'mixed',
        selectionLimit: 1,
      });

      if (response.didCancel) {
        return;
      }

      if (response.errorMessage) {
        Alert.alert('Gallery error', response.errorMessage);
        return;
      }

      const assetUri = response.assets?.[0]?.uri;

      if (assetUri) {
        setSelectedMediaUri(assetUri);
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unable to open gallery right now.';

      Alert.alert('Gallery error', message);
    }
  };

  if (activePage === 'sendFeedback') {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={[
          styles.screen,
          {
            backgroundColor: colors.background,
            paddingTop: safeAreaInsets.top,
          },
        ]}>
        <View
          style={[
            styles.feedbackHeader,
            { borderBottomColor: colors.border },
          ]}>
          <Pressable
            onPress={() => setActivePage('helpList')}
            style={styles.feedbackBackButton}>
            <FontAwesome name="arrow-left" size={22} color={colors.text} />
          </Pressable>
          <Text style={[styles.feedbackHeaderTitle, { color: colors.text }]}>
            Send feedback
          </Text>
        </View>

        <View style={styles.feedbackContent}>
          <Text style={[styles.feedbackHelpText, { color: colors.muted }]}>
            For other issues like spam or scams, you can get help or contact
            support from the{' '}
            <Text style={[styles.linkText, { color: colors.accent }]}>
              Help centre.
            </Text>
          </Text>

          <TextInput
            multiline
            value={feedback}
            onChangeText={setFeedback}
            placeholder="Describe the technical issue"
            placeholderTextColor={colors.muted}
            style={[
              styles.issueInput,
              {
                borderColor: colors.muted,
                color: colors.text,
                backgroundColor: colors.surface,
              },
            ]}
            textAlignVertical="top"
          />

          <View style={styles.mediaSection}>
            <Text style={[styles.mediaTitle, { color: colors.text }]}>
              Screenshots or recordings (optional)
            </Text>
            <Text style={[styles.mediaSubtitle, { color: colors.muted }]}>
              Tap screenshot to edit or remove sensitive info
            </Text>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Add screenshot or recording"
              onPress={handleAddMediaPress}
              style={[
                styles.addMediaButton,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}>
              {selectedMediaUri ? (
                <Image
                  source={{ uri: selectedMediaUri }}
                  style={styles.selectedMediaPreview}
                />
              ) : (
                <View>
                  <FontAwesome name="picture-o" size={27} color={colors.text} />
                  <View
                    style={[
                      styles.plusBadge,
                      {
                        backgroundColor: colors.surface,
                        borderColor: colors.surface,
                      },
                    ]}>
                    <FontAwesome name="plus" size={10} color={colors.text} />
                  </View>
                </View>
              )}
            </Pressable>
          </View>
        </View>

        <View
          style={[
            styles.footer,
            { paddingBottom: Math.max(safeAreaInsets.bottom, 18) },
          ]}>
          <Text style={[styles.footerText, { color: colors.muted }]}>
            By sending, you allow Vista to review related technical info to help
            address your feedback.{' '}
            <Text style={[styles.linkText, { color: colors.accent }]}>
              Learn more
            </Text>
          </Text>
          <Pressable
            disabled={!canSend}
            style={[
              styles.sendButton,
              {
                backgroundColor: canSend ? colors.primary : colors.border,
              },
            ]}>
            <Text
              style={[
                styles.sendButtonText,
                { color: canSend ? colors.primaryText : colors.subtle },
              ]}>
              Send
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    );
  }

  return (
    <View
      style={[
        styles.screen,
        { backgroundColor: colors.background, paddingTop: safeAreaInsets.top },
      ]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Pressable onPress={onBackPress} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={20} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Help and feedback
        </Text>
      </View>

      <View style={styles.list}>
        {helpItems.map(item => (
          <Pressable
            key={item.title}
            onPress={
              item.title === 'Send feedback'
                ? () => setActivePage('sendFeedback')
                : undefined
            }
            style={styles.itemRow}>
            <View style={styles.itemIcon}>
              <FontAwesome name={item.icon} size={25} color={colors.muted} />
            </View>
            <View style={styles.itemCopy}>
              <Text style={[styles.itemTitle, { color: colors.text }]}>
                {item.title}
              </Text>
              {item.subtitle ? (
                <Text style={[styles.itemSubtitle, { color: colors.muted }]}>
                  {item.subtitle}
                </Text>
              ) : null}
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
}



export default HelpFeedbackScreen;
