import React, { useState, useRef, useEffect } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  SafeAreaView, Keyboard, ActivityIndicator, Modal, Platform 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Colors from '../../constants/Colors';
import { useTranslation } from 'react-i18next';
import { BASE_URL } from '../../navigation/Config';
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRole } from '../../Context/RoleContext';
import SmsRetriever from 'react-native-sms-retriever';


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
    if (!hasSeenOtpModal) {
      setShowOtpModal(true);
      setHasSeenOtpModal(true);
    }

    if (resendTimeout > 0) {
      const timer = setTimeout(() => setResendTimeout(resendTimeout - 1), 1000);
      return () => clearTimeout(timer);
    }

    // Start listening for OTP automatically on Android
    if (Platform.OS === 'android') {
      startListeningForOtp();
    }

    return () => {
      if (Platform.OS === 'android') {
        SmsRetriever.removeSmsListener();
      }
    };
  }, [resendTimeout, hasSeenOtpModal]);

  // Listen to incoming SMS and extract OTP (no hash required)
  const startListeningForOtp = async () => {
    try {
      await SmsRetriever.startSmsRetriever();

      SmsRetriever.addSmsListener(event => {
        if (event && event.message) {
          extractOtpFromSms(event.message);
        }
      });
    } catch (error) {
      console.log('SMS listener error (non-critical):', error);
    }
  };

  const extractOtpFromSms = (message) => {
    if (!message) return;

    // Extract first 6-digit number from message
    const otpMatch = message.match(/\b\d{6}\b/);
    if (otpMatch) {
      const otpCode = otpMatch[0];
      autoFillOtp(otpCode);
    }
  };

  const autoFillOtp = (otpCode) => {
    const otpArray = otpCode.split('');
    setOtp(otpArray);
   Toast.show(t('otp_auto_filled'), Toast.SHORT);


    // Auto-submit after short delay
    setTimeout(() => {
      if (otpArray.length === 6) {
        handleVerifyOTP();
      }
    }, 500);
  };

  const handleSendOTP = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/auth/otp/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: phoneNumber }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || t('otp_send_failed'));

      Toast.show(t('otp_sent_successfully'), Toast.LONG);
      setResendTimeout(30);
      setShowOtpModal(true);
    } catch (error) {
      console.error('OTP send error:', error);
      Toast.show(error.message || t('otp_send_failed'), Toast.LONG);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendTimeout <= 0) {
      await handleSendOTP();
    }
  };

 const handleVerifyOTP = async () => {
  const otpCode = otp.join('');
  if (otpCode.length !== 6 || !otpCode.match(/^\d{6}$/)) {
    Toast.show(t('please_enter_valid_otp'), Toast.LONG);
    return;
  }


    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/auth/otp/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: phoneNumber, otp_code: otpCode }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || t('otp_verification_failed'));

      if (data.roles && data.roles.length > 1) {
        navigation.navigate('Selection', {
          tempToken: data.temp_token,
          availableRoles: data.roles,
          phoneNumber,
        });
        return;
      }

      if (!data.token) throw new Error(t('no_auth_token_received'));

      const decodeJWT = (token) => {
        try {
          const [, payload] = token.split('.');
          const decoded = Buffer.from(payload, 'base64').toString('utf-8');
          return JSON.parse(decoded);
        } catch (error) {
          throw new Error(t('failed_to_process_user_data'));
        }
      };

      const userData = decodeJWT(data.token);
      const authData = {
        token: data.token,
        user: {
          id: userData.user_id,
          firstName: userData.first_name,
          lastName: userData.last_name,
          role: userData.role,
          phoneNumber,
        },
        expiresAt: userData.exp * 1000,
      };

      await AsyncStorage.setItem('authData', JSON.stringify(authData));
      setRole(userData.role);

      Toast.show(t('login_success'), Toast.LONG);
      navigation.reset({
        index: 0,
        routes: [{ name: userData.role === 'doctor' ? 'DoctorHome' : 'Main' }],
      });
    } catch (error) {
      console.error('OTP verification error:', error);
      Toast.show(error.message || t('otp_verification_failed'), Toast.LONG);
    } finally {
      setIsLoading(false);
    }
  };

 useEffect(() => {
  const otpCode = otp.join('');
  if (otpCode.length === 6 && otpCode.match(/^\d{6}$/)) {
    const autoSubmit = setTimeout(() => {
      console.log('Auto-submitting OTP:', otpCode);
      handleVerifyOTP();
    }, 500);
    
    return () => clearTimeout(autoSubmit);
  }
}, [otp]);

// Simplify handleOtpChange (remove auto-submit logic)
const handleOtpChange = (value, index) => {
  const newOtp = [...otp];
  if (value.length > 1) {
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
  
  if (value && index < 5) otpInputs.current[index + 1]?.focus();
};

// Uncomment validation in handleVerifyOTP

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace') {
      const newOtp = [...otp];
      if (!newOtp[index] && index > 0) {
        newOtp[index - 1] = '';
        setOtp(newOtp);
        otpInputs.current[index - 1]?.focus();
      } else if (newOtp[index]) {
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }
  };

  const closeModal = () => setShowOtpModal(false);

  const getAutoFillMessage = () =>
    Platform.OS === 'android' ? t('android_autofill_message') : t('ios_autofill_message');

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.topArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <AntDesign name='arrowleft' size={25} color={Colors.black} />
          </TouchableOpacity>
          <Text style={styles.title}>{t('enter_otp')}</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.subtitle}>{t('otp_sent_to')} {phoneNumber}</Text>
          <View style={styles.otpContainer}>
            {[0,1,2,3,4,5].map(index => (
              <TextInput
                key={index}
                ref={ref => otpInputs.current[index] = ref}
                style={[
                  styles.otpInput,
                  otp[index] ? styles.otpInputFilled : styles.otpInputEmpty
                ]}
                keyboardType="numeric"
                maxLength={1}
                value={otp[index]}
                onChangeText={value => handleOtpChange(value, index)}
                onKeyPress={e => handleKeyPress(e, index)}
                selectTextOnFocus
                onSubmitEditing={Keyboard.dismiss}
                editable={!isLoading}
                textContentType="oneTimeCode"
                autoComplete="one-time-code"
              />
            ))}
          </View>

          <TouchableOpacity onPress={handleResendOTP} disabled={resendTimeout > 0 || isLoading}>
            <Text style={[styles.resendText, (resendTimeout > 0 || isLoading) && styles.resendTextDisabled]}>
              {resendTimeout > 0 ? `${t('resend_in')} ${resendTimeout} ${t('seconds')}` : t('resend_otp')}
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
              styles.verifyButton,
              otp.join('').length === 6 ? styles.verifyButtonActive : styles.verifyButtonInactive
            ]}
            onPress={handleVerifyOTP}
            disabled={otp.join('').length !== 6 || isLoading}
          >
            <Text style={styles.verifyButtonText}>{t('verify')}</Text>
          </TouchableOpacity>
        )}
      </SafeAreaView>

      {/* OTP Modal */}
      <Modal animationType="slide" transparent visible={showOtpModal} onRequestClose={closeModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('otp_sent_title')}</Text>
            <Text style={styles.modalText}>{t('otp_sent_message')}</Text>
            <Text style={styles.autoFillInfo}>{getAutoFillMessage()}</Text>
            <TouchableOpacity style={[styles.modalButton, styles.modalCloseButton]} onPress={closeModal}>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  title: {
    flex: 1,
    color: '#0d141c',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginRight: 40,
  },
  subtitle: {
    color: '#49719c',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
    gap: 12,
  },
  otpInput: {
    width: 50,
    height: 60,
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    borderWidth: 2,
  },
  otpInputEmpty: {
    backgroundColor: '#ffffff',
    borderColor: '#d1d5db',
    color: '#0d141c',
  },
  otpInputFilled: {
    backgroundColor: '#f0f9ff',
    borderColor: Colors.darkBlue,
    color: '#0d141c',
  },
  resendText: {
    color: Colors.darkBlue,
    fontSize: 16,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  resendTextDisabled: {
    color: '#9ca3af',
  },
  verifyButton: {
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifyButtonActive: {
    backgroundColor: Colors.darkBlue,
  },
  verifyButtonInactive: {
    backgroundColor: '#9ca3af',
  },
  verifyButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '85%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: Colors.darkBlue,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
    color: '#374151',
    lineHeight: 22,
  },
  autoFillInfo: {
    fontSize: 14,
    textAlign: 'center',
    color: '#6b7280',
    marginBottom: 24,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  modalButton: {
    backgroundColor: Colors.darkBlue,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  modalCloseButton: {
    backgroundColor: '#6c757d',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OTPScreen;
