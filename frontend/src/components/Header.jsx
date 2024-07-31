import { UserButton } from '@clerk/clerk-react'
import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

function Header() {

    const location = useLocation().pathname;


  return (
    <div className='flex p-4 items-center justify-between bg-secondary shadow-md'>
        <img src='/logo.svg'/>
        <ul className='hidden md:flex gap-6'>
            <li className={`hover:text-primary hover:font-bold text-lg cursor-pointer transition-all ${location=='/'&&"text-primary font-bold"}`}>Dashboard</li>
            <li className={`hover:text-primary hover:font-bold text-lg cursor-pointer transition-all ${location=='/questions'&&"text-primary font-bold"}`}>Questions</li>
            <li className={`hover:text-primary hover:font-bold text-lg cursor-pointer transition-all ${location=='/howit'&&"text-primary font-bold"}`}>How it work's</li>
        </ul>
        <UserButton/>
    </div>
  )
}

export default Header