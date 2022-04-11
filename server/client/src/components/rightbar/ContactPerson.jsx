import React from 'react'

const ContactPerson = ({friend}) => {

    const {username, profilePicture} = friend;
    
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    
    // console.log(username);
    // console.log(PF+profilePicture);

  return (
    <>
        <li className="contact-list-item">
            <img src={PF+profilePicture} alt="" className="contact-img" />
            <span className="contact-badge"></span>
            <span className="contact-name">{username}</span>
        </li>
    </>
  )
}

export default ContactPerson