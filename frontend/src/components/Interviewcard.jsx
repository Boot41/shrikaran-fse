import React from 'react'
import { Button } from './ui/button'
import { useNavigate } from 'react-router-dom'

function Interviewcard({interview}) {
    const navigate = useNavigate();
  return (
    <div className='border shadow-sm rounded-lg p-3'>
        <h2 className='font-bold text-primary text-blue-400'>Specialization : {interview?.Specialization}</h2>
        <h2 className='text-md text-gray-500'>description : {interview?.SpecializationDescription}</h2>
        <h2 className='text-xs text-gray-500'>Created at : {interview?.created_at}</h2>
        <div className='flex justify-between mt-2 gap-5'>
            <Button onClick={()=>navigate("/interview/"+interview?.vivaid+"/feedback")} size="sm" className="w-full bg-green-300">Feedback</Button>
            <Button onClick={()=>navigate("/interview/"+interview?.vivaid)} size="sm" variant="secondary" className="w-full bg-blue-200">start</Button>
        </div>
    </div>
  )
}

export default Interviewcard