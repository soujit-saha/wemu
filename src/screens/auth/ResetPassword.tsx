import React, { useState } from 'react';
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
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { COLORS, FONTS, ICONS } from '../../utils/constants';
import { ms } from '../../utils/helper/metric';
import { resetPasswordRequest } from '../../redux/reducer/AuthReducer';
import ToastAlert from '../../utils/helper/Toast';

const ResetPassword = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const dispatch = useDispatch();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secureText, setSecureText] = useState(true);
  const [secureConfirmText, setSecureConfirmText] = useState(true);

  const { isReqLoading } = useSelector((state: any) => state.AuthReducer);

  const email = route.params?.email || '';
  const code = route.params?.code || '';

  const handleResetPassword = () => {
    if (!password.trim()) {
      ToastAlert('Please enter a new password');
      return;
    }
    if (password.trim().length < 6) {
      ToastAlert('Password must be at least 6 characters long');
      return;
    }
    if (password.trim() !== confirmPassword.trim()) {
      ToastAlert('Passwords do not match');
      return;
    }

    const payload = {
      email: email,
      new_password: password.trim(),
      confirm_password: confirmPassword.trim(),
      // code: code,
      // otp: code,
    };

    dispatch(resetPasswordRequest(payload));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Header Row */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
              activeOpacity={0.7}
              disabled={isReqLoading}
            >
              <Image source={ICONS.leftarrow} style={styles.backIcon} />
            </TouchableOpacity>
          </View>

          {/* Title and Subtitle */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.subtitle}>
              Enter your new password below.
            </Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {/* Password Field */}
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="New Password"
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
                <Image
                  source={secureText ? ICONS.Eye : ICONS.viewoff}
                  style={{
                    height: ms(18),
                    width: ms(18),
                    resizeMode: 'contain',
                    tintColor: COLORS.black,
                    marginRight: ms(8),
                  }}
                />
              </TouchableOpacity>
            </View>

            {/* Confirm Password Field */}
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Confirm Password"
                placeholderTextColor="#9CA3AF"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={secureConfirmText}
                autoCapitalize="none"
                editable={!isReqLoading}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setSecureConfirmText(!secureConfirmText)}
                activeOpacity={0.7}
                disabled={isReqLoading}
              >
                <Image
                  source={secureConfirmText ? ICONS.Eye : ICONS.viewoff}
                  style={{
                    height: ms(18),
                    width: ms(18),
                    resizeMode: 'contain',
                    tintColor: COLORS.black,
                    marginRight: ms(8),
                  }}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleResetPassword}
              activeOpacity={0.8}
              disabled={isReqLoading}
            >
              {isReqLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.primaryButtonText}>Reset Password</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Bottom Link */}
          <View style={styles.bottomContainer}>
            <Text style={styles.bottomLabel}>Remember your password? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')} activeOpacity={0.7} disabled={isReqLoading}>
              <Text style={styles.bottomLink}>Log in</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ResetPassword;

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
  header: {
    height: ms(50),
    justifyContent: 'center',
    marginTop: ms(10),
  },
  backButton: {
    width: ms(40),
    height: ms(40),
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  backIcon: {
    width: ms(24),
    height: ms(24),
    resizeMode: 'contain',
    tintColor: '#000000',
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: ms(32),
    marginBottom: ms(40),
  },
  title: {
    fontFamily: FONTS.bold28,
    fontSize: ms(28),
    color: '#111827',
    textAlign: 'center',
    marginBottom: ms(16),
  },
  subtitle: {
    fontFamily: FONTS.regular24,
    fontSize: ms(15),
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: ms(22),
  },
  formContainer: {
    width: '100%',
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
    marginBottom: ms(16),
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
    marginTop: ms(8),
  },
  primaryButtonText: {
    fontFamily: FONTS.semiBold24,
    fontSize: ms(16),
    color: '#FFFFFF',
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
});
