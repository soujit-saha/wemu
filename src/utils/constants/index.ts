// App configuration constants

interface AppConstants {
  readonly TOKEN: string;
  readonly BASE_URL: string;
}

export const constants: AppConstants = {
  TOKEN: 'TOKEN',
  BASE_URL: "https://wemu.swastechinfoinnovations.in/web/public/api"
} as const;

// Colors extracted from Figma design
export const COLORS = {
  // Semantic colors
  success: '#34A853', // Chateau Green
  warning: '#FBBC04',
  error: '#EB001B', // Red
  info: '#4285F4', // Cornflower Blue

  // Neutral colors
  white: '#FFFFFF',
  black: '#000000',
  codGray: '#1C1C1C',
  shuttleGray: '#5F6368',
  waterloo: '#808191',
  alto: '#D9D9D9',
  whiteLinen: '#F8F2EA',

  // Background colors
  background: '#FFFFFF',
  backgroundSecondary: '#F8F9FB',
  surface: '#F8F2EA',

  // Text colors
  textPrimary: '#000000',
  textSecondary: '#1C1C1C',
  textTertiary: 'rgba(0, 0, 0, 0.7)',
  placeholder: '#808191',

  // Border colors
  border: '#D9D9D9',
  borderLight: '#D4CEC6',

  //   Primary / brand

  // #5D33D6 — main Wemu purple
  // #7051CA — secondary purple
  // #9385E5 — soft accent purple

  // Splash background / light UI tones

  // #F2EFFC
  // #EBEBFB
  // #DEDBF9
  // #D5D3F8
  // #CDCAF6

  // Text / accent blue

  // #7DB5DF — light blue subtitle accent

  Primary: '#6337EB',
  Secondary: '#1293ED',
  Background: '#FFFFFF',
  Text: '#1F1F1F',
  Inactive: '#bbbabaff',
  outline: '#8E8E93',

  // Music Player colors
  playGradientStart: '#6337EB',
  playGradientMiddle: '#2C6BDD',
  playGradientEnd: '#1293EB',
  playTextPrimary: '#FFFFFF',
  playTextSecondary: 'rgba(255, 255, 255, 0.7)',
  playTrackProgress: '#FFFFFF',
  playTrackBackground: 'rgba(255, 255, 255, 0.3)',
};

export const FONTS = {
  thin18: 'Inter_18pt-Thin',
  thin18Italic: 'Inter_18pt-ThinItalic',
  extraLight18: 'Inter_18pt-ExtraLight',
  extraLight18Italic: 'Inter_18pt-ExtraLightItalic',
  light18: 'Inter_18pt-Light',
  light18Italic: 'Inter_18pt-LightItalic',
  regular18: 'Inter_18pt-Regular',
  italic18: 'Inter_18pt-Italic',
  medium18: 'Inter_18pt-Medium',
  medium18Italic: 'Inter_18pt-MediumItalic',
  semiBold18: 'Inter_18pt-SemiBold',
  semiBold18Italic: 'Inter_18pt-SemiBoldItalic',
  bold18: 'Inter_18pt-Bold',
  bold18Italic: 'Inter_18pt-BoldItalic',
  extraBold18: 'Inter_18pt-ExtraBold',
  extraBold18Italic: 'Inter_18pt-ExtraBoldItalic',
  black18: 'Inter_18pt-Black',
  black18Italic: 'Inter_18pt-BlackItalic',
  thin24: 'Inter_24pt-Thin',
  thin24Italic: 'Inter_24pt-ThinItalic',
  extraLight24: 'Inter_24pt-ExtraLight',
  extraLight24Italic: 'Inter_24pt-ExtraLightItalic',
  light24: 'Inter_24pt-Light',
  light24Italic: 'Inter_24pt-LightItalic',
  regular24: 'Inter_24pt-Regular',
  italic24: 'Inter_24pt-Italic',
  medium24: 'Inter_24pt-Medium',
  medium24Italic: 'Inter_24pt-MediumItalic',
  semiBold24: 'Inter_24pt-SemiBold',
  semiBold24Italic: 'Inter_24pt-SemiBoldItalic',
  bold24: 'Inter_24pt-Bold',
  bold24Italic: 'Inter_24pt-BoldItalic',
  extraBold24: 'Inter_24pt-ExtraBold',
  extraBold24Italic: 'Inter_24pt-ExtraBoldItalic',
  black24: 'Inter_24pt-Black',
  black24Italic: 'Inter_24pt-BlackItalic',
  thin28: 'Inter_28pt-Thin',
  thin28Italic: 'Inter_28pt-ThinItalic',
  extraLight28: 'Inter_28pt-ExtraLight',
  extraLight28Italic: 'Inter_28pt-ExtraLightItalic',
  light28: 'Inter_28pt-Light',
  light28Italic: 'Inter_28pt-LightItalic',
  regular28: 'Inter_28pt-Regular',
  italic28: 'Inter_28pt-Italic',
  medium28: 'Inter_28pt-Medium',
  medium28Italic: 'Inter_28pt-MediumItalic',
  semiBold28: 'Inter_28pt-SemiBold',
  semiBold28Italic: 'Inter_28pt-SemiBoldItalic',
  bold28: 'Inter_28pt-Bold',
  bold28Italic: 'Inter_28pt-BoldItalic',
  extraBold28: 'Inter_28pt-ExtraBold',
  extraBold28Italic: 'Inter_28pt-ExtraBoldItalic',
  black28: 'Inter_28pt-Black',
  black28Italic: 'Inter_28pt-BlackItalic',
};

export const ICONS = {
  Eye: require('../../assets/icons/Eye.png'),
  leftarrow: require('../../assets/icons/leftarrow.png'),
  loop: require('../../assets/icons/loop.png'),
  heart: require('../../assets/icons/heart.png'),
  heart_ac: require('../../assets/icons/heart_ac.png'),
  home: require('../../assets/icons/home.png'),
  home_de: require('../../assets/icons/home_de.png'),
  library: require('../../assets/icons/library.png'),
  library_de: require('../../assets/icons/library_de.png'),
  people: require('../../assets/icons/people.png'),
  people_de: require('../../assets/icons/people_de.png'),
  premium: require('../../assets/icons/premium.png'),
  premium_de: require('../../assets/icons/premium_de.png'),
  search: require('../../assets/icons/search.png'),
  shuffle: require('../../assets/icons/shuffle.png'),
  viewoff: require('../../assets/icons/viewoff.png'),
  notification: require('../../assets/icons/notification.png'),
  savefile: require('../../assets/icons/savefile.png'),
};

export const IMAGES = {
  AppLogo: require('../../assets/images/AppLogo.png'),
  MainLogo: require('../../assets/images/MainLogo.png'),
  Splash_bottom: require('../../assets/images/Splash_bottom.png'),
  Splash_bottom1: require('../../assets/images/Splash_bottom1.png'),
  Splash_bottom2: require('../../assets/images/Splash_bottom2.png'),
  logo: require('../../assets/images/logo.png'),
  onboarding_1: require('../../assets/images/onboarding_1.png'),
  onboarding_2: require('../../assets/images/onboarding_2.png'),
  onboarding_3: require('../../assets/images/onboarding_3.png'),
};

export * from './countries';
