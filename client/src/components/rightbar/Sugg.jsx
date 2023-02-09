import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/AuthContext';
import SuggestionPerson from './SuggestionPerson';

const Sugg = ({users, myFollowingsId, onlineUsers}) => {          // users is total users is an object, myFollowings is array of objects of my followings 
  const [following, setFollowing] = useState([]);
  const {user} = useContext(AuthContext);

  useEffect(()=>{
    myFollowingsId.map((item)=>{
        const fetchFollowingsData = async() =>{
            const res = await axios.get("/users/"+item);
            const obj={};
            obj.id = res.data._id;
            obj.name = res.data.fname + " " + res.data.lname;
            setFollowing((prev)=>[...prev, obj]);
        }
        fetchFollowingsData();
    })
  },[myFollowingsId.length]);

  return (
    <>
      {users._id !== user._id && (following.some(e=>e.id===users._id)?"":<SuggestionPerson users={users} onlineUsers={onlineUsers} />)}
    </>
  )
}

export default Sugg;