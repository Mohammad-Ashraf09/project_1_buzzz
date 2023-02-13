import React, { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext';
import SuggestionPerson from './SuggestionPerson';

const Sugg = ({users, myFollowings, onlineUsers}) => {   // users is total users is an object, myFollowings is array of objects of my followings
  const {user} = useContext(AuthContext);

  return (
    <>
      {users._id !== user._id && (myFollowings.some(e=>e.id===users._id)?"":<SuggestionPerson users={users} onlineUsers={onlineUsers}/>)}
    </>
  )
}

export default Sugg;