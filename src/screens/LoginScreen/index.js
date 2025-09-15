import React, { useState ,useCallback} from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, SafeAreaView,
    KeyboardAvoidingView, Platform, ScrollView, Keyboard, TouchableWithoutFeedback,
    Dimensions ,BackHandler
 } from 'react-native';
import { TextInput } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../../constants/Colors';
import { BASE_URL } from '../../navigation/Config';
import Toast from 'react-native-simple-toast';
import { useRole } from '../../Context/RoleContext';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../../components/LanguageSelector';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; 
import { useFocusEffect } from '@react-navigation/native';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { setRole } = useRole();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  // Get screen dimensions
  const { width, height } = Dimensions.get('window');
  const isSmallDevice = height < 700; // You can adjust this threshold

  useFocusEffect(
  useCallback(() => {
    const onBackPress = () => {
      console.log("dfghjnk")
      // Disable going back from login
      return true; // true = prevent default, false = allow
    };

    BackHandler.addEventListener('hardwareBackPress', onBackPress);

    return () =>
      BackHandler.removeEventListener('hardwareBackPress', onBackPress);
  }, [])
);


  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    // Case sensitive authentication
    if (!username.trim() || !password.trim()) {
      Toast.show(t('validation_username_password'), Toast.LONG);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: username.trim(), // Case sensitive
          password: password.trim() // Case sensitive
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || t('login_failed'));
      }

      // Handle multiple roles case first
      if (data.roles && Array.isArray(data.roles)) {
        console.log('Multiple roles detected - navigating to role selection');
        navigation.navigate('Selection', {
          tempToken: data.temp_token,
          availableRoles: data.roles,
          email: username.trim()
        });
        return;
      }

      // Rest of your login function remains the same...
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
          email: username.trim()
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
      console.error('Login error:', error);
      Toast.show(error.message || t('login_failed'), Toast.LONG);
    } finally {
      setIsLoading(false);
    }
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
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
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

            {/* Username field with floating label */}
            <View style={[styles.inputContainer, isSmallDevice && styles.inputContainerSmall]}>
              <TextInput
                label={t('username')}
                value={username}
                onChangeText={setUsername}
                mode="outlined"
                autoCapitalize="none"
                style={styles.input}
                theme={{
                  colors: {
                    primary: Colors.darkBlue,
                    placeholder: '#607a8a',
                    text: '#111518',
                  },
                }}
              />
            </View>

            {/* Password field with floating label */}
            <View style={[styles.inputContainer, isSmallDevice && styles.inputContainerSmall]}>
              <TextInput
                label={t('password')}
                value={password}
                onChangeText={setPassword}
                mode="outlined"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                style={styles.input}
                right={
                  <TextInput.Icon 
                    icon={showPassword ? "eye-off" : "eye"} 
                    onPress={toggleShowPassword}
                    color="#607a8a"
                  />
                }
                theme={{
                  colors: {
                    primary: Colors.darkBlue,
                    placeholder: '#607a8a',
                    text: '#111518',
                  },
                }}
              />
            </View>

            <TouchableOpacity 
              style={[styles.button, isLoading && styles.buttonDisabled, 
                     isSmallDevice && styles.buttonSmall]} 
              onPress={handleLogin}
              disabled={isLoading}
            >
              {/* Translated button text */}
              <Text style={styles.buttonText}>
                {isLoading ? t('logging_in') : t('login')}
              </Text>
            </TouchableOpacity>
{/* <TouchableOpacity 
  style={styles.forgotPasswordContainer}
  onPress={() => navigation.navigate('Verify')}
>
  <Text style={styles.forgotPasswordText}>
    {t('forgot_password')}
  </Text>
</TouchableOpacity> */}
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
  forgotPasswordContainer: {
  marginTop: 15,
  alignSelf: 'center',
},
forgotPasswordText: {
  color: Colors.darkBlue,
  fontSize: 16,
  fontWeight: '500',
},
});

export default LoginScreen;
