import { NewProjectProvider } from '@/contexts/NewProjectContext'
import React from 'react'
import Main from './Main'

const NewProject = () => {
  return (
    <NewProjectProvider>
      <div className="h-full w-full MAX_WIDTH">
      <Main/>
      </div>
    </NewProjectProvider>        
  )
  
}

export default NewProject