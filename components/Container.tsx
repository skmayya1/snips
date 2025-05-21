import React from 'react'

interface ContainerProps {
    children: React.ReactNode;
    border?: boolean;
    background?: boolean;

    className?: string;
}
const Container:React.FC<ContainerProps> = ({
    children,
    border = false,
    background = true,
    className = ''
}) => {
  
  return (
    <div className={`px-4 py-1.5 ${background ? 'bg-eerie-black':'bg-night'} w-fit h-fit rounded-lg ${className} ${border ? 'border border-white-smoke/10' : ''} ${background ? 'bg-white/5' : ''}`}>
        {children}
    </div>
  )
}

export default Container