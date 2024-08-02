import { useUser } from '@clerk/clerk-react'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';
import Interviewcard from './Interviewcard';

function Interviewlist() {
    const {user} = useUser();
    const [isLoading, setIsLoading] = useState(true);
    const [interviewList, setInterviewList] = useState([]);

    async function getInterviewList() {
        try {
          const response = await fetch('http://127.0.0.1:8000/api/getinterviewlist/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded' // Adjust as needed
            },
            body: new URLSearchParams({ created_by: user?.primaryEmailAddress?.emailAddress }) // Assuming you have your user's email
          });
      
          const data = await response.json();
      
          if (data.success) {
            // Process the interview data (data.data) as an array
            console.log(data.data);
            setInterviewList(data.data)
            // Update state or display the list data in your UI
          } else {
            console.error('Error retrieving interview list:', data.error);
            // Handle errors appropriately (e.g., display an error message to the user)
          }
        } catch (error) {
          console.error('Error fetching interview data:', error);
          // Handle errors gracefully (e.g., display a generic error message)
        }
      }
      

    useEffect(()=>{
        console.log("u reached here",user?.primaryEmailAddress?.emailAddress)
        user?.primaryEmailAddress?.emailAddress && getInterviewList();
    },[user])

  return (
    <div>
        <h1 className='font-medium text-xl'>Previous viva</h1>
         <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-3'>
            { 
                interviewList && interviewList.map((interview,index)=>(
                    <Interviewcard interview={interview} key={index}/>
                ))
            }
        </div>
    </div>
  )
}

export default Interviewlist
