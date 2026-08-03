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
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { COLORS, FONTS, ICONS } from '../../utils/constants';
import { ms } from '../../utils/helper/metric';
import { loginRequest } from '../../redux/reducer/AuthReducer';
import ToastAlert from '../../utils/helper/Toast';

const Login = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);

  const { isReqLoading } = useSelector((state: any) => state.AuthReducer);

  const handleLogin = () => {
    if (!email.trim()) {
      ToastAlert('Please enter your email or username');
      return;
    }
    if (!password.trim()) {
      ToastAlert('Please enter your password');
      return;
    }
    dispatch(loginRequest({ email: email.trim(), password: password.trim() }));
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
            <TouchableOpacity style={styles.langButton} activeOpacity={0.7}>
              <Text style={styles.langText}>EN ▾</Text>
            </TouchableOpacity>
          </View>

          {/* Title */}
          <Text style={styles.title}>Welcome Back</Text>

          {/* Form */}
          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email or username"
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
                placeholder="Password"
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
              <Text style={styles.forgotText}>Forget password?</Text>
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
                <Text style={styles.primaryButtonText}>Log In</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Buttons */}
          <View style={styles.socialContainer}>
            <TouchableOpacity style={styles.socialButton} activeOpacity={0.7}>
              <Image
                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2991/2991148.png' }}
                style={styles.socialIcon}
              />
              <Text style={styles.socialButtonText}>Continue with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.socialButton} activeOpacity={0.7}>
              <Image
                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/0/747.png' }}
                style={[styles.socialIcon, { tintColor: '#000000' }]}
              />
              <Text style={styles.socialButtonText}>Continue with Apple</Text>
            </TouchableOpacity>
          </View>

          {/* Bottom Link */}
          <View style={styles.bottomContainer}>
            <Text style={styles.bottomLabel}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')} activeOpacity={0.7}>
              <Text style={styles.bottomLink}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
});