import React from 'react'
import { IoMdDownload } from "react-icons/io";
import { MdEdit } from "react-icons/md";

const Options = () => {
  return (
    <div className='h-fit w-fit flex gap-2'>
         <button className="w-full bg-[#FF9505]/90 cursor-pointer text-night font-semibold p-2.5 rounded-full flex items-center justify-center gap-1 ">
            <IoMdDownload size={25}/>
         </button>
         <button className="w-full bg-[#FF9505]/90 cursor-pointer text-night font-semibold p-2.5 rounded-full flex items-center justify-center gap-1 ">
            <MdEdit size={25}/>
         </button>
    </div>
  )
}

export default Options