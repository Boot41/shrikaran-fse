import React from 'react'
import Addnewviva from './Addnewviva'
import Interviewlist from './Interviewlist'

function Dashboard() {
  return (
    <div>
        <h2 className='text-4xl text-gray-500 mt-5'>Create and start ur AI powered viva</h2>
        <div>
            <Addnewviva/>
        </div>
        {/* {prevoius viva} */}
        <Interviewlist/>
    </div>
  )
}

export default Dashboard