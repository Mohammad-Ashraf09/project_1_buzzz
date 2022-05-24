import React, { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext';
import SuggestionPerson from './SuggestionPerson';

const Sugg = ({users, myFollowings}) => {          // users is total users. an object, myFollowings is array of Ids of my followings 
    
    const {user} = useContext(AuthContext);
    //console.log(user);

    return (
      <div>
          {users._id !== user._id && (myFollowings.includes(users._id)?"":<SuggestionPerson users={users}/>)}
      </div>
    )
}

export default Sugg;