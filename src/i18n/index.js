import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import translation files
import en from './locales/en/common.json';
import hi from './locales/hi/common.json';
import kn from './locales/kn/common.json'; // Kannada translations

const initializeI18n = async () => {
  try {
    const savedLanguage = await AsyncStorage.getItem('appLanguage');
    const lng = savedLanguage || 'en';

    await i18n
      .use(initReactI18next)
      .init({
        compatibilityJSON: 'v3',
        resources: {
          en: { translation: en },
          hi: { translation: hi },
          kn: { translation: kn } // Added Kannada
        },
        lng: lng,
        fallbackLng: 'en',
        interpolation: {
          escapeValue: false
        }
      });

    return i18n;
  } catch (error) {
    console.error('Error initializing i18n:', error);
    return i18n;
  }
};

export default initializeI18n;
