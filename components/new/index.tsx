import React from 'react'
import Main from './Main'
import { motion } from "framer-motion"

const NewProject = () => {
  return (
    <motion.div 
      className="h-full w-full MAX_WIDTH"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        ease: "easeOut",
        type: "spring",
        stiffness: 100,
        damping: 20
      }}
    >
      <Main/>
    </motion.div>
  )
}

export default NewProject