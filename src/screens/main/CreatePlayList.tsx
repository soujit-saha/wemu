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
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { launchImageLibrary } from 'react-native-image-picker';
import { COLORS, FONTS, ICONS } from '../../utils/constants';
import { ms } from '../../utils/helper/metric';
import { useTranslation } from '../../utils/hooks/useTranslation';
import ToastAlert from '../../utils/helper/Toast';
import { createOrUpdatePlaylistRequest } from '../../redux/reducer/SongReducer';

const CreatePlayList = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const playlist = route.params?.playlist;
  const initialCover = playlist?.cover_image_path || playlist?.cover_image || playlist?.image;

  const [playlistName, setPlaylistName] = useState(playlist?.title || playlist?.name || '');
  const [description, setDescription] = useState(playlist?.description || '');
  const [isPublic, setIsPublic] = useState(playlist?.is_public !== undefined ? !!playlist.is_public : true);
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [errors, setErrors] = useState<{
    coverImage?: string;
    playlistName?: string;
    description?: string;
  }>({});

  const { isLoading } = useSelector((state: any) => state.SongReducer);

  // Pick cover image from device library
  const handleSelectImage = () => {
    const options = {
      mediaType: 'photo' as const,
      quality: 0.8 as any,
      maxWidth: 800,
      maxHeight: 800,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        return;
      }
      if (response.errorMessage) {
        ToastAlert('Error picking image: ' + response.errorMessage);
        return;
      }
      if (response.assets && response.assets.length > 0) {
        setSelectedImage(response.assets[0]);
        setErrors((prev) => ({ ...prev, coverImage: undefined }));
      }
    });
  };

  const handleCreate = () => {
    const newErrors: {
      coverImage?: string;
      playlistName?: string;
      description?: string;
    } = {};

    // 1. Cover Image Validation
    if (!selectedImage && !initialCover) {
      newErrors.coverImage =
        t('pleaseSelectCoverImage') || 'Please select a cover image';
    }

    // 2. Playlist Name Validation
    if (!playlistName.trim()) {
      newErrors.playlistName =
        t('pleaseEnterPlaylistName') || 'Please enter playlist name';
    } else if (playlistName.trim().length < 2) {
      newErrors.playlistName = 'Playlist name must be at least 2 characters';
    } else if (playlistName.trim().length > 100) {
      newErrors.playlistName = 'Playlist name cannot exceed 100 characters';
    }

    // 3. Description Validation (optional, max 500 chars)
    if (description.trim().length > 500) {
      newErrors.description = 'Description cannot exceed 500 characters';
    }

    // If any error exists, show toast & display inline errors
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const firstError =
        newErrors.coverImage || newErrors.playlistName || newErrors.description;
      if (firstError) {
        ToastAlert(firstError);
      }
      return;
    }

    setErrors({});

    const formData = new FormData();
    if (playlist?.id || playlist?.uuid) {
      formData.append('playlist_id', String(playlist.id || playlist.uuid));
    }
    formData.append('title', playlistName.trim());
    if (description.trim()) {
      formData.append('description', description.trim());
    }
    formData.append('is_public', isPublic ? 'true' : 'false');

    if (selectedImage?.uri) {
      formData.append('cover_image', {
        uri: selectedImage.uri,
        type: selectedImage.type || 'image/jpeg',
        name: selectedImage.fileName || 'cover.jpg',
      } as any);
    }

    dispatch(createOrUpdatePlaylistRequest(formData));
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
        <Text style={styles.headerTitle}>
          {playlist ? (t('saveChanges') || 'Edit Playlist') : t('createPlaylist')}
        </Text>
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
          <View style={styles.uploaderWrapper}>
            <TouchableOpacity
              style={[
                styles.uploaderContainer,
                !!errors.coverImage && styles.uploaderError,
              ]}
              activeOpacity={0.7}
              onPress={handleSelectImage}
            >
              {selectedImage?.uri ? (
                <Image source={{ uri: selectedImage.uri }} style={styles.coverPreview} />
              ) : initialCover ? (
                <Image source={{ uri: initialCover }} style={styles.coverPreview} />
              ) : (
                <View style={styles.uploaderDashedBox}>
                  <Text style={styles.uploaderPlusIcon}>+</Text>
                </View>
              )}
            </TouchableOpacity>
            {errors.coverImage && (
              <Text style={styles.uploaderErrorText}>{errors.coverImage}</Text>
            )}
          </View>

          {/* Playlist Name Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.textInput, !!errors.playlistName && styles.inputError]}
              placeholder={t('playlistNamePlaceholder')}
              placeholderTextColor="#9CA3AF"
              value={playlistName}
              onChangeText={(text) => {
                setPlaylistName(text);
                if (errors.playlistName) {
                  setErrors((prev) => ({ ...prev, playlistName: undefined }));
                }
              }}
            />
            {errors.playlistName && (
              <Text style={styles.errorText}>{errors.playlistName}</Text>
            )}
          </View>

          {/* Playlist Description Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={[
                styles.textInput,
                styles.textArea,
                !!errors.description && styles.inputError,
              ]}
              placeholder={t('descriptionOptional')}
              placeholderTextColor="#9CA3AF"
              multiline
              textAlignVertical="top"
              value={description}
              onChangeText={(text) => {
                setDescription(text);
                if (errors.description) {
                  setErrors((prev) => ({ ...prev, description: undefined }));
                }
              }}
            />
            {errors.description && (
              <Text style={styles.errorText}>{errors.description}</Text>
            )}
          </View>


          {/* Make Public Toggle Row */}
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>{t('makePublic')}</Text>
            
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
            style={[styles.submitButton, isLoading && { opacity: 0.7 }]}
            activeOpacity={0.8}
            onPress={handleCreate}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.submitButtonText}>
                {playlist ? (t('saveChanges') || 'Save Changes') : t('createPlaylist')}
              </Text>
            )}
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
  uploaderWrapper: {
    alignItems: 'center',
    marginBottom: ms(36),
  },
  uploaderContainer: {
    width: ms(150),
    height: ms(150),
    backgroundColor: '#F3F4F6',
    borderRadius: ms(16),
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  uploaderError: {
    borderWidth: ms(1.5),
    borderColor: '#EF4444',
  },
  uploaderErrorText: {
    fontFamily: FONTS.regular24,
    fontSize: ms(12),
    color: '#EF4444',
    marginTop: ms(8),
    textAlign: 'center',
  },
  coverPreview: {
    width: '100%',
    height: '100%',
    borderRadius: ms(16),
    resizeMode: 'cover',
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
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    fontFamily: FONTS.regular24,
    fontSize: ms(12),
    color: '#EF4444',
    marginTop: ms(6),
    alignSelf: 'flex-start',
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
