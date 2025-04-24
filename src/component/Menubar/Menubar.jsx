"use client";
import React from 'react';
import { IoMdMenu } from "react-icons/io";
import { useGlobalContext } from '../Context';

const Menubar = () => {
  const {setShowMenu, showMenu, pathname} = useGlobalContext();
  if(pathname === "/"){
    return null
  }
  return (
    <div className='md:hidden block py-3 bg-[#0e0e0e] sticky top-0 left-0 z-50 '>
      <IoMdMenu onClick={()=>setShowMenu(!showMenu)} className='text-white cursor-pointer text-3xl' />
    </div>
  )
}

export default Menubar
