"use client";
import Image from 'next/image'
import Link from 'next/link'
import { FiHome, FiMusic, FiBarChart2, FiUpload, FiLogOut } from 'react-icons/fi';
import { useGlobalContext } from '../Context';

export default function LeftBar() {
  const {showMenu, pathname, artistData, userData, logoutUser} = useGlobalContext();
  const firstInitial = artistData?.artist_name?.trim()?.charAt(0)?.toUpperCase() || "";

  return (
    <div className={`w-64 transition h-screen duration-1000 md:translate-x-0 transform ${showMenu ? "translate-x-0 pb-16" : "translate-x-[-140%]"} bg-[#121212] fixed z-50 md:relative text-white flex flex-col justify-between py-6 px-4`}>
      <div>
        <div className="flex items-center mb-10 space-x-4">
          {/* avatar placeholder */}
        <div className="flex h-12 w-12 items-center text-black justify-center rounded-full bg-white text-lg font-bold uppercase">
          {firstInitial}
        </div>
          <span className="text-lg font-semibold">{artistData?.artist_name}</span>
        </div>

        <nav className="flex flex-col space-y-4 gap-9">
          <Link href="/dashboard" className={`flex items-center space-x-2 text-sm hover:text-white text-gray-500 ${pathname === "/dashboard"? "font-bold text-white" : ""}`}>
            <FiHome className='text-2xl' /> <span>Dashboard</span>
          </Link>
          <Link href="/all-songs" className={`flex items-center space-x-2 text-sm hover:text-white text-gray-500 ${pathname === "/all-songs"? "font-bold text-white" : ""}`}>
            <FiMusic className='text-2xl' /> <span>All Songs/Purchased Songs</span>
          </Link>
          <Link href="/all-albums" className={`flex items-center space-x-2 text-sm hover:text-white text-gray-500 ${pathname === "/all-albums"? "font-bold text-white" : ""}`}>
            <FiMusic className='text-2xl' /> <span>All Albums/Purchased Songs</span>
          </Link>
          <Link href="/revenue-dashboard" className={`flex items-center space-x-2 text-sm hover:text-white text-gray-500 ${pathname === "/revenue-dashboard"? "font-bold text-white" : ""}`}>
            <FiBarChart2 className='text-2xl' /> <span>Monthly Revenue / Lifetime Revenue</span>
          </Link>
          <Link href="/upload-song" className={`flex items-center space-x-2 text-sm hover:text-white text-gray-500 ${pathname === "/upload-song"? "font-bold text-white" : ""}`}>
            <FiUpload className='text-2xl' /> <span>Upload Song/Album</span>
          </Link>
        </nav>
      </div>

      <div onClick={logoutUser} className='flex items-center mt-10 border-[1px] p-2 rounded-sm max-w-[50%]  cursor-pointer space-x-2 text-sm hover:text-white text-gray-500'>
        <FiLogOut className='text-2xl' />
        <span>Logout</span>
      </div>

      <div className="mt-10">
        <Image src="/crawl-logo-.png" alt="Logo" width={50} height={80} />
      </div>
    </div>
  )
}
