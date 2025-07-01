"use client";
import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import axios from "axios";

const AppContext = React.createContext();

export const AppProvider = ({children}) => {
  const [showMenu, setShowMenu] = useState(false);
  const pathname = usePathname();
  const publicApiUrl = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();

  const [userData, setUserData] = useState({});
  const [totalSongByUser, setTotalSongByUser] = useState(0);

  const [userSongs, setUserSongs] = useState([]);
  
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
  }, [showMenu]);

  const checkIsAuthenticated = () =>{
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
  }

  //Auths
  useEffect(()=>{
    checkIsAuthenticated()
  }, []);

  //   useEffect(() => {
  //   if (!userData.token) {
  //     router.replace("/signup");
  //   }
  // }, []);

  const logoutUser = () =>{
    if(typeof window !== "undefined"){
      localStorage.removeItem("CrawlAdmin");
      window.location.reload();
    }
  };

  const fetchAllSongs = async () => {
    try {
      const res = await axios.get(publicApiUrl + "songs");
      if (res.status === 200) {
        const fetched = res.data.data;
        if (userData?.id) {
          const filtered = fetched.filter(
            (song) => song.artist_id === userData.id
          );
           setTotalSongByUser(filtered.length);
          setUserSongs(filtered);
        }
      } else {
        setUserSongs([]);
      }
    } catch (err) {
      console.error("fetchAllSongs error:", err);
    }
  };

  useEffect(() => {
    fetchAllSongs();
  }, [userData]);
  
  return <AppContext.Provider value={{
    showMenu, 
    setShowMenu,
    pathname,
    router,
    publicApiUrl,
    userData,
    userSongs,
    fetchAllSongs,
    logoutUser,
    checkIsAuthenticated,
    totalSongByUser, 
    setTotalSongByUser
  }}>
    {children}
    </AppContext.Provider>
}


export const useGlobalContext = () => {
  return React.useContext(AppContext);
};
