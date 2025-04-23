import LeftBar from '@/component/LeftBar/LeftBar'
import Topbar from '@/component/Topbar/Topbar'
import UploadSong from '@/component/UploadSong/UploadSong'
import React from 'react'

const page = () => {
  return (
    <div className='flex gap-4'>
      <LeftBar />
      <div className='flex-1'>
        <Topbar />
        <UploadSong />
      </div>
    </div>
  )
}

export default page
