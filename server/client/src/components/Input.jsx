import React from 'react'

const Input = ({type,className,placeholder,name,onChange}) => {
  return (
    <>
      <input className={`form-control ${className}`} type={type} name={name} placeholder={placeholder} onChange={onChange}/>
    </>
  )
}

export default Input;