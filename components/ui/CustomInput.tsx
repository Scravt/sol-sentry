import React from 'react'
interface CustomInputProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string; // Para poder pasar clases de Tailwind desde afuera
  disabled?: boolean;
}

const CustomInput = ({ placeholder, value, onChange, className, disabled }: CustomInputProps) => {
  return (
    <div className={`h-8 w-4/5 p-5 flex justify-center items-center border border-gray-300 rounded-lg ${className}`}>
      <input
        disabled={disabled}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className='outline-none border-none' />
    </div>
  )
}

export default CustomInput