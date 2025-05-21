"use client"
import NewProject from '@/components/new'
import { authClient } from '@/lib/auth-client'
import React from 'react'

const page = () => {
  return (
    <div className='h-full w-full MAX_WIDTH'>
        <NewProject/>
    </div>
  )
}

export default page