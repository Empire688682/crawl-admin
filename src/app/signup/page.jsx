"use client";
import AuthForms from '@/component/AuthForms/AuthForms'
import { useGlobalContext } from '@/component/Context';
import React, { useEffect } from 'react'

const Page = () => {
    const {userData, router} = useGlobalContext();
    useEffect(()=>{
        if(userData?.token){
            router.replace("/dashboard")
        }
    }, [userData]);
    
  return (
    <div className='pl-3 pr-3 bg-black md:pl-6 md:pr-6 py-3'>
      <AuthForms />
    </div>
  )
}

export default Page
