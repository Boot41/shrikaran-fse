import React from 'react'
import Addnewviva from './Addnewviva'

function Dashboard() {
  return (
    <div>
        <h2 className='font-bold text-3xl'>Dashboard</h2>
        <h2 className='text-gray-500'>Create and start ur AI powered viva</h2>
        <div>
            <Addnewviva/>
        </div>
    </div>
  )
}

export default Dashboard