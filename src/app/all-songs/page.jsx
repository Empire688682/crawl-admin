import AllSong from '@/component/AllSong/AllSong'
import LeftBar from '@/component/LeftBar/LeftBar'
import Topbar from '@/component/Topbar/Topbar'
import React from 'react'

const page = () => {
    return (
        <div className='flex gap-4'>
            <LeftBar />
            <div className='flex-1'>
                <Topbar />
                <AllSong />
            </div>
        </div>
    )
}

export default page
