import React from 'react'

const Footer = () => {
  return (
    <div className='relative z-10 text-center py-6 text-xs text-zinc-500 bg-black border-b border-white/10'>
      {new Date().getFullYear()} &copy; MITZEGLE. All rights reserved.
    </div>
  )
}

export default Footer