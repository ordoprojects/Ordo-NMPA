import React, { useState, useEffect } from 'react';
import { 
  View, 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Dimensions,
  Platform 
} from 'react-native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
  const [isOpen, setIsOpen] = useState(false);
  const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिंदी' },
    { code: 'kn', name: 'ಕನ್ನಡ' }
  ];

  useEffect(() => {
    const loadLanguage = async () => {
      const savedLang = await AsyncStorage.getItem('appLanguage');
      if (savedLang) {
        setCurrentLanguage(savedLang);
        await i18n.changeLanguage(savedLang);
      }
    };
    loadLanguage();

    // Handle screen rotation
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenWidth(window.width);
    });

    return () => subscription?.remove();
  }, []);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleLanguageSelect = async (languageCode) => {
    try {
      await i18n.changeLanguage(languageCode);
      setCurrentLanguage(languageCode);
      await AsyncStorage.setItem('appLanguage', languageCode);
      setIsOpen(false);
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  const getLanguageName = (code) => {
    const lang = languages.find((l) => l.code === code);
    return lang ? lang.name : code;
  };

  // Calculate responsive width based on screen size
  const getSelectorWidth = () => {
    if (screenWidth <= 390) { // Samsung A55 and similar small devices
      return 100; // Reduced width for small screens
    } else if (screenWidth <= 414) { // iPhone 11/12/13, etc.
      return 120;
    } else { // Larger devices
      return 140;
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        onPress={toggleDropdown} 
        style={[styles.selectedLanguage, { width: getSelectorWidth() }]}
      >
        <Text 
          style={styles.languageText}
          numberOfLines={1}
          adjustsFontSizeToFit={true}
          minimumFontScale={0.8}
        >
          {getLanguageName(currentLanguage)}
        </Text>
      </TouchableOpacity>

      {isOpen && (
        <ScrollView 
          style={[styles.dropdown, { width: getSelectorWidth() }]}
          keyboardShouldPersistTaps="always"
        >
          {languages.map((language) => (
            <TouchableOpacity
              key={language.code}
              style={[
                styles.languageOption,
                currentLanguage === language.code && styles.selectedOption
              ]}
              onPress={() => handleLanguageSelect(language.code)}
            >
              <Text 
                style={styles.languageText}
                numberOfLines={1}
                adjustsFontSizeToFit={true}
                minimumFontScale={0.8}
              >
                {language.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 1000,
    alignItems: 'flex-end',
  },
  selectedLanguage: {
    padding: 8, // Reduced padding
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 35, // Reduced height
    borderWidth: 1,
    borderColor: '#ddd',
  },
  dropdown: {
    position: 'absolute',
    top: 40, // Adjusted position
    right: 0,
    backgroundColor: 'white',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    maxHeight: 120, // Reduced height
    borderWidth: 1,
    borderColor: '#ddd',
      zIndex: 999, 
  },
  languageOption: {
    padding: 8, // Reduced padding
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    minHeight: 35, // Reduced height
    justifyContent: 'center',
  },
  selectedOption: {
    backgroundColor: '#e0e0e0',
  },
  languageText: {
    textAlign: 'center',
    fontSize: 12, // Reduced font size
    fontWeight: '500',
  },
});

export default LanguageSelector;