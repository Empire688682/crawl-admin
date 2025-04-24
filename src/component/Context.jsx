"use client";
import React, { useState } from 'react';
import { usePathname } from 'next/navigation';

const AppContext = React.createContext();

export const AppProvider = ({children}) => {
  const [showMenu, setShowMenu] = useState(false);
  const pathname = usePathname();
  return <AppContext.Provider value={{
    showMenu, 
    setShowMenu,
    pathname
  }}>
    {children}
    </AppContext.Provider>
}

export const useGlobalContext = () => {
  return React.useContext(AppContext);
};
