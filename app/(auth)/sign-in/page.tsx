"use client"
import { authClient } from '@/lib/auth-client'
import React from 'react'

const page = () => {
    const SignInWithGoogle = async () => {
        await authClient.signIn.social({
            provider:'google' ,
            callbackURL: '/project',
        })
    }
  return (

    <div className='flex items-center justify-center'>
        <button onClick={SignInWithGoogle} className=''>Sign In With Google</button>
    </div>
  )
}

export default page