import 'react-native-gesture-handler';
import React, {useEffect ,useContext} from 'react';
import {SafeAreaView, Alert, StyleSheet} from 'react-native';
import Routes from './src/navigation/Routes';
import messaging from '@react-native-firebase/messaging';
import notifee, {EventType} from '@notifee/react-native';
import {AuthProvider } from './src/Context/AuthContext';
import {PERMISSIONS, request} from 'react-native-permissions';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import SplashScreen from 'react-native-splash-screen';
import firebase from '@react-native-firebase/app';


const App = () => {

  React.useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 500);
  }, []);

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  useEffect(() => {
    const setupNotifications = async () => {
      await checkApplicationNotificationPermission();
      await registerAppWithFCM();
      const token = await getFcmToken();
      console.log('FCM Token : ============>', token);
    };

    setupNotifications();

    const unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
      const {notification, data} = remoteMessage;

      // Default values
      const title = notification?.title || 'New Notification';
      const body = notification?.body || 'You have a new message.';

      // Format data if present
      let formattedData = '';
      if (data) {
        formattedData = Object.entries(data)
          .map(([key, value]) => `${key}: ${value}`)
          .join('\n');
      }

      // Display the alert with formatted data
      Alert.alert(title, body, [
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ]);

      if (title && body) {
        onDisplayNotification(title, body, data);
      }
    });

    const unsubscribeOnNotificationOpenedApp =
      messaging().onNotificationOpenedApp(async remoteMessage => {
        console.log(
          'Notification caused app to open from background state:',
          JSON.stringify(remoteMessage),
        );
      });

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
          );
        }
      });

    return () => {
      unsubscribeOnMessage();
      unsubscribeOnNotificationOpenedApp();
    };
  }, []);

  

  return (
    <AuthProvider>
      <GestureHandlerRootView style={{flex: 1}}>
        <SafeAreaView style={{flex: 1}}>
          <Routes />
        </SafeAreaView>
      </GestureHandlerRootView>
    </AuthProvider>
  );
};

export default App;

async function onDisplayNotification(title, body, data) {
  await notifee.requestPermission();
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
  });

  await notifee.displayNotification({
    title,
    body,
    data,
    android: {
      channelId,
      pressAction: {
        id: 'default',
      },
    },
  });
}

export const getFcmToken = async () => {
  let token = null;
  await checkApplicationNotificationPermission();
  await registerAppWithFCM();
  try {
    token = await messaging().getToken();
    console.log('getFcmToken-->', token);
  } catch (error) {
    console.log('getFcmToken Device Token error =========', error);
  }
  return token;
};

export async function registerAppWithFCM() {
  console.log(
    'registerAppWithFCM status ================',
    messaging().isDeviceRegisteredForRemoteMessages,
  );
  if (!messaging().isDeviceRegisteredForRemoteMessages) {
    await messaging()
      .registerDeviceForRemoteMessages()
      .then(status => {
        console.log('registerDeviceForRemoteMessages status', status);
      })
      .catch(error => {
        console.log('registerDeviceForRemoteMessages error ', error);
      });
  }
}

export async function unRegisterAppWithFCM() {
  console.log(
    'unRegisterAppWithFCM status',
    messaging().isDeviceRegisteredForRemoteMessages,
  );
  if (messaging().isDeviceRegisteredForRemoteMessages) {
    await messaging()
      .unregisterDeviceForRemoteMessages()
      .then(status => {
        console.log('unregisterDeviceForRemoteMessages status', status);
      })
      .catch(error => {
        console.log('unregisterDeviceForRemoteMessages error ', error);
      });
  }
  await messaging().deleteToken();
  console.log(
    'unRegisterAppWithFCM status',
    messaging().isDeviceRegisteredForRemoteMessages,
  );
}

export const checkApplicationNotificationPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
  request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS)
    .then(result => {
      console.log('POST_NOTIFICATIONS status:', result);
    })
    .catch(error => {
      console.log('POST_NOTIFICATIONS error ', error);
    });
};
