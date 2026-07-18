import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  Image,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONTS, ICONS } from '../../utils/constants';
import { ms } from '../../utils/helper/metric';

const CreatePlayList = () => {
  const navigation = useNavigation<any>();
  const [playlistName, setPlaylistName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);

  const handleCreate = () => {
    // Action to simulate playlist creation
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Image source={ICONS.leftarrow} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Playlist</Text>
        <View style={styles.headerSpacer} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Cover Art Uploader Container */}
          <TouchableOpacity style={styles.uploaderContainer} activeOpacity={0.7}>
            <View style={styles.uploaderDashedBox}>
              <Text style={styles.uploaderPlusIcon}>+</Text>
            </View>
          </TouchableOpacity>

          {/* Playlist Name Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Playlist name"
              placeholderTextColor="#9CA3AF"
              value={playlistName}
              onChangeText={setPlaylistName}
            />
          </View>

          {/* Playlist Description Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              placeholder="Description (optional)"
              placeholderTextColor="#9CA3AF"
              multiline
              textAlignVertical="top"
              value={description}
              onChangeText={setDescription}
            />
          </View>

          {/* Make Public Toggle Row */}
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Make public</Text>
            
            {/* Custom Premium Toggle Switch */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setIsPublic(!isPublic)}
              style={[
                styles.toggleContainer,
                isPublic ? styles.toggleActive : styles.toggleInactive,
              ]}
            >
              <View
                style={[
                  styles.toggleThumb,
                  isPublic ? styles.toggleThumbActive : styles.toggleThumbInactive,
                ]}
              />
            </TouchableOpacity>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={styles.submitButton}
            activeOpacity={0.8}
            onPress={handleCreate}
          >
            <Text style={styles.submitButtonText}>Create Playlist</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CreatePlayList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    height: ms(56),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ms(16),
  },
  backButton: {
    width: ms(36),
    height: ms(36),
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    width: ms(22),
    height: ms(22),
    tintColor: '#111827',
    resizeMode: 'contain',
  },
  headerTitle: {
    fontFamily: FONTS.bold28,
    fontSize: ms(18),
    color: '#000000',
    includeFontPadding: false,
  },
  headerSpacer: {
    width: ms(36),
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: ms(24),
    paddingTop: ms(20),
    paddingBottom: ms(40),
    alignItems: 'center',
  },
  uploaderContainer: {
    width: ms(150),
    height: ms(150),
    backgroundColor: '#F3F4F6',
    borderRadius: ms(16),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: ms(36),
  },
  uploaderDashedBox: {
    width: ms(44),
    height: ms(44),
    borderRadius: ms(8),
    borderWidth: ms(1.5),
    borderColor: '#9CA3AF',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploaderPlusIcon: {
    fontSize: ms(22),
    color: '#4B5563',
    lineHeight: ms(24),
    includeFontPadding: false,
  },
  inputContainer: {
    width: '100%',
    marginBottom: ms(20),
  },
  textInput: {
    width: '100%',
    height: ms(48),
    borderRadius: ms(12),
    borderWidth: ms(1),
    borderColor: '#E5E7EB',
    paddingHorizontal: ms(16),
    fontFamily: FONTS.regular24,
    fontSize: ms(14),
    color: '#111827',
    backgroundColor: '#FFFFFF',
  },
  textArea: {
    height: ms(100),
    paddingTop: ms(14),
    paddingBottom: ms(14),
  },
  toggleRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: ms(16),
    marginBottom: ms(36),
  },
  toggleLabel: {
    fontFamily: FONTS.bold24,
    fontSize: ms(15),
    color: '#111827',
    includeFontPadding: false,
  },
  toggleContainer: {
    width: ms(48),
    height: ms(26),
    borderRadius: ms(13),
    padding: ms(2),
    justifyContent: 'center',
  },
  toggleActive: {
    backgroundColor: COLORS.Primary || '#6337EB',
  },
  toggleInactive: {
    backgroundColor: '#E5E7EB',
  },
  toggleThumb: {
    width: ms(22),
    height: ms(22),
    borderRadius: ms(11),
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
  toggleThumbInactive: {
    alignSelf: 'flex-start',
  },
  submitButton: {
    width: '100%',
    height: ms(52),
    backgroundColor: COLORS.Primary || '#6337EB',
    borderRadius: ms(12),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.Primary || '#6337EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  submitButtonText: {
    fontFamily: FONTS.bold24,
    fontSize: ms(15),
    color: '#FFFFFF',
    includeFontPadding: false,
  },
});
