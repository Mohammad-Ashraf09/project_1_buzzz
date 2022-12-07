import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

const WhoLikedDisliked = ({userId}) => {
  const [user, setUser] = useState({});

  useEffect(()=>{
    const fetchUser = async() =>{
      const res = await axios.get(`users/${userId}`);
      setUser(res.data);
    }
    fetchUser();
  },[userId]);

  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const name = user.fname + ' ' + user.lname;
  const DP = user.profilePicture ? PF + user.profilePicture : PF + "default-dp.png";

  return (
    <li className="liked-disliked-item">
      <Link to={`/user/${userId}`}>
        <img src={DP} alt="" className="liked-disliked-img" />
      </Link>
      <Link to={`/user/${userId}`} style={{textDecoration: 'none'}}>
        <span className="liked-disliked-name">{name}</span>
      </Link>
    </li>
  )
}

export default WhoLikedDisliked;