import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, SafeAreaView,
    KeyboardAvoidingView, Platform, ScrollView, Dimensions, BackHandler,
    Linking, ActivityIndicator
 } from 'react-native';
import { TextInput } from 'react-native-paper';
import Colors from '../../constants/Colors';
import { BASE_URL } from '../../navigation/Config';
import Toast from 'react-native-simple-toast';
import { useRole } from '../../Context/RoleContext';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../../components/LanguageSelector';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; 
import { useFocusEffect } from '@react-navigation/native';

const LoginScreen = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setRole } = useRole();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  // Get screen dimensions
  const { width, height } = Dimensions.get('window');
  const isSmallDevice = height < 700; // You can adjust this threshold

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        // Disable going back from login
        return true; // true = prevent default, false = allow
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [])
  );

  const handleSendOTP = async () => {
    // Validate phone number
    if (!phoneNumber.trim()) {
      Toast.show(t('validation_phone_number'), Toast.LONG);
      return;
    }

    // Basic phone number validation (you can enhance this based on your requirements)
    const phoneRegex = /^[0-9]{10}$/; // Assuming 10-digit phone numbers
    if (!phoneRegex.test(phoneNumber.trim())) {
      Toast.show(t('invalid_phone_number'), Toast.LONG);
      return;
    }

    setIsLoading(true);

    try {
      // Call your API to send OTP
      const response = await fetch(`${BASE_URL}/auth/otp/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone_number: phoneNumber.trim(),
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || t('otp_send_failed'));
      }

      // Navigate to OTP verification screen
      navigation.navigate('OTP', {
        phoneNumber: phoneNumber.trim(),
      });

    } catch (error) {
      console.error('OTP send error:', error);
      Toast.show(error.message || t('otp_send_failed'), Toast.LONG);
    } finally {
      setIsLoading(false);
    }
  };

  const handleABHARegistration = () => {
    // Open the ABHA registration website
    Linking.openURL('https://abha.abdm.gov.in/abha/v3/register')
      .catch(err => console.error('Failed to open URL:', err));
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Language Selector */}
      <View style={[styles.languageSelectorContainer, { top: insets.top + 10 }]}>
        <LanguageSelector />
      </View>
      
        <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView 
          contentContainerStyle={[styles.scrollContent, {minHeight: height}]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* NMPA Logo */}
          <View style={[styles.logoContainer, isSmallDevice && styles.logoContainerSmall]}>
            <Image
              style={[styles.nmpaLogo, isSmallDevice && styles.nmpaLogoSmall]}
              source={require('../../assets/images/LogoNmpa.png')}
            />
          </View>

          <View style={[styles.content, isSmallDevice && styles.contentSmall]}>
            {/* Translated title */}
            <Text style={[styles.title, isSmallDevice && styles.titleSmall]}>{t('welcome')}</Text>

            {/* Phone number field with floating label */}
            <View style={[styles.inputContainer, isSmallDevice && styles.inputContainerSmall]}>
              <TextInput
                label={t('phone_number')}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                mode="outlined"
                keyboardType="phone-pad"
                autoCapitalize="none"
                style={styles.input}
                theme={{
                  colors: {
                    primary: Colors.darkBlue,
                    placeholder: '#607a8a',
                    text: '#111518',
                  },
                }}
                disabled={isLoading}
              />
            </View>

            {isLoading ? (
              <ActivityIndicator size="large" color={Colors.darkBlue} style={styles.loader} />
            ) : (
              <TouchableOpacity 
                style={[styles.button, isLoading && styles.buttonDisabled, 
                      isSmallDevice && styles.buttonSmall]} 
                onPress={handleSendOTP}
                disabled={isLoading}
              >
                {/* Translated button text */}
                <Text style={styles.buttonText}>
                  {isLoading ? t('sending_otp') : t('send_otp')}
                </Text>
              </TouchableOpacity>
            )}

       
          </View>

          {/* Ship Image at the bottom - responsive sizing */}
          <View style={[styles.shipImageContainer, 
                      {height: height * 0.35}]}>
            <Image
              source={require('../../assets/images/LoginImage.png')}
              style={[styles.shipImage, {width: width}]}
              resizeMode="cover"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: '20%',
  },
  logoContainerSmall: {
    marginTop: 20,
    marginBottom: 5,
  },
  nmpaLogo: {
    width: 150,
    height: 100,
    resizeMode: 'contain',
  },
  nmpaLogoSmall: {
    width: 120,
    height: 80,
  },
  content: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  contentSmall: {
    marginBottom: 10,
  },
  shipImageContainer: {
    width: '100%',
    justifyContent: 'flex-end',
  },
  shipImage: {
    height: '100%',
    resizeMode: 'cover',
  },
  title: {
    color: '#111518',
    fontSize: 22,
    fontWeight: 'bold',
    lineHeight: 28,
    letterSpacing: -0.015,
    textAlign: 'center',
    paddingBottom: 10,
    paddingTop: 0,
    marginBottom: 20,
  },
  titleSmall: {
    fontSize: 20,
    marginBottom: 15,
    paddingTop: 5,
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputContainerSmall: {
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#fff',
  },
  button: {
    width: '100%',
    height: 48,
    backgroundColor: Colors.darkBlue,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  buttonSmall: {
    height: 44,
    marginTop: 15,
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.015,
  },
  languageSelectorContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1000,
  },
  abhaContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  abhaText: {
    textAlign: 'center',
    color: '#607a8a',
    fontSize: 14,
  },
  abhaLink: {
    color: Colors.darkBlue,
    fontWeight: '500',
  },
  loader: {
    marginTop: 20,
  },
});

export default LoginScreen;