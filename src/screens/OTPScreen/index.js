import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Keyboard, Alert, ActivityIndicator, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Colors from '../../constants/Colors';
import { useTranslation } from 'react-i18next';
import { BASE_URL } from '../../navigation/Config';
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRole } from '../../Context/RoleContext';

const OTPScreen = ({ route }) => {
  const navigation = useNavigation();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [hasSeenOtpModal, setHasSeenOtpModal] = useState(false);
  const otpInputs = useRef([]);
  const [resendTimeout, setResendTimeout] = useState(30);
  const { t } = useTranslation();
  const { setRole } = useRole();
  const { phoneNumber } = route.params;

  useEffect(() => {
    // Show the OTP modal only once when the screen loads
    if (!hasSeenOtpModal) {
      setShowOtpModal(true);
      setHasSeenOtpModal(true);
    }
    
    if (resendTimeout > 0) {
      const timer = setTimeout(() => setResendTimeout(resendTimeout - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimeout, hasSeenOtpModal]);

  const handleResendOTP = async () => {
    if (resendTimeout <= 0) {
      setIsLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/auth/otp/send`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phone_number: phoneNumber
          }),
        });

        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || t('otp_send_failed'));
        }

        Toast.show(t('otp_resent'), Toast.LONG);
        setResendTimeout(30);
        setShowOtpModal(true); // Show the modal again when OTP is resent
      } catch (error) {
        console.error('OTP resend error:', error);
        Toast.show(error.message || t('otp_send_failed'), Toast.LONG);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleVerifyOTP = async () => {
    // Validate OTP (should be 6 digits)
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      Alert.alert('Error', t('validation_otp'));
      return;
    }
    
    setIsLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/auth/otp/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone_number: phoneNumber,
          otp_code: otpCode
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || t('otp_verification_failed'));
      }

      // Handle multiple roles case
      if (data.roles && Array.isArray(data.roles) && data.roles.length > 1) {
        console.log('Multiple roles detected - navigating to role selection');
        navigation.navigate('Selection', {
          tempToken: data.temp_token,
          availableRoles: data.roles,
          phoneNumber: phoneNumber
        });
        return;
      }

      // Single role case - proceed with login
      if (!data.token) {
        throw new Error('No authentication token received');
      }

      const decodeJWT = (token) => {
        try {
          const [, payload] = token.split('.');
          if (!payload) throw new Error('Invalid token format');
          const decoded = Buffer.from(payload, 'base64').toString('utf-8');
          return JSON.parse(decoded);
        } catch (error) {
          console.error('JWT decode error:', error);
          throw new Error('Failed to process user data');
        }
      };

      const userData = decodeJWT(data.token);
      if (!userData?.user_id) {
        throw new Error('Invalid user data in token');
      }

      const authData = {
        token: data.token,
        user: {
          id: userData.user_id,
          firstName: userData.first_name,
          lastName: userData.last_name,
          role: userData.role,
          phoneNumber: phoneNumber
        },
        expiresAt: userData.exp * 1000
      };

      await AsyncStorage.setItem('authData', JSON.stringify(authData));
      setRole(userData.role);
      Toast.show(t('login_success'), Toast.LONG);
      
      navigation.reset({
        index: 0,
        routes: [{ name: userData.role === 'doctor' ? 'DoctorHome' : 'Main' }]
      });

    } catch (error) {
      console.error('OTP verification error:', error);
      Toast.show(error.message || t('otp_verification_failed'), Toast.LONG);
    } finally {
      setIsLoading(false);
    }
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
    
    // Auto submit when all digits are entered
    if (newOtp.every(digit => digit !== '') && newOtp.length === 6) {
      handleVerifyOTP();
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

  const fillFixedOtp = () => {
    const fixedOtp = '123456'.split('');
    setOtp(fixedOtp);
    setShowOtpModal(false);
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
            {t('otp_sent_to')} {phoneNumber}
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
                editable={!isLoading}
              />
            ))}
          </View>

          <TouchableOpacity onPress={handleResendOTP} disabled={resendTimeout > 0 || isLoading}>
            <Text style={[styles.resendText, (resendTimeout > 0 || isLoading) && {color: '#ccc'}]}>
              {resendTimeout > 0 
                ? `${t('resend_in')} ${resendTimeout}${t('seconds')}` 
                : t('resend_otp')
              }
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <SafeAreaView style={styles.bottomArea}>
        {isLoading ? (
          <ActivityIndicator size="large" color={Colors.darkBlue} />
        ) : (
          <TouchableOpacity 
            style={[
              styles.loginButton,
              otp.join('').length === 6 ? styles.loginButtonActive : styles.loginButtonInactive
            ]} 
            onPress={handleVerifyOTP}
            disabled={otp.join('').length !== 6 || isLoading}
          >
            <Text style={styles.loginButtonText}>{t('verify')}</Text>
          </TouchableOpacity>
        )}
      </SafeAreaView>

      {/* OTP Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showOtpModal}
        onRequestClose={() => setShowOtpModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('otp_sent_title')}</Text>
            <Text style={styles.modalText}>
              {t('otp_sent_message')}
            </Text>
            <Text style={styles.otpCode}>123456</Text>
            
            <TouchableOpacity 
              style={styles.modalButton}
              onPress={fillFixedOtp}
            >
              <Text style={styles.modalButtonText}>{t('auto_fill_otp')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.modalButton, styles.modalCloseButton]}
              onPress={() => setShowOtpModal(false)}
            >
              <Text style={styles.modalButtonText}>{t('close')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: Colors.darkBlue,
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  otpCode: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.darkBlue,
    marginBottom: 20,
    letterSpacing: 4,
  },
  modalButton: {
    backgroundColor: Colors.darkBlue,
    padding: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalCloseButton: {
    backgroundColor: '#6c757d',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default OTPScreen;