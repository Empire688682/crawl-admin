import LeftBar from '@/component/LeftBar/LeftBar'
import RevenueDashbord from '@/component/RevenueDashbord/RevenueDashbord'
import Topbar from '@/component/Topbar/Topbar'
import React from 'react'

const page = () => {
  return (
    <div className='flex gap-4'>
      <LeftBar />
      <div className='flex-1'>
        <Topbar />
        <RevenueDashbord />
      </div>
    </div>
  )
}

export default page
