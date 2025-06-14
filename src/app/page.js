"use client";
import React from 'react';
import { useRouter } from 'next/navigation';

const Page = () => {
  const router = useRouter()
  return (
    <div className='flex h-screen items-center justify-center'>
      <p onClick={()=>router.replace("/dashboard")} className='py-5 rounded-lg text-black font-bold cursor-pointer px-15 bg-white'>CONTINUE</p>
    </div>
  )
}

export default Page
