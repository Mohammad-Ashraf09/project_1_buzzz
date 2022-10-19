import React from 'react'

const FriendList = ({friend, setShowFriendList, setTaggedFriends, setShowTaggedFriendsPostContainer, setQuery}) => {
    const clickHandler = ()=>{
        setTaggedFriends((prev)=>[...prev, friend.name]);
        // setShowFriendList(false);
        setShowTaggedFriendsPostContainer(true);
        setQuery("");
    }

    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const DP = friend.dp ? PF+friend.dp : PF+'default-dp.png';

  return (
    <>
        <li className="friend-list-item" onClick={clickHandler}>
            <img src={DP} alt="" className="friend-img" />
            <span className="friend-name">{friend.name}</span>
        </li>
    </>
  )
}

export default FriendList;