import React from 'react'

const CustomButton = ({text}: {text: string}) => {
  return (
     <div>
        <button className="bg-blue-500 text-white py-2 px-4 rounded-lg" >
            {text}
        </button>
    </div>
  )
}

export default CustomButton