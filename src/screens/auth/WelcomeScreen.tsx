import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { clearNewRegistration } from '../../redux/reducer/AuthReducer';
import { COLORS, FONTS } from '../../utils/constants';
import { ms } from '../../utils/helper/metric';
import { useTranslation } from '../../utils/hooks/useTranslation';

const WelcomeScreen = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(clearNewRegistration());
      navigation.reset({
        index: 0,
        routes: [{ name: 'BottomTab' }],
      });
    }, 3000); // Wait 3 seconds

    return () => clearTimeout(timer);
  }, [navigation, dispatch]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('welcome') || 'Welcome to Wemu!'}</Text>
      <Text style={styles.subtitle}>{t('settingUpAccount') || 'Setting up your account...'}</Text>
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.playGradientEnd || '#121212',
  },
  title: {
    fontFamily: FONTS.bold28,
    fontSize: ms(24),
    color: '#FFFFFF',
    marginBottom: ms(10),
  },
  subtitle: {
    fontFamily: FONTS.regular24,
    fontSize: ms(16),
    color: 'rgba(255, 255, 255, 0.7)',
  },
});
