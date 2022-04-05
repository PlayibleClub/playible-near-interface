//loading component for modals
import React from 'react'

const LoadingModal = () => {
  return (
    <div className="max-w-sm animate-pulse flex space-x-6 justify-center p-4">
      <div className="bg-indigo-light rounded-full w-2 h-2"/>
      <div className="bg-indigo-light rounded-full w-2 h-2"/>
      <div className="bg-indigo-light rounded-full w-2 h-2"/>
      <div className="bg-indigo-light rounded-full w-2 h-2"/>
      <div className="bg-indigo-light rounded-full w-2 h-2"/>
      <div className="bg-indigo-light rounded-full w-2 h-2"/>
      <div className="bg-indigo-light rounded-full w-2 h-2"/>
    </div>
  )
}
export default LoadingModal