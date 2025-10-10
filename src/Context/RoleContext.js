// contexts/RoleContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const loadRole = async () => {
      try {
        const stored = await AsyncStorage.getItem('authData');
        if (stored) {
          const authData = JSON.parse(stored);
          if (authData?.user?.role) {
            setRole(authData.user.role);   // ✅ restore role
          }
        }
      } catch (error) {
        console.error('Failed to load role:', error);
      }
    };
    loadRole();
  }, []);

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => useContext(RoleContext);
