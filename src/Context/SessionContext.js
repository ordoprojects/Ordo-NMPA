// src/Context/SessionContext.js
import React, { createContext, useContext, useState } from 'react';

const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [sessionExpired, setSessionExpired] = useState(false);

  const triggerSessionExpired = () => setSessionExpired(true);
  const resetSessionExpired = () => setSessionExpired(false);

  return (
    <SessionContext.Provider value={{ sessionExpired, triggerSessionExpired, resetSessionExpired }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);
