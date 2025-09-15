import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform, View, ActivityIndicator } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import { RoleProvider } from './src/Context/RoleContext';
import { setupNotifications, setupNotificationHandlers } from './src/services/notificationService';
import LoginScreen from './src/screens/LoginScreen';
import OTPScreen from './src/screens/OTPScreen';
import BottomTabNavigator from './src/navigation/BottomTabNavigator';
import AppStack from './src/navigation/AppStack';
import SelectionScreen from './src/screens/SelectionScreen';
import initializeI18n from './src/i18n'; // Import the initialize function
import { LanguageProvider } from './src/Context/LanguageContext';
import VerifyAadharScreen from './src/screens/VerifyAadharScreen';
import ResetPasswordScreen from './src/screens/ResetPasswordScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  const [i18nInitialized, setI18nInitialized] = useState(false);

  // Initialize i18n first
  useEffect(() => {
    const initI18n = async () => {
      try {
        await initializeI18n();
        setI18nInitialized(true);
      } catch (error) {
        console.error('Failed to initialize i18n:', error);
        setI18nInitialized(true); // Still continue even if i18n fails
      }
    };

    initI18n();
  }, []);

  // Setup notifications after i18n is initialized
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
      if (cleanupHandlers) {
        cleanupHandlers();
      }
    };
  }, [i18nInitialized]);

  // Show loading screen until i18n is initialized
  if (!i18nInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <LanguageProvider>
      <RoleProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Reset" component={ResetPasswordScreen} />
            <Stack.Screen name="Verify" component={VerifyAadharScreen} />
            <Stack.Screen name="OTP" component={OTPScreen} />
            <Stack.Screen name="Selection" component={SelectionScreen} />
            <Stack.Screen name="Main" component={BottomTabNavigator} />
            <Stack.Screen name="AppStack" component={AppStack} />
          </Stack.Navigator>
        </NavigationContainer>
      </RoleProvider>
    </LanguageProvider>
  );
};

export default App;