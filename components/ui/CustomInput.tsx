import React from 'react'

const CustomInput = ({placeholder}:{placeholder:string}) => {
  return (
    <div className='h-8 w-4/5 p-5 flex justify-center items-center border border-gray-300 rounded-lg'>
        <input type="text" placeholder={placeholder} className='outline-none border-none' />
    </div>
  )
}

export default CustomInput