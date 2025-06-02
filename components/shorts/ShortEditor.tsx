import React from 'react'
import Player from './Player'
import ShortViewer from './ShortViewer';

const ShortEditor = () => {
  return (
    <div className='h-full w-full flex items-center justify-center max-w-[1400px] gap-10'>
        <Player />
        <ShortViewer />
    </div>
  )
}

export default ShortEditor