import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import { launchImageLibrary } from 'react-native-image-picker';
import { COLORS, FONTS, ICONS } from '../../utils/constants';
import { ms } from '../../utils/helper/metric';
import { updateProfileRequest } from '../../redux/reducer/MainReducer';
import ToastAlert from '../../utils/helper/Toast';
import { validateEmail } from '../../utils/helper';

const EditProfile = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();

  const { myProfileRes, isMainLoading } = useSelector((state: any) => state.MainReducer);

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneCode, setPhoneCode] = useState('91');
  const [mobileNumber, setMobileNumber] = useState('');
  const [avatarUri, setAvatarUri] = useState('');
  const [selectedImage, setSelectedImage] = useState<any>(null);

  // Focus states for input fields styling
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // References for TextInputs to enable wrapper click-to-focus
  const nameInputRef = React.useRef<TextInput>(null);
  const emailInputRef = React.useRef<TextInput>(null);
  const phoneCodeInputRef = React.useRef<TextInput>(null);
  const mobileInputRef = React.useRef<TextInput>(null);

  // Prefill state from Redux store
  useEffect(() => {
    if (myProfileRes) {
      const data = myProfileRes.data || myProfileRes;
      setFullName(data.name || '');
      setEmail(data.email || '');
      setPhoneCode(String(data.phone_code || data.country_code || '91'));
      setMobileNumber(String(data.mobile_number || data.mobile || ''));
      setAvatarUri(data.profile_image || '');
    }
  }, [myProfileRes]);

  // Image Picker handler
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
        const file = response.assets[0];
        setSelectedImage(file);
        if (file.uri) {
          setAvatarUri(file.uri);
        }
      }
    });
  };

  // Save profile info
  const handleSave = () => {
    if (!fullName.trim()) {
      ToastAlert('Please enter your name');
      return;
    }
    if (!email.trim()) {
      ToastAlert('Please enter your email');
      return;
    }
    if (!validateEmail(email.trim())) {
      ToastAlert('Please enter a valid email address');
      return;
    }
    if (!mobileNumber.trim()) {
      ToastAlert('Please enter your mobile number');
      return;
    }

    // Build Form Data payload
    const formData = new FormData();
    formData.append('name', fullName.trim());
    formData.append('email', email.trim());
    // formData.append('phone_code', phoneCode.trim().replace('+', ''));
    formData.append('mobile_number', mobileNumber.trim());

    if (selectedImage) {
      formData.append('profile_image', {
        uri: Platform.OS === 'android' ? selectedImage.uri : selectedImage.uri.replace('file://', ''),
        type: selectedImage.type || 'image/jpeg',
        name: selectedImage.fileName || 'profile_image.jpg',
      } as any);
    }

    dispatch(updateProfileRequest(formData));
  };

  // Custom Vector Camera Icon overlay on Avatar
  const CameraIcon = ({ color }: { color: string }) => (
    <View style={styles.cameraIconContainer}>
      <View style={[styles.cameraBody, { borderColor: color }]} />
      <View style={[styles.cameraLens, { borderColor: color }]} />
      <View style={[styles.cameraFlash, { backgroundColor: color }]} />
    </View>
  );

  // Custom Vector Icons inside Inputs
  const InputUserIcon = ({ color }: { color: string }) => (
    <View style={styles.inputIconContainer}>
      <View style={[styles.inputUserHead, { borderColor: color }]} />
      <View style={[styles.inputUserBody, { borderColor: color }]} />
    </View>
  );

  const InputEmailIcon = ({ color }: { color: string }) => (
    <View style={styles.inputIconContainer}>
      <View style={[styles.inputEmailEnvelope, { borderColor: color }]} />
      <View style={[styles.inputEmailLine, { borderColor: color }]} />
    </View>
  );

  const InputPhoneIcon = ({ color }: { color: string }) => (
    <View style={styles.inputIconContainer}>
      <View style={[styles.inputPhoneBody, { borderColor: color }]} />
      <View style={[styles.inputPhoneReceiver, { backgroundColor: color }]} />
    </View>
  );

  const displayAvatar = avatarUri || '';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {/* Modern Custom Sticky Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Image source={ICONS.leftarrow} style={styles.backIcon} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <View style={styles.headerRightPlaceholder} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Avatar Area with Premium Gradient Outline & Edit Badge */}
          <View style={styles.avatarSection}>
            <TouchableOpacity onPress={handleSelectImage} activeOpacity={0.95}>
              <LinearGradient
                colors={[COLORS.Primary || '#6337EB', '#FFA6E6']}
                style={styles.avatarGradientRing}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.avatarImageWrapper}>
                  <Image source={displayAvatar ? { uri: displayAvatar } : ICONS.people} style={displayAvatar ? styles.avatarImage : [styles.avatarImage, { tintColor: COLORS.Primary }]} />
                </View>
              </LinearGradient>
              <View style={styles.cameraBadge}>
                <CameraIcon color="#FFFFFF" />
              </View>
            </TouchableOpacity>
            <Text style={styles.avatarInstruction}>Tap to change photo</Text>
          </View>

          {/* Form Container */}
          <View style={styles.formContainer}>
            {/* Full Name field */}
            <Text style={styles.inputLabel}>Full Name</Text>
            <TouchableOpacity
              style={[
                styles.inputWrapper,
                focusedField === 'name' && styles.inputWrapperFocused,
              ]}
              activeOpacity={1}
              onPress={() => nameInputRef.current?.focus()}
            >
              <InputUserIcon
                color={focusedField === 'name' ? (COLORS.Primary || '#6337EB') : '#9CA3AF'}
              />
              <TextInput
                ref={nameInputRef}
                style={styles.textInput}
                placeholder="Full name"
                placeholderTextColor="#9CA3AF"
                value={fullName}
                onChangeText={setFullName}
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField(null)}
                editable={!isMainLoading}
              />
            </TouchableOpacity>

            {/* Email Address field */}
            <Text style={styles.inputLabel}>Email Address</Text>
            <TouchableOpacity
              style={[
                styles.inputWrapper,
                focusedField === 'email' && styles.inputWrapperFocused,
              ]}
              activeOpacity={1}
              onPress={() => emailInputRef.current?.focus()}
            >
              <InputEmailIcon
                color={focusedField === 'email' ? (COLORS.Primary || '#6337EB') : '#9CA3AF'}
              />
              <TextInput
                ref={emailInputRef}
                style={styles.textInput}
                placeholder="Email address"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                editable={!isMainLoading}
              />
            </TouchableOpacity>

            {/* Mobile Number fields */}
            <Text style={styles.inputLabel}>Mobile Number</Text>
            <View style={styles.phoneInputRow}>
              {/* Phone Code Input wrapper */}
              {/* <TouchableOpacity
                style={[
                  styles.phoneCodeWrapper,
                  focusedField === 'phoneCode' && styles.inputWrapperFocused,
                ]}
                activeOpacity={1}
                onPress={() => phoneCodeInputRef.current?.focus()}
              >
                <Text style={styles.phoneCodePrefix}>+</Text>
                <TextInput
                  ref={phoneCodeInputRef}
                  style={styles.phoneCodeInput}
                  placeholder="91"
                  placeholderTextColor="#9CA3AF"
                  value={phoneCode}
                  onChangeText={setPhoneCode}
                  keyboardType="number-pad"
                  maxLength={4}
                  onFocus={() => setFocusedField('phoneCode')}
                  onBlur={() => setFocusedField(null)}
                  editable={!isMainLoading}
                />
              </TouchableOpacity> */}

              {/* Main Mobile Input wrapper */}
              <TouchableOpacity
                style={[
                  styles.mobileInputWrapper,
                  focusedField === 'mobile' && styles.inputWrapperFocused,
                ]}
                activeOpacity={1}
                onPress={() => mobileInputRef.current?.focus()}
              >
                <InputPhoneIcon
                  color={focusedField === 'mobile' ? (COLORS.Primary || '#6337EB') : '#9CA3AF'}
                />
                <TextInput
                  ref={mobileInputRef}
                  style={styles.textInput}
                  placeholder="Mobile number"
                  placeholderTextColor="#9CA3AF"
                  value={mobileNumber}
                  onChangeText={setMobileNumber}
                  keyboardType="phone-pad"
                  maxLength={15}
                  onFocus={() => setFocusedField('mobile')}
                  onBlur={() => setFocusedField(null)}
                  editable={!isMainLoading}
                />
              </TouchableOpacity>
            </View>

            {/* Action buttons */}
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
              activeOpacity={0.8}
              disabled={isMainLoading}
            >
              {isMainLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.saveButtonText}>Save Changes</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: ms(56),
    paddingHorizontal: ms(16),
    borderBottomWidth: ms(1),
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    width: ms(40),
    height: ms(40),
    borderRadius: ms(20),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  backIcon: {
    width: ms(18),
    height: ms(18),
    resizeMode: 'contain',
    tintColor: '#111827',
  },
  headerTitle: {
    fontFamily: FONTS.bold28 || 'System',
    fontSize: ms(18),
    color: '#111827',
    includeFontPadding: false,
  },
  headerRightPlaceholder: {
    width: ms(40),
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: ms(24),
    paddingBottom: ms(40),
  },
  avatarSection: {
    alignItems: 'center',
    marginTop: ms(32),
    marginBottom: ms(24),
  },
  avatarGradientRing: {
    width: ms(120),
    height: ms(120),
    borderRadius: ms(60),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.Primary || '#6337EB',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarImageWrapper: {
    width: ms(112),
    height: ms(112),
    borderRadius: ms(56),
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: ms(106),
    height: ms(106),
    borderRadius: ms(53),
    resizeMode: 'cover',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: ms(2),
    right: ms(2),
    width: ms(34),
    height: ms(34),
    borderRadius: ms(17),
    backgroundColor: COLORS.Primary || '#6337EB',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: ms(2),
    borderColor: '#FFFFFF',
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  avatarInstruction: {
    fontFamily: FONTS.medium24 || 'System',
    fontSize: ms(13),
    color: COLORS.Primary || '#6337EB',
    marginTop: ms(12),
    includeFontPadding: false,
  },
  formContainer: {
    width: '100%',
    marginTop: ms(8),
  },
  inputLabel: {
    fontFamily: FONTS.semiBold24 || 'System',
    fontSize: ms(13.5),
    color: '#374151',
    marginBottom: ms(6),
    marginTop: ms(16),
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: ms(54),
    borderWidth: ms(1.2),
    borderColor: '#E5E7EB',
    borderRadius: ms(12),
    paddingHorizontal: ms(16),
    backgroundColor: '#FAFAFA',
  },
  inputWrapperFocused: {
    borderColor: COLORS.Primary || '#6337EB',
    backgroundColor: '#FFFFFF',
    shadowColor: COLORS.Primary || '#6337EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 1,
  },
  textInput: {
    flex: 1,
    height: '100%',
    fontSize: ms(15),
    fontFamily: FONTS.regular24 || 'System',
    color: '#111827',
    padding: 0,
  },
  phoneInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(10),
  },
  phoneCodeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: ms(85),
    height: ms(54),
    borderWidth: ms(1.2),
    borderColor: '#E5E7EB',
    borderRadius: ms(12),
    backgroundColor: '#FAFAFA',
    paddingHorizontal: ms(10),
  },
  phoneCodePrefix: {
    fontFamily: FONTS.regular24 || 'System',
    fontSize: ms(15),
    color: '#111827',
    marginRight: ms(2),
  },
  phoneCodeInput: {
    flex: 1,
    height: '100%',
    fontSize: ms(15),
    fontFamily: FONTS.regular24 || 'System',
    color: '#111827',
    padding: 0,
  },
  mobileInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: ms(54),
    borderWidth: ms(1.2),
    borderColor: '#E5E7EB',
    borderRadius: ms(12),
    paddingHorizontal: ms(16),
    backgroundColor: '#FAFAFA',
  },
  saveButton: {
    height: ms(54),
    backgroundColor: COLORS.Primary || '#6337EB',
    borderRadius: ms(12),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: ms(36),
    shadowColor: COLORS.Primary || '#6337EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  saveButtonText: {
    fontFamily: FONTS.semiBold24 || 'System',
    fontSize: ms(16),
    color: '#FFFFFF',
  },

  // Custom Vector Icon Styles
  cameraIconContainer: {
    width: ms(16),
    height: ms(16),
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraBody: {
    width: ms(14),
    height: ms(10),
    borderRadius: ms(1.5),
    borderWidth: ms(1.5),
    backgroundColor: 'transparent',
  },
  cameraLens: {
    width: ms(5),
    height: ms(5),
    borderRadius: ms(2.5),
    borderWidth: ms(1.2),
    position: 'absolute',
  },
  cameraFlash: {
    width: ms(1.5),
    height: ms(1.5),
    borderRadius: ms(0.75),
    position: 'absolute',
    top: ms(2.5),
    right: ms(2.5),
  },

  inputIconContainer: {
    width: ms(18),
    height: ms(18),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: ms(12),
  },
  inputUserHead: {
    width: ms(6),
    height: ms(6),
    borderRadius: ms(3),
    borderWidth: ms(1.5),
    backgroundColor: 'transparent',
    marginBottom: ms(1),
  },
  inputUserBody: {
    width: ms(12),
    height: ms(5),
    borderTopLeftRadius: ms(6),
    borderTopRightRadius: ms(6),
    borderWidth: ms(1.5),
    borderBottomWidth: 0,
    backgroundColor: 'transparent',
  },

  inputEmailEnvelope: {
    width: ms(14),
    height: ms(10),
    borderRadius: ms(1.5),
    borderWidth: ms(1.5),
    backgroundColor: 'transparent',
  },
  inputEmailLine: {
    width: ms(6),
    height: ms(6),
    borderBottomWidth: ms(1.2),
    borderRightWidth: ms(1.2),
    transform: [{ rotate: '45deg' }],
    position: 'absolute',
    top: ms(3.5),
  },

  inputPhoneBody: {
    width: ms(9),
    height: ms(13),
    borderRadius: ms(1.5),
    borderWidth: ms(1.5),
    backgroundColor: 'transparent',
  },
  inputPhoneReceiver: {
    width: ms(5),
    height: ms(1.5),
    borderRadius: ms(0.75),
    position: 'absolute',
    bottom: ms(2),
  },
});
