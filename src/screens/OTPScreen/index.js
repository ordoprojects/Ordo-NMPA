import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Keyboard, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Colors from '../../constants/Colors';
import { useTranslation } from 'react-i18next'; // Import useTranslation

const OTPScreen = ({ route }) => {
  const navigation = useNavigation();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpInputs = useRef([]);
  const [resendTimeout, setResendTimeout] = useState(30);
  const { t } = useTranslation(); // Use the translation hook

  useEffect(() => {
    if (resendTimeout > 0) {
      const timer = setTimeout(() => setResendTimeout(resendTimeout - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimeout]);

  const handleResendOTP = () => {
    if (resendTimeout <= 0) {
      Alert.alert(t('otp_sent_title'), t('otp_sent_message'));
      setResendTimeout(30);
    }
  };

  const handleLogin = () => {
    // Validate OTP (should be 6 digits)
    if (otp.join('').length !== 6) {
      Alert.alert('Error', t('validation_otp'));
      return;
    }
    
    // Simply navigate to next screen when 6 digits are entered
    navigation.navigate('Selection');
  };

  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    
    // Only allow single digit input
    if (value.length > 1) {
      // If user pastes a code, split it into individual digits
      const digits = value.split('').slice(0, 6 - index);
      digits.forEach((digit, i) => {
        if (index + i < 6) {
          newOtp[index + i] = digit;
          if (index + i < 5 && digit) {
            setTimeout(() => otpInputs.current[index + i + 1]?.focus(), 0);
          }
        }
      });
    } else {
      newOtp[index] = value;
    }
    
    setOtp(newOtp);

    // Auto focus to next input
    if (value && index < 5) {
      otpInputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    // Handle backspace key
    if (e.nativeEvent.key === 'Backspace') {
      const newOtp = [...otp];
      
      // If current box is empty, delete previous box's value
      if (!newOtp[index] && index > 0) {
        newOtp[index - 1] = '';
        setOtp(newOtp);
        otpInputs.current[index - 1]?.focus();
      } 
      // If current box has value, just clear it
      else if (newOtp[index]) {
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.topArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <AntDesign name='arrowleft' size={25} color={Colors.black} />
          </TouchableOpacity>
          <Text style={styles.title}>{t('enter_otp')}</Text>
        </View>

        <View style={{marginTop: '10%'}}>
          <Text style={styles.subtitle}>
            {t('otp_sent')}
          </Text>

          <View style={styles.otpContainer}>
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <TextInput
                key={index}
                ref={(ref) => (otpInputs.current[index] = ref)}
                style={[
                  styles.otpInput,
                  otp[index] ? styles.otpInputFilled : styles.otpInputEmpty
                ]}
                keyboardType="numeric"
                maxLength={1}
                value={otp[index]}
                onChangeText={(value) => handleOtpChange(value, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                selectTextOnFocus
                onSubmitEditing={Keyboard.dismiss}
              />
            ))}
          </View>

          <TouchableOpacity onPress={handleResendOTP} disabled={resendTimeout > 0}>
            <Text style={[styles.resendText, resendTimeout > 0 && {color: '#ccc'}]}>
              {resendTimeout > 0 
                ? `${t('resend_in')} ${resendTimeout}${t('seconds')}` 
                : t('resend_otp')
              }
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <SafeAreaView style={styles.bottomArea}>
        <TouchableOpacity 
          style={[
            styles.loginButton,
            otp.join('').length === 6 ? styles.loginButtonActive : styles.loginButtonInactive
          ]} 
          onPress={handleLogin}
          disabled={otp.join('').length !== 6}
        >
          <Text style={styles.loginButtonText}>{t('login')}</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  topArea: {
    flex: 1,
    paddingHorizontal: 16,
  },
  bottomArea: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 8,
    paddingTop: 16,
  },
  backButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    color: '#0d141c',
    fontSize: 24,
  },
  title: {
    flex: 1,
    color: '#0d141c',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginRight: '10%',
  },
  subtitle: {
    color: '#49719c',
    fontSize: 16,
    textAlign: 'center',
    paddingBottom: 12,
    paddingTop: 4,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 16,
  },
  otpInput: {
    width: 48,
    height: 56,
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 16,
    color: '#0d141c',
  },
  otpInputEmpty: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cedbe8',
  },
  otpInputFilled: {
    backgroundColor: '#e0f2fe',
    borderWidth: 1,
    borderColor: '#2086f3',
  },
  resendText: {
    color: '#49719c',
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 4,
    textDecorationLine: 'underline',
  },
  footer: {
    padding: 16,
    paddingBottom: 20,
    backgroundColor: '#f8fafc',
  },
  loginButton: {
    borderRadius: 10,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtonActive: {
    backgroundColor: Colors.darkBlue,
  },
  loginButtonInactive: {
    backgroundColor: '#728daeff',
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.015,
  },
});

export default OTPScreen;