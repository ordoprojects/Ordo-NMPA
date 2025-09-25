// App.js
import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator, Text, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RoleProvider } from './src/Context/RoleContext';
import { LanguageProvider, useLanguage } from './src/Context/LanguageContext';
import { fontMap } from './src/constants/fontMap';
import { setupNotifications, setupNotificationHandlers } from './src/services/notificationService';
import initializeI18n from './src/i18n';

// Screens
import LoginScreen from './src/screens/LoginScreen';
import OTPScreen from './src/screens/OTPScreen';
import BottomTabNavigator from './src/navigation/BottomTabNavigator';
import AppStack from './src/navigation/AppStack';
import SelectionScreen from './src/screens/SelectionScreen';
import VerifyAadharScreen from './src/screens/VerifyAadharScreen';
import ResetPasswordScreen from './src/screens/ResetPasswordScreen';

const Stack = createNativeStackNavigator();

const AppContent = ({ initialRoute }) => {
  const { currentLanguage } = useLanguage();
  const fontFamily = fontMap[currentLanguage] || fontMap.en;

  // Apply globally
  Text.defaultProps = Text.defaultProps || {};
  Text.defaultProps.allowFontScaling = false;
  Text.defaultProps.includeFontPadding = false;
  Text.defaultProps.style = [{ fontFamily }];

  TextInput.defaultProps = TextInput.defaultProps || {};
  TextInput.defaultProps.allowFontScaling = false;
  TextInput.defaultProps.includeFontPadding = false;
  TextInput.defaultProps.style = [{ fontFamily }];

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Reset" component={ResetPasswordScreen} />
        <Stack.Screen name="Verify" component={VerifyAadharScreen} />
        <Stack.Screen name="OTP" component={OTPScreen} />
        <Stack.Screen name="Selection" component={SelectionScreen} />
        <Stack.Screen name="Main" component={BottomTabNavigator} />
        <Stack.Screen name="AppStack" component={AppStack} />
        {/* if you have DoctorHome, add it here */}
        {/* <Stack.Screen name="DoctorHome" component={DoctorHomeScreen} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const App = () => {
  const [i18nInitialized, setI18nInitialized] = useState(false);
  const [initialRoute, setInitialRoute] = useState(null);

  // Initialize i18n
  useEffect(() => {
    const initI18n = async () => {
      try {
        await initializeI18n();
      } catch (error) {
        console.error('Failed to initialize i18n:', error);
      } finally {
        setI18nInitialized(true);
      }
    };
    initI18n();
  }, []);

  // Check auth state on app launch
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const stored = await AsyncStorage.getItem('authData');
        if (stored) {
          const authData = JSON.parse(stored);
          // Check if token expired
          if (authData.expiresAt && Date.now() < authData.expiresAt) {
            setInitialRoute(authData.user.role === 'doctor' ? 'DoctorHome' : 'Main');
            return;
          }
        }
      } catch (error) {
        console.error('Auth restore failed:', error);
      }
      setInitialRoute('Login'); // default
    };

    if (i18nInitialized) checkAuth();
  }, [i18nInitialized]);

  // Setup notifications
  useEffect(() => {
    if (!i18nInitialized) return;
    let isMounted = true;
    let cleanupHandlers;

    const init = async () => {
      try {
        await setupNotifications();
        if (isMounted) {
          cleanupHandlers = setupNotificationHandlers();
        }
      } catch (error) {
        console.error('Notification init failed:', error);
      }
    };

    init();
    return () => {
      isMounted = false;
      if (cleanupHandlers) cleanupHandlers();
    };
  }, [i18nInitialized]);

  if (!i18nInitialized || !initialRoute) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <LanguageProvider>
      <RoleProvider>
        <AppContent initialRoute={initialRoute} />
      </RoleProvider>
    </LanguageProvider>
  );
};

export default App;
