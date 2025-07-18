import React from 'react'
import { Outlet } from 'react-router-dom'

const MainLayout = () => {
    return (
        <div className='flex-1 mt-16'>
            <Outlet />
        </div>
    )
}

export default MainLayout