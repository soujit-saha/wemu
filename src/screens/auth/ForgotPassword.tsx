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
import { forgotPasswordRequest } from '../../redux/reducer/AuthReducer';
import ToastAlert from '../../utils/helper/Toast';

const ForgotPassword = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');

  const { isReqLoading } = useSelector((state: any) => state.AuthReducer);

  const handleSendCode = () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      ToastAlert('Please enter your email address');
      return;
    }
    // Simple email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      ToastAlert('Please enter a valid email address');
      return;
    }
    dispatch(forgotPasswordRequest({ email: trimmedEmail }));
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
            <Text style={styles.title}>Forgot Password</Text>
            <Text style={styles.subtitle}>
              Enter your email address to receive a{'\n'}
              verification code.
            </Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email address"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isReqLoading}
            />

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleSendCode}
              activeOpacity={0.8}
              disabled={isReqLoading}
            >
              {isReqLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.primaryButtonText}>Send Code</Text>
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

export default ForgotPassword;

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
    marginBottom: ms(24),
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
