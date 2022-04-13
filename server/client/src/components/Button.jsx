import React, { Children } from 'react'

const Button = ({type,className,children}) => {
  console.log(type,className); 
  return (
    <div> 
      <button type={type} className={`${className}`}> {children} </button>
    </div>
  )
}

export default Button;