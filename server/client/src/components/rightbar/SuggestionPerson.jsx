import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const SuggestionPerson = ({users, onlineUsers}) => {

  const [followed, setFollowed] = useState(false);
  const {user:currentUser} = useContext(AuthContext);

  useEffect(()=>{
    setFollowed(currentUser.followings.some(e=>e.id===users._id))
  },[currentUser, users._id]);


  const followHandler = async () =>{
    try{
      if(followed){
        await axios.put("/users/"+ users._id + "/unfollow", {userId: currentUser._id, name: users.fname+" "+users.lname, dp:users.profilePicture})
      }
      else{
        await axios.put("/users/"+ users._id + "/follow", {userId: currentUser._id, name: users.fname+" "+users.lname, dp:users.profilePicture})
      }
    }
    catch(err){
      console.log(err);
    }
    setFollowed(!followed);
  }

  //console.log(users)
  const {fname, lname, profilePicture, _id} = users;
    
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  const dp = profilePicture ? PF+profilePicture : PF+'default-dp.png';
  const name = fname +' '+ lname;

  return (
    <>
      <li className="suggestion-list-item">
          <div>
          <Link to={`/user/${_id}`}>
            <img src={dp} alt="" className="suggestion-img" />
            {onlineUsers.some(data=>data.userId === _id) && <span className="suggestion-badge"></span>}
          </Link>
          </div>
          <div className="x">
            <Link to={`/user/${_id}`} style={{textDecoration: 'none'}}>
              <span className="suggestion-name">{name}</span>
            </Link>
            <span className="friend-link" onClick={followHandler} >{followed ? 'Remove' : '+Friend'}</span>
          </div>
      </li>
    </>
  )
}

export default SuggestionPerson;