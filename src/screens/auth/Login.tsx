import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Modal,
  Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';
import { useDispatch, useSelector } from 'react-redux';
import { COLORS, FONTS, ICONS } from '../../utils/constants';
import { ms } from '../../utils/helper/metric';
import { loginRequest, socialLoginRequest } from '../../redux/reducer/AuthReducer';
import ToastAlert from '../../utils/helper/Toast';
import { useTranslation } from '../../utils/hooks/useTranslation';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { SafeAreaView } from 'react-native-safe-area-context';

const Login = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);
  const [showLangModal, setShowLangModal] = useState(false);
  const { t, lang, changeLanguage } = useTranslation();

  const { isReqLoading } = useSelector((state: any) => state.AuthReducer);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '201125485215-kcden6ngcv3gjkoj5e77h4ol52b65ms1.apps.googleusercontent.com', // Replace with your webClientId from Google Cloud Console
      offlineAccess: true,
    });
  }, []);



  const selectLanguage = (selectedLang: 'en' | 'es') => {
    changeLanguage(selectedLang);
    setShowLangModal(false);
  };

  const handleLogin = async () => {
    if (!email.trim()) {
      ToastAlert(t('pleaseEnterEmail'));
      return;
    }
    if (!password.trim()) {
      ToastAlert(t('pleaseEnterPassword'));
      return;
    }
    const deviceToken = await DeviceInfo.getUniqueId();
    dispatch(loginRequest({
      email: email.trim(),
      password: password.trim(),
      device_token: deviceToken,
      device_type: Platform.OS,
    }));
  };

  const handleGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo: any = await GoogleSignin.signIn();
      console.log('Google login userInfo:', userInfo, userInfo?.data?.user?.name);

      const deviceToken = await DeviceInfo.getUniqueId();
      const formData = new FormData();
      formData.append('name', userInfo?.data?.user?.name || '');
      formData.append('email', userInfo?.data?.user?.email || '');
      formData.append('provider', 'google');
      formData.append('provider_id', userInfo?.data?.user?.id || '');
      if (userInfo?.data?.user?.photo) {
        formData.append('profile_pic', userInfo?.data?.user?.photo || '');
      }
      formData.append('device_type', Platform.OS);
      formData.append('device_token', deviceToken);

      // Call the social login API
      dispatch(socialLoginRequest(formData));
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User cancelled the login flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Signing in');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        ToastAlert('Play services not available');
      } else {
        ToastAlert('Something went wrong with Google Sign-In');
        console.log(error);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Top Bar with Language Selector */}
          <View style={styles.topBar}>
            <View />
            <TouchableOpacity style={styles.langButton} onPress={() => setShowLangModal(true)} activeOpacity={0.7}>
              <Text style={styles.langText}>{lang === 'en' ? 'EN ▾' : 'ES ▾'}</Text>
            </TouchableOpacity>
          </View>

          {/* Title */}
          <Text style={styles.title}>{t('welcomeBack')}</Text>

          {/* Form */}
          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder={t('email')}
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isReqLoading}
            />

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder={t('password')}
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={secureText}
                autoCapitalize="none"
                editable={!isReqLoading}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setSecureText(!secureText)}
                activeOpacity={0.7}
                disabled={isReqLoading}
              >

                {/* <Text style={styles.eyeText}>{secureText ? '👁️' : '👁️‍🗨️'}</Text> */}
                <Image source={secureText ? ICONS.Eye : ICONS.viewoff} style={{ height: ms(18), width: ms(18), resizeMode: 'contain', tintColor: COLORS.black, marginRight: ms(8) }} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.forgotButton}
              activeOpacity={0.7}
              disabled={isReqLoading}
              onPress={() => navigation.navigate('ForgotPassword')}
            >
              <Text style={styles.forgotText}>{t('forgetPassword')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleLogin}
              activeOpacity={0.8}
              disabled={isReqLoading}
            >
              {isReqLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.primaryButtonText}>{t('logIn')}</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>{t('or')}</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Buttons */}
          <View style={styles.socialContainer}>
            <TouchableOpacity style={styles.socialButton} activeOpacity={0.7}
              onPress={handleGoogleLogin}
            >
              <Image
                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2991/2991148.png' }}
                style={styles.socialIcon}
              />
              <Text style={styles.socialButtonText}>{t('continueGoogle')}</Text>
            </TouchableOpacity>

            {Platform.OS === 'ios' && <TouchableOpacity style={styles.socialButton} activeOpacity={0.7}>
              <Image
                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/0/747.png' }}
                style={[styles.socialIcon, { tintColor: '#000000' }]}
              />
              <Text style={styles.socialButtonText}>{t('continueApple')}</Text>
            </TouchableOpacity>}
          </View>

          {/* Bottom Link */}
          <View style={styles.bottomContainer}>
            <Text style={styles.bottomLabel}>{t('dontHaveAccount')}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')} activeOpacity={0.7}>
              <Text style={styles.bottomLink}>{t('signUp')}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Language Picker Modal */}
      <Modal
        visible={showLangModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLangModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowLangModal(false)}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{t('selectLanguage')}</Text>

            <TouchableOpacity
              style={[
                styles.modalOption,
                lang === 'en' && styles.modalOptionSelected,
              ]}
              onPress={() => selectLanguage('en')}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.modalOptionText,
                  lang === 'en' && styles.modalOptionTextSelected,
                ]}
              >
                {t('english')}
              </Text>
              {lang === 'en' && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.modalOption,
                lang === 'es' && styles.modalOptionSelected,
              ]}
              onPress={() => selectLanguage('es')}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.modalOptionText,
                  lang === 'es' && styles.modalOptionTextSelected,
                ]}
              >
                {t('spanish')}
              </Text>
              {lang === 'es' && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: ms(24),
    paddingBottom: ms(24),
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: ms(50),
    marginTop: ms(10),
  },
  langButton: {
    borderWidth: ms(1),
    borderColor: '#E5E7EB',
    borderRadius: ms(8),
    paddingHorizontal: ms(12),
    paddingVertical: ms(6),
  },
  langText: {
    fontFamily: FONTS.medium24,
    fontSize: ms(14),
    color: '#1F2937',
  },
  title: {
    fontFamily: FONTS.bold28,
    fontSize: ms(28),
    color: '#111827',
    textAlign: 'center',
    marginTop: ms(40),
    marginBottom: ms(40),
  },
  formContainer: {
    width: '100%',
  },
  input: {
    height: ms(54),
    borderWidth: ms(1),
    borderColor: '#E5E7EB',
    borderRadius: ms(12),
    paddingHorizontal: ms(16),
    fontSize: ms(15),
    fontFamily: FONTS.regular24,
    color: '#1F2937',
    backgroundColor: '#FFFFFF',
    marginBottom: ms(16),
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: ms(54),
    borderWidth: ms(1),
    borderColor: '#E5E7EB',
    borderRadius: ms(12),
    backgroundColor: '#FFFFFF',
    paddingHorizontal: ms(16),
    marginBottom: ms(12),
  },
  passwordInput: {
    flex: 1,
    height: '100%',
    fontSize: ms(15),
    fontFamily: FONTS.regular24,
    color: '#1F2937',
  },
  eyeButton: {
    padding: ms(4),
  },
  eyeText: {
    fontSize: ms(20),
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginBottom: ms(28),
  },
  forgotText: {
    fontFamily: FONTS.medium24,
    fontSize: ms(14),
    color: '#1293ED',
  },
  primaryButton: {
    height: ms(54),
    backgroundColor: COLORS.Primary,
    borderRadius: ms(12),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.Primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  primaryButtonText: {
    fontFamily: FONTS.semiBold24,
    fontSize: ms(16),
    color: '#FFFFFF',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: ms(32),
  },
  dividerLine: {
    flex: 1,
    height: ms(1),
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    marginHorizontal: ms(16),
    fontFamily: FONTS.regular24,
    fontSize: ms(14),
    color: '#9CA3AF',
  },
  socialContainer: {
    width: '100%',
    gap: ms(14),
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: ms(54),
    borderWidth: ms(1),
    borderColor: '#E5E7EB',
    borderRadius: ms(12),
    backgroundColor: '#FFFFFF',
  },
  socialIcon: {
    width: ms(22),
    height: ms(22),
    marginRight: ms(12),
    resizeMode: 'contain',
  },
  socialButtonText: {
    fontFamily: FONTS.medium24,
    fontSize: ms(15),
    color: '#1F2937',
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: ms(40),
  },
  bottomLabel: {
    fontFamily: FONTS.regular24,
    fontSize: ms(14),
    color: '#6B7280',
  },
  bottomLink: {
    fontFamily: FONTS.semiBold24,
    fontSize: ms(14),
    color: '#1293ED',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: ms(24),
    borderTopRightRadius: ms(24),
    paddingHorizontal: ms(24),
    paddingTop: ms(24),
    paddingBottom: ms(40),
  },
  modalTitle: {
    fontFamily: FONTS.bold28,
    fontSize: ms(20),
    color: '#111827',
    marginBottom: ms(20),
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: ms(16),
    borderBottomWidth: ms(1),
    borderBottomColor: '#F3F4F6',
  },
  modalOptionSelected: {
    borderBottomColor: '#EEF2FF',
  },
  modalOptionText: {
    fontFamily: FONTS.medium24,
    fontSize: ms(16),
    color: '#4B5563',
  },
  modalOptionTextSelected: {
    color: '#6337EB',
    fontFamily: FONTS.semiBold24,
  },
  checkmark: {
    fontSize: ms(18),
    color: '#6337EB',
    fontWeight: 'bold',
  },
});