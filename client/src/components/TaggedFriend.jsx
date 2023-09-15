import React from 'react'

const TaggedFriend = ({friend, setTaggedFriends, setShowTaggedFriendsPostContainer, taggedFriends}) => {
  const cancelTagHandler = (friend)=>{
    setTaggedFriends((prev)=> prev.filter((item)=> item.name !== friend.name))

    if(taggedFriends.length === 1)
      setShowTaggedFriendsPostContainer(false);
  }

  return (
    <div className='selected-tagged-friends-wrapper'>
      <i class="fa-solid fa-tags selected-tagged-friends-icon tagged-item-icon"></i>
      <div className='selected-tagged-friends-name tagged-item-name'>{friend.name}</div>
      <div className='selected-tagged-friends-cancel tagged-item-cancel'><i class="fa-solid fa-xmark" onClick={()=> cancelTagHandler(friend)}></i></div>
    </div>
  )
}

export default TaggedFriend