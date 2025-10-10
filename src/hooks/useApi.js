// hooks/useApi.js
import { useState, useCallback } from 'react';
import { getToken, clearAuthData } from '../navigation/auth';
import { BASE_URL } from '../navigation/Config';
import Toast from 'react-native-simple-toast';
import { useNavigation } from '@react-navigation/native';

export const useApi = () => {
  const navigation = useNavigation();

  const handleApiError = useCallback(async (response) => {
    if (response.status === 403) {
      await clearAuthData();
      Toast.show('Session expired. Please login again.', Toast.LONG);
      navigation.navigate('Login');
      throw new Error('SESSION_EXPIRED');
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }, [navigation]);

  const apiRequest = useCallback(async (url, options = {}) => {
    try {
      const token = await getToken();
      
      const response = await fetch(`${BASE_URL}${url}`, {
        ...options,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      await handleApiError(response);
      return await response.json();
    } catch (error) {
      if (error.message !== 'SESSION_EXPIRED') {
        console.error('API request failed:', error);
      }
      throw error;
    }
  }, [handleApiError]);

  return {
    apiRequest,
    get: (url) => apiRequest(url),
    post: (url, data) => apiRequest(url, { method: 'POST', body: JSON.stringify(data) }),
    put: (url, data) => apiRequest(url, { method: 'PUT', body: JSON.stringify(data) }),
    patch: (url, data) => apiRequest(url, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (url) => apiRequest(url, { method: 'DELETE' }),
  };
};