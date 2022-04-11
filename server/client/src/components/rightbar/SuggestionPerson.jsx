import React from 'react'

const SuggestionPerson = ({friend}) => {

  const {username, profilePicture} = friend;
    
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  
  // console.log(username);
  // console.log(PF+profilePicture);

  return (
    <>
        <li className="suggestion-list-item">
            <img src={PF+profilePicture} alt="" className="suggestion-img" />
            <span className="suggestion-badge"></span>
            <div className="x">
                <span className="suggestion-name">{username}</span>
                <span className="friend-link">+Friend</span>
            </div>
        </li>
    </>
  )
}

export default SuggestionPerson