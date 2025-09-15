/**
 * @format
 */
import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import 'react-native-get-random-values';
// import 'react-native-quick-crypto';
import { Buffer } from 'buffer';
global.Buffer = Buffer;
console.log('+++++++++THIS IS FROM INDEX.JS+++++++++++++++++');
// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
  // You can perform actions based on the received remoteMessage object here
});

// Handle foreground notifications
messaging().onMessage(async remoteMessage => {
  console.log('Foreground Message handled!', remoteMessage);
  // You can display the notification using your preferred library or method here
});

// Request permission for notifications
async function requestUserPermission() {
  try {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:=====================', authStatus);
      // getFcmToken();
    }
    // else {
    //   console.log(
    //     'Authorization status from else :=====================',
    //     authStatus,
    //   );
    // }
  } catch (error) {
    console.error('Error requesting permission:=============', error);
  }
}
// const getFcmToken = async () => {
//   try {
//     const fcmToken = await messaging().getToken();
//     if (fcmToken) {
//       console.log('FCM Token===================:', fcmToken);
//     } else {
//       console.log('Failed to get FCM Token');
//     }
//   } catch (error) {
//     console.error('getFcmToken error:', error);
//   }
// };

// Request permission on app startup
requestUserPermission();

AppRegistry.registerComponent(appName, () => App);
