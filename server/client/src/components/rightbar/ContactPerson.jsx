import React from 'react'
import { Link } from 'react-router-dom';

const ContactPerson = ({onlineUsers, follow}) => {

  // const {fname, lname, profilePicture, _id} = friend;
    
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const DP = follow.dp ? PF+follow.dp : PF+'default-dp.png';

  return (
    <>
        <li className="contact-list-item">
            <Link to={`/user/${follow.id}`}>
              <img src={DP} alt="" className="contact-img" />
              {onlineUsers.some(data=>data.userId === follow.id) && <span className="contact-badge"></span>}
            </Link>
            <Link to={`/user/${follow.id}`} style={{textDecoration: 'none'}}>
              <span className="contact-name">{follow.name}</span>
            </Link>
        </li>
    </>
  )
}

export default ContactPerson;