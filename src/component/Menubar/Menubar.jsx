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
    <div className='md:hidden block py-3 '>
      <IoMdMenu onClick={()=>setShowMenu(!showMenu)} className='text-white cursor-pointer text-3xl' />
    </div>
  )
}

export default Menubar
