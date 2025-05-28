import React from 'react'
import { FaGithub } from "react-icons/fa";

const Creator = () => {
  return (
    <div className='fixed bottom-5.5 left-5.5 text-xs flex items-center '>
        <a href="https://github.com/skmayya1" target="_blank" rel="noopener noreferrer">
        <FaGithub
         size={20}
         color='gray'
        /></a>
    </div>
  )
}

export default Creator