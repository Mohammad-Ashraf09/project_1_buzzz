import React from 'react'
import { Link } from 'react-router-dom';

const ContactPerson = ({friend}) => {

    const {fname, lname, username, profilePicture, _id} = friend;
    
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;

    const dp = profilePicture ? PF+profilePicture : PF+'default-dp.png';
    const name = fname +' '+ lname
    
    // console.log(username);
    // console.log(PF+profilePicture);

  return (
    <>
        <li className="contact-list-item">
            <Link to={`/user/${_id}`}>
              <img src={dp} alt="" className="contact-img" />
              <span className="contact-badge"></span>
            </Link>
            <Link to={`/user/${_id}`} style={{textDecoration: 'none'}}>
              <span className="contact-name">{name}</span>
            </Link>
        </li>
    </>
  )
}

export default ContactPerson