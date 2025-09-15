import AsyncStorage from '@react-native-async-storage/async-storage';
import { Buffer } from 'buffer';

// Get both token and user data
export const getAuthData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('authData');
    return jsonValue ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error reading auth data:', error);
    return null;
  }
};

// Get just the token
export const getToken = async () => {
  const authData = await getAuthData();
  return authData?.token || null;
};

// Get just the user data
export const getUser = async () => {
  const authData = await getAuthData();
  return authData?.user || null;
};

// Clear auth data
export const clearAuthData = async () => {
  try {
    await AsyncStorage.removeItem('authData');
  } catch (error) {
    console.error('Error clearing auth data:', error);
  }
};