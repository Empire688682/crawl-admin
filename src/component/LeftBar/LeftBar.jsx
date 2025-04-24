"use client";
import Image from 'next/image'
import Link from 'next/link'
import { FiHome, FiMusic, FiBarChart2, FiUpload, FiLogOut } from 'react-icons/fi';
import { useGlobalContext } from '../Context';

export default function LeftBar() {
  const {showMenu, pathname, setShowMenu} = useGlobalContext();

  function handleLinkClick() {
    setShowMenu(false);
  }
  return (
    <div className={`w-64 min-h-screen transition duration-1000 md:translate-x-0 transform ${showMenu ? "translate-x-0 pb-16" : "translate-x-[-140%]"} bg-[#121212] fixed z-50 md:relative text-white flex flex-col justify-between py-6 px-4`}>
      <div>
        <div className="flex items-center mb-10 space-x-4">
          <Image src="/zayne.png" alt="User" width={40} height={40} className="rounded-full" />
          <span className="text-lg font-semibold">Zayne</span>
        </div>

        <nav className="flex flex-col space-y-4 gap-9">
          <Link onClick={handleLinkClick} href="/dashboard" className={`flex items-center space-x-2 text-sm hover:text-white text-gray-500 ${pathname === "/dashboard"? "font-bold text-white" : ""}`}>
            <FiHome className='text-2xl' /> <span>Dashboard</span>
          </Link>
          <Link onClick={handleLinkClick} href="/all-songs" className={`flex items-center space-x-2 text-sm hover:text-white text-gray-500 ${pathname === "/all-songs"? "font-bold text-white" : ""}`}>
            <FiMusic className='text-2xl' /> <span>All Songs/Purchased Songs</span>
          </Link>
          <Link onClick={handleLinkClick} href="/revenue-dashboard" className={`flex items-center space-x-2 text-sm hover:text-white text-gray-500 ${pathname === "/revenue-dashboard"? "font-bold text-white" : ""}`}>
            <FiBarChart2 className='text-2xl' /> <span>Monthly Revenue / Lifetime Revenue</span>
          </Link>
          <Link onClick={handleLinkClick} href="/upload-song" className={`flex items-center space-x-2 text-sm hover:text-white text-gray-500 ${pathname === "/upload-song"? "font-bold text-white" : ""}`}>
            <FiUpload className='text-2xl' /> <span>Upload Song/Album</span>
          </Link>
        </nav>
      </div>

      <div className='flex items-center mt-10 border-[1px] p-2 rounded-sm max-w-[50%]  cursor-pointer space-x-2 text-sm hover:text-white text-gray-500'>
        <FiLogOut className='text-2xl' />
        <span>Logout</span>
      </div>

      <div className="mt-10">
        <Image src="/crawl-logo-.png" alt="Logo" width={50} height={80} />
      </div>
    </div>
  )
}
