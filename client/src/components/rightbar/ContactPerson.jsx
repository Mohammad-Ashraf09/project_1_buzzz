import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

const ContactPerson = ({onlineUsers, userId}) => {
  const [user, setUser] = useState({});

  useEffect(()=>{
    const fetchUser = async() =>{
      const res = await axios.get(`/users/${userId}`);
      setUser(res.data);
    }
    fetchUser();
  },[userId]);

  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const name = user.fname + ' ' + user.lname;
  const DP = user.profilePicture ? PF + user.profilePicture : PF + "default-dp.png";

  return (
    <>
        <li className="contact-list-item">
            <Link to={`/user/${userId}`}>
              <img src={DP} alt="" className="contact-img" />
              {onlineUsers.some(data=>data.userId === userId) && <span className="contact-badge"></span>}
            </Link>
            <Link to={`/user/${userId}`} style={{textDecoration: 'none'}}>
              <span className="contact-name">{name}</span>
            </Link>
        </li>
    </>
  )
}

export default ContactPerson;