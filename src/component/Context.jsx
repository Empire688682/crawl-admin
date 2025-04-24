"use client";
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

const AppContext = React.createContext();

export const AppProvider = ({children}) => {
  const [showMenu, setShowMenu] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setShowMenu(false);
  }, [pathname]);

  useEffect(()=>{
    if(showMenu){
      document.body.style.overflow = "hidden";
    }
    else{
      document.body.style.overflow = "unset";
    }
  }, [showMenu])
  
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
