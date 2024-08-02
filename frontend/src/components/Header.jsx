import { UserButton } from '@clerk/clerk-react'
import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function Header() {

    const location = useLocation().pathname;
    const navigate = useNavigate();


  return (
    <div className='flex p-4 items-center justify-between bg-secondary shadow-md'>
        <img src='/logo.svg'/>
        <ul className='hidden md:flex gap-6'>
            <li className={`hover:text-primary hover:font-bold text-lg cursor-pointer transition-all ${location=='/'&&"text-primary font-bold"}`} onClick={()=>navigate("/")}>Dashboard</li>
        </ul>
        <UserButton/>
    </div>
  )
}

export default Header