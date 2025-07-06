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
  const [artistData, setArtistData] = useState({});
  const [totalSongByUser, setTotalSongByUser] = useState(0);
  const [userSongs, setUserSongs] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);
  
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
      const savedUserData = localStorage.getItem("crawlUser");
      const parseUserData = savedUserData? JSON.parse(savedUserData) : null;

      const savedArtistData = localStorage.getItem("crawlArtist");
      const parseArtistData = savedArtistData? JSON.parse(savedArtistData) : null;
      if(now > parseUserData?.expiredAT ){
        localStorage.removeItem("crawlUser");
        localStorage.removeItem("crawlArtist");
        localStorage.removeItem("crawlToken");
        setUserData({});
        setArtistData({});
      }
      else{
        setUserData(parseUserData || {});
        setArtistData(parseArtistData || {})
      }
    }
    setIsInitialized(true);
  }

  //Auths
  useEffect(()=>{
    checkIsAuthenticated()
  }, []);

  // Define public routes that don't require authentication
  const publicRoutes = ['/signup', '/login', '/'];
  
  // Only redirect after initialization is complete
  useEffect(() => {
    if (!isInitialized) return;

    const isPublicRoute = publicRoutes.includes(pathname);
    
    if (!userData.token) {
      // User is not authenticated
      if (!isPublicRoute) {
        router.replace("/signup");
      }
    } else {
      // User is authenticated
      if (isPublicRoute) {
        // Only redirect to dashboard if user is on a public route
        router.replace("/dashboard");
      }
      // If user is on a protected route, let them stay there
    }
  }, [userData, artistData, pathname, router, isInitialized]);

  const logoutUser = () =>{
    if(typeof window !== "undefined"){
        localStorage.removeItem("crawlUser");
        localStorage.removeItem("crawlArtist");
        localStorage.removeItem("crawlToken");
      checkIsAuthenticated();
    }
  };

  const fetchAllSongs = async () => {
    try {
      const res = await axios.get(publicApiUrl + "songs");
      console.log("songs:",res )
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
    artistData,
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