import React from 'react'
import { Link } from 'react-router-dom';

const SuggestionPerson = ({friend}) => {

  const {fname, lname, username, profilePicture, _id} = friend;
    
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  const dp = profilePicture ? PF+profilePicture : PF+'default-dp.png';
  const name = fname +' '+ lname
  
  // console.log(username);
  // console.log(PF+profilePicture);

  return (
    <>
      <li className="suggestion-list-item">
          <Link to={`/user/${_id}`}>
            <img src={dp} alt="" className="suggestion-img" />
            <span className="suggestion-badge"></span>
          </Link>
          <div className="x">
            <Link to={`/user/${_id}`} style={{textDecoration: 'none'}}>
              <span className="suggestion-name">{name}</span>
            </Link>
            <span className="friend-link">+Friend</span>
          </div>
      </li>
    </>
  )
}

export default SuggestionPerson