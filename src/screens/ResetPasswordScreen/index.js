import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import Colors from '../../constants/Colors';
import { BASE_URL } from '../../navigation/Config';
import Toast from 'react-native-simple-toast';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../../components/LanguageSelector';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';

const ResetPasswordScreen = ({ route,navigation }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { t } = useTranslation();
  const { aadharLastFour } = route.params;

  const toggleShowNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      Toast.show(t('validation_all_fields'), Toast.LONG);
      return;
    }

    if (newPassword !== confirmPassword) {
      Toast.show(t('validation_password_match'), Toast.LONG);
      return;
    }

    if (newPassword.length < 6) {
      Toast.show(t('validation_password_length'), Toast.LONG);
      return;
    }

    setIsLoading(true);

    try {
      // In a real app, you would make an API call to reset the password
      // For demonstration, we'll simulate a successful reset
      // const response = await fetch(`${BASE_URL}/auth/reset-password/`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     aadhar_last_four: aadharLastFour,
      //     new_password: newPassword
      //   }),
      // });
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, we'll assume reset is successful
      // In a real app, you would check the response
      Toast.show(t('password_reset_success'), Toast.LONG);
      
      // Navigate back to login
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }]
      });
    } catch (error) {
      console.error('Password reset error:', error);
      Toast.show(t('password_reset_failed'), Toast.LONG);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
                  <AntDesign name='arrowleft' size={25} color={Colors.black} />
                </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.title}>{t('reset_password')}</Text>
          <Text style={styles.subtitle}>{t('enter_new_password')}</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>{t('new_password')}</Text>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder={t('enter_new_password')}
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={!showNewPassword}
              />
              <TouchableOpacity 
                style={styles.eyeIcon} 
                onPress={toggleShowNewPassword}
              >
                <Ionicons 
                  name={showNewPassword ? 'eye-off' : 'eye'} 
                  size={24} 
                  color="#607a8a" 
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>{t('confirm_password')}</Text>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder={t('confirm_password')}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity 
                style={styles.eyeIcon} 
                onPress={toggleShowConfirmPassword}
              >
                <Ionicons 
                  name={showConfirmPassword ? 'eye-off' : 'eye'} 
                  size={24} 
                  color="#607a8a" 
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.button} 
            onPress={handleResetPassword}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? t('resetting') : t('reset_password')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  title: {
    color: Colors.darkBlue,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    color: '#607a8a',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    color: '#111518',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dbe2e6',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  passwordInput: {
    flex: 1,
    height: 56,
    padding: 15,
    fontSize: 16,
    color: '#111518',
  },
  eyeIcon: {
    padding: 15,
  },
  button: {
    width: '100%',
    height: 48,
    backgroundColor: Colors.darkBlue,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  languageSelectorContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1000,
  },
   header: {
    flexDirection: 'row',
    alignItems: 'center',
    // paddingBottom: '10%',
    paddingTop: 16,
    paddingHorizontal: 16,

  },
});

export default ResetPasswordScreen;