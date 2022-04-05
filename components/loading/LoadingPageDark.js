//loading component for pages in dark mode
import React from 'react';

const LoadingPageDark = (props) => {

  const { message } = props

  return (
    <div className="p-4 max-w-sm w-full m-8">
      <div className="text-white-light text-1xl">
      { message }
      </div>
      <div className="animate-pulse flex space-x-4">
        <div className="flex-1 space-y-4 py-1">
          <div className="space-y-3">
            <div className="h-4 bg-indigo-light rounded"/>
            <div className="h-4 bg-indigo-light rounded w-5/6"/>
            <div className="h-4 bg-indigo-light rounded w-3/4"/>
            <div className="h-4 bg-indigo-light rounded w-1/2"/>
          </div>
        </div>
      </div>
    </div>
  )
}
export default LoadingPageDark