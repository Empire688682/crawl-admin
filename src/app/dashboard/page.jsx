import LeftBar from '@/component/LeftBar/LeftBar'
import MainContent from '@/component/MainContent/MainContent'
import Topbar from '@/component/Topbar/Topbar'
import React from 'react'

const page = () => {
    return (
        <div className='flex gap-4'>
            <LeftBar />
            <div className='flex-1'>
                <Topbar />
                <MainContent />
            </div>
        </div>
    )
}

export default page
