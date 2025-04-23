"use client";
import React from 'react';

const AppContext = React.createContext();

export const AppProvider = ({children}) => {
  return <AppContext.Provider value={{

  }}>
    {children}
    </AppContext.Provider>
}

export const useGlobalContext = () => {
  return React.useContext(AppContext);
};
