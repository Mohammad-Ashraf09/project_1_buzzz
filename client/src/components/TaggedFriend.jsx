import React from 'react'

const TaggedFriend = ({friend, setTaggedFriends, setShowTaggedFriendsPostContainer, taggedFriends}) => {
  const cancelTagHandler = (friend)=>{
    setTaggedFriends((prev)=> prev.filter((item)=> item !== friend))

    if(taggedFriends.length === 1)
      setShowTaggedFriendsPostContainer(false);
  }

  return (
    <div className='location-post-container-wrapper'>
      <i class="fa-solid fa-tags location-post-icon"></i>
      <div className='location-post-name'>{friend}</div>
      <div className='location-post-cross'><i class="fa-solid fa-xmark" onClick={()=> cancelTagHandler(friend)}></i></div>
    </div>
  )
}

export default TaggedFriend