import React, { useState, useEffect, useRef } from 'react';
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
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { COLORS, FONTS, ICONS } from '../../utils/constants';
import { ms } from '../../utils/helper/metric';
import { forgotPasswordRequest } from '../../redux/reducer/AuthReducer';
import ToastAlert from '../../utils/helper/Toast';

const OtpVerify = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const dispatch = useDispatch();
  const [code, setCode] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(30);

  const { isReqLoading, ForgotPasswordRes } = useSelector((state: any) => state.AuthReducer);

  const email = route.params?.email || '';

  const otpFromResponse =
    route.params?.data?.otp ||
    route.params?.data?.data?.otp ||
    route.params?.data?.verification_code ||
    route.params?.data?.data?.verification_code ||
    route.params?.data?.code ||
    route.params?.data?.data?.code ||
    ForgotPasswordRes?.otp ||
    ForgotPasswordRes?.data?.otp ||
    ForgotPasswordRes?.verification_code ||
    ForgotPasswordRes?.data?.verification_code ||
    ForgotPasswordRes?.code ||
    ForgotPasswordRes?.data?.code;

  const handleVerify = () => {
    const fullCode = code.join('');
    if (fullCode.length < 4 || isNaN(Number(fullCode))) {
      ToastAlert('Please enter a valid 4-digit verification code');
      return;
    }

    if (!otpFromResponse) {
      ToastAlert('Verification code not found. Please resend the code.');
      return;
    }

    if (String(otpFromResponse) !== String(fullCode)) {
      ToastAlert('Invalid verification code. Please try again.');
      return;
    }

    // Navigate to ResetPassword with email and verification code
    navigation.navigate('ResetPassword', { email: email, code: fullCode });
  };

  // Focus navigation refs
  const inputRefs = [
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
  ];

  useEffect(() => {
    let interval: any = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((t) => t - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer]);

  const handleChangeText = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // Auto-focus next input
    if (text.length > 0 && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Move to previous input on backspace
    if (e.nativeEvent.key === 'Backspace' && code[index] === '' && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleResend = () => {
    if (timer === 0) {
      setTimer(30);
      setCode(['', '', '', '']);
      inputRefs[0].current?.focus();
      if (email) {
        dispatch(forgotPasswordRequest({ email }));
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
        <View style={styles.contentContainer}>
          {/* Header Row */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
              activeOpacity={0.7}
            >
              <Image source={ICONS.leftarrow} style={styles.backIcon} />
            </TouchableOpacity>
          </View>

          {/* Title and Subtitle */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Verify Your Email</Text>
            <Text style={styles.subtitle}>
              Enter the 4-digit code sent to{'\n'}
              <Text style={styles.emailText}>{email}</Text>
            </Text>
            {otpFromResponse ? (
              <View style={styles.otpBanner}>
                <Text style={styles.otpBannerText}>
                  Your OTP code is: <Text style={styles.otpBannerCode}>{otpFromResponse}</Text>
                </Text>
              </View>
            ) : null}
          </View>

          {/* 4 Digit Inputs */}
          <View style={styles.otpRow}>
            {code.map((digit, idx) => (
              <TextInput
                key={idx}
                ref={inputRefs[idx]}
                style={[
                  styles.otpInput,
                  digit !== '' && styles.otpInputFilled,
                ]}
                maxLength={1}
                keyboardType="number-pad"
                value={digit}
                onChangeText={(text) => handleChangeText(text, idx)}
                onKeyPress={(e) => handleKeyPress(e, idx)}
                textAlign="center"
                editable={!isReqLoading}
              />
            ))}
          </View>

          {/* Resend timer */}
          <View style={styles.timerContainer}>
            {timer > 0 ? (
              <Text style={styles.timerText}>
                Resend code in <Text style={styles.timerHighlight}>00:{timer < 10 ? '0' : ''}{timer}</Text>
              </Text>
            ) : (
              <TouchableOpacity onPress={handleResend} activeOpacity={0.7} disabled={isReqLoading}>
                <Text style={styles.resendLink}>Resend Code</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={{ flex: 1 }} />

          {/* Primary Action Button */}
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleVerify}
            activeOpacity={0.8}
            disabled={isReqLoading}
          >
            {isReqLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.primaryButtonText}>Verify</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default OtpVerify;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    flex: 1,
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
    marginBottom: ms(48),
  },
  otpBanner: {
    marginTop: ms(16),
    backgroundColor: '#F3F4F6',
    borderRadius: ms(8),
    paddingVertical: ms(8),
    paddingHorizontal: ms(16),
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  otpBannerText: {
    fontFamily: FONTS.medium24,
    fontSize: ms(14),
    color: '#374151',
  },
  otpBannerCode: {
    fontFamily: FONTS.bold28,
    color: COLORS.Primary || '#6337EB',
  },
  title: {
    fontFamily: FONTS.bold28,
    fontSize: ms(26),
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
  emailText: {
    fontFamily: FONTS.semiBold24,
    color: '#1F2937',
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: ms(40),
  },
  otpInput: {
    width: ms(46),
    height: ms(54),
    borderWidth: ms(1),
    borderColor: '#D1D5DB',
    borderRadius: ms(10),
    fontSize: ms(20),
    fontFamily: FONTS.bold28,
    color: '#111827',
    backgroundColor: '#FFFFFF',
  },
  otpInputFilled: {
    borderColor: COLORS.Primary,
    borderWidth: ms(1.5),
  },
  timerContainer: {
    alignItems: 'center',
  },
  timerText: {
    fontFamily: FONTS.regular24,
    fontSize: ms(15),
    color: '#6B7280',
  },
  timerHighlight: {
    fontFamily: FONTS.medium24,
    color: '#1F2937',
  },
  resendLink: {
    fontFamily: FONTS.semiBold24,
    fontSize: ms(15),
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
    marginBottom: ms(16),
  },
  primaryButtonText: {
    fontFamily: FONTS.semiBold24,
    fontSize: ms(16),
    color: '#FFFFFF',
  },
});
