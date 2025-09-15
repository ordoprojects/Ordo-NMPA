// src/services/notificationService.js
import messaging from '@react-native-firebase/messaging';
import notifee, { EventType } from '@notifee/react-native';
import { Platform } from 'react-native';
import { PERMISSIONS, request } from 'react-native-permissions';
import { getToken } from '../navigation/auth';
import { BASE_URL } from '../navigation/Config';

// Initialize notification permissions and get FCM token
export const setupNotifications = async () => {
  try {
    // Request permissions
    const authStatus = await messaging().requestPermission();
    const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || 
                   authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (!enabled) {
      console.log('Notification permissions not granted');
      return false;
    }

    // Android specific permissions
    if (Platform.OS === 'android') {
      await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
      await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
      });
    }

    // Register device
    if (!messaging().isDeviceRegisteredForRemoteMessages) {
      await messaging().registerDeviceForRemoteMessages();
    }

    // Get and register FCM token
    const fcmToken = await messaging().getToken();
    await registerFCMToken(fcmToken);

    // Set up token refresh handler
    messaging().onTokenRefresh(registerFCMToken);

    return true;
  } catch (error) {
    console.error('Notification setup error:', error);
    return false;
  }
};

// Register FCM token with backend
// In notificationService.js
export const registerFCMToken = async () => {
  try {
    const userToken = await getToken();
    if (!userToken) {
      console.log('User not authenticated');
      return false;
    }

    // Get device FCM token
    const fcmToken = await messaging().getToken();
    console.log('Device FCM token:', fcmToken);

    // Send to backend
    const response = await fetch(`${BASE_URL}/fcm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        token: fcmToken,  // Send FCM token here
        device_type: Platform.OS,
      }),
    });

    if (!response.ok) throw new Error('Registration failed');
    return true;
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
};

let handlersRegistered = false;
// Set up notification handlers
export const setupNotificationHandlers = () => {
      if (handlersRegistered) {
    console.log('Notification handlers already registered');
    return () => {}; // Return empty cleanup
  }

  handlersRegistered = true;
  console.log('Registering notification handlers');
  // Foreground messages
  const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
    console.log('Foreground notification:', remoteMessage);
    await displayNotification(
      remoteMessage.notification?.title,
      remoteMessage.notification?.body,
      remoteMessage.data
    );
  });

  // Notification tap handler
  const unsubscribeNotifee = notifee.onForegroundEvent(({ type, detail }) => {
    if (type === EventType.PRESS) {
      console.log('Notification pressed:', detail.notification);
    }
  });

  // Return cleanup function
  return () => {
    unsubscribeForeground();
    unsubscribeNotifee();
  };
};

// Display local notification
const displayNotification = async (title, body, data) => {
  await notifee.displayNotification({
    title: title || 'New notification',
    body,
    data,
    android: {
      channelId: 'default',
      pressAction: {
        id: 'default',
      },
    },
  });
};

// Check if app was opened from notification
export const checkInitialNotification = async () => {
  const remoteMessage = await messaging().getInitialNotification();
  if (remoteMessage) {
    console.log('App opened from notification:', remoteMessage);
    return remoteMessage;
  }
  return null;
};