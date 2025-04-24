import React from 'react';
import { IoMdMenu } from "react-icons/io";


const Menubar = () => {
  return (
    <div className='md:hidden block py-3 '>
      <IoMdMenu className='text-white cursor-pointer text-3xl' />
    </div>
  )
}

export default Menubar
