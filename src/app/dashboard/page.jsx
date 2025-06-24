import LeftBar from '@/component/LeftBar/LeftBar'
import Dashboard from '@/component/Dashboard/Dashboard'
import Topbar from '@/component/Topbar/Topbar'
import React from 'react'

const page = () => {
    return (
        <div className='flex gap-4'>
            <LeftBar />
            <div className='flex-1'>
                <Topbar />
                <Dashboard />
            </div>
        </div>
    )
}

export default page
