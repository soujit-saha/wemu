import { useDispatch, useSelector } from 'react-redux';
import { setLanguage } from '../../redux/reducer/AuthReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import translations from '../../assets/languages.json';

export const useTranslation = () => {
  const dispatch = useDispatch();
  const lang = useSelector((state: any) => state.AuthReducer.lang) || 'en';

  const t = (key: keyof typeof translations.en | string) => {
    const dict = translations as any;
    return dict[lang]?.[key] || dict.en?.[key] || key;
  };

  const changeLanguage = async (selectedLang: 'en' | 'es') => {
    dispatch(setLanguage(selectedLang));
    try {
      await AsyncStorage.setItem('app_language', selectedLang);
    } catch (e) {
      console.error(e);
    }
  };

  return { t, lang, changeLanguage };
};
