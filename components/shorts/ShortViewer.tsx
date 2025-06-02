import { useShortEditor } from '@/contexts/ShortEditorContext';
import React from 'react'

const ShortViewer = () => {
    const { currentProject , currentShort } = useShortEditor();
  return (
    <div className='h-full w-[25%] border-l border-silver/10'>
        <div className="h-full w-full flex items-center justify-center">
        </div>
    </div>
  )
}

export default ShortViewer