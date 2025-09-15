import * as Keychain from 'react-native-keychain';

export const saveSecretKey = async (key) => {
  try {
    await Keychain.setGenericPassword('jwtSecret', key, {
      service: 'com.your.app.jwtSecret',
      accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY
    });
    return true;
  } catch (error) {
    console.error('Failed to save secret key', error);
    return false;
  }
};

export const getSecretKey = async () => {
  try {
    const credentials = await Keychain.getGenericPassword({
      service: 'com.your.app.jwtSecret'
    });
    return credentials ? credentials.password : null;
  } catch (error) {
    console.error('Failed to fetch secret key', error);
    return null;
  }
};