"use client"
import React from 'react'

import { motion } from 'framer-motion'
import ShortEditor from '@/components/shorts/ShortEditor'



const Page = () => {
    return (
        <motion.div
            className="h-full w-full  flex items-center justify-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.2,
                ease: "easeOut",
                type: "spring",
                stiffness: 100,
                damping: 20,
            }}
        >
            <ShortEditor/>
        </motion.div>
    )
}

export default Page