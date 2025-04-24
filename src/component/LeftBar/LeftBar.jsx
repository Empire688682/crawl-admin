"use client";
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import { FiHome, FiMusic, FiBarChart2, FiUpload } from 'react-icons/fi';
import { AiOutlineClose } from "react-icons/ai";

export default function LeftBar() {
  const pathname = usePathname();
  return (
    <div className="w-64 min-h-screen relative bg-[#121212] hidden md:block  text-white flex flex-col justify-between py-6 px-4">
      <AiOutlineClose  className='absolute right-3 top-8 cursor-pointer text-3xl md:hidden'/>
      <div>
        <div className="flex items-center mb-10 space-x-4">
          <Image src="/zayne.png" alt="User" width={40} height={40} className="rounded-full" />
          <span className="text-lg font-semibold">Zayne</span>
        </div>

        <nav className="flex flex-col space-y-4 gap-9">
          <Link href="/dashboard" className={`flex items-center space-x-2 text-sm hover:text-white text-gray-500 ${pathname === "/dashboard"? "font-bold text-white" : ""}`}>
            <FiHome className='text-2xl md:block hidden' /> <span>Dashboard</span>
          </Link>
          <Link href="/all-songs" className={`flex items-center space-x-2 text-sm hover:text-white text-gray-500 ${pathname === "/all-songs"? "font-bold text-white" : ""}`}>
            <FiMusic className='text-2xl md:block hidden' /> <span>All Songs/Purchased Songs</span>
          </Link>
          <Link href="/revenue-dashboard" className={`flex items-center space-x-2 text-sm hover:text-white text-gray-500 ${pathname === "/revenue-dashboard"? "font-bold text-white" : ""}`}>
            <FiBarChart2 className='text-2xl md:block hidden' /> <span>Monthly Revenue / Lifetime Revenue</span>
          </Link>
          <Link href="/upload-song" className={`flex items-center space-x-2 text-sm hover:text-white text-gray-500 ${pathname === "/upload-song"? "font-bold text-white" : ""}`}>
            <FiUpload className='text-2xl md:block hidden' /> <span>Upload Song/Album</span>
          </Link>
        </nav>
      </div>

      <div className="mt-10">
        <Image src="/crawl-logo-.png" alt="Logo" width={80} height={80} />
      </div>
    </div>
  )
}
