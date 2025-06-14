"use client";
import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

const AppContext = React.createContext();

export const AppProvider = ({children}) => {
  const [showMenu, setShowMenu] = useState(false);
  const pathname = usePathname();
  const publicApiUrl = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();

  const [userData, setUserData] = useState({token:"yes"});
  
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

  //Auths
  useEffect(()=>{
    const now = new Date().getTime();
    if(typeof window !== "undefined"){
      const savedData = localStorage.getItem("CrawlAdmin");
      const parseData = savedData? JSON.parse(savedData) : null
      if(now > parseData?.expiredAT ){
        localStorage.removeItem(CrawlUser)
      }
      else{
        setUserData(parseData);
      }
    }
  }, []);

    useEffect(() => {
    if (!userData.token) {
      router.replace("/signup");
    }
  }, []);

  const logoutUser = () =>{
    if(typeof window !== "undefined"){
      localStorage.removeItem("CrawlAdmin");
      window.location.reload();
    }
  }
  
  return <AppContext.Provider value={{
    showMenu, 
    setShowMenu,
    pathname,
    router,
    publicApiUrl,
    userData,
    logoutUser
  }}>
    {children}
    </AppContext.Provider>
}


export const useGlobalContext = () => {
  return React.useContext(AppContext);
};
