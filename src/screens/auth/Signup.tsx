import React, { useState } from 'react';
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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS } from '../../utils/constants';
import { ms } from '../../utils/helper/metric';

const Signup = () => {
  const navigation = useNavigation<any>();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secureText, setSecureText] = useState(true);
  const [secureConfirmText, setSecureConfirmText] = useState(true);
  const [agree, setAgree] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Top Bar */}
          <View style={styles.topBar}>
            <View />
            <TouchableOpacity style={styles.langButton} activeOpacity={0.7}>
              <Text style={styles.langText}>EN ▾</Text>
            </TouchableOpacity>
          </View>

          {/* Title */}
          <Text style={styles.title}>Create Account</Text>

          {/* Form */}
          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="Full name"
              placeholderTextColor="#9CA3AF"
              value={fullName}
              onChangeText={setFullName}
            />

            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
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
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setSecureText(!secureText)}
                activeOpacity={0.7}
              >
                <Text style={styles.eyeText}>{secureText ? '👁️' : '👁️‍🗨️'}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Confirm password"
                placeholderTextColor="#9CA3AF"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={secureConfirmText}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setSecureConfirmText(!secureConfirmText)}
                activeOpacity={0.7}
              >
                <Text style={styles.eyeText}>{secureConfirmText ? '👁️' : '👁️‍🗨️'}</Text>
              </TouchableOpacity>
            </View>

            {/* Checkbox row */}
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setAgree(!agree)}
              activeOpacity={0.8}
            >
              <View style={[styles.checkbox, agree && styles.checkboxActive]}>
                {agree && <Text style={styles.checkMark}>✓</Text>}
              </View>
              <Text style={styles.checkboxLabel}>
                I agree to the <Text style={styles.linkText}>Terms of Use</Text> and{' '}
                <Text style={styles.linkText}>Privacy Policy</Text>.
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => navigation.navigate('Otp')}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>Sign Up</Text>
            </TouchableOpacity>
          </View>

          {/* Bottom Link */}
          <View style={styles.bottomContainer}>
            <Text style={styles.bottomLabel}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')} activeOpacity={0.7}>
              <Text style={styles.bottomLink}>Log in</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Signup;

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
  eyeText: {
    fontSize: ms(20),
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: ms(8),
    marginBottom: ms(32),
  },
  checkbox: {
    width: ms(22),
    height: ms(22),
    borderWidth: ms(2),
    borderColor: '#D1D5DB',
    borderRadius: ms(6),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: ms(12),
    marginTop: ms(2),
  },
  checkboxActive: {
    borderColor: COLORS.Primary,
    backgroundColor: COLORS.Primary,
  },
  checkMark: {
    color: '#FFFFFF',
    fontSize: ms(14),
    fontWeight: 'bold',
  },
  checkboxLabel: {
    flex: 1,
    fontFamily: FONTS.regular24,
    fontSize: ms(14),
    color: '#4B5563',
    lineHeight: ms(20),
  },
  linkText: {
    color: '#1293ED',
    fontFamily: FONTS.medium24,
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