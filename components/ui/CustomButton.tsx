import React from 'react'
type CustomButtonProps = {
  text: string;
  onClick: () => void;
  disabled?: boolean;
};


const CustomButton = ({ text, onClick, disabled }: CustomButtonProps) => {
  return (
    <div>
      <button className="bg-blue-500 text-white py-2 px-4 rounded-lg" onClick={onClick} disabled={disabled}>
        {text}
      </button>
    </div>
  )
}

export default CustomButton