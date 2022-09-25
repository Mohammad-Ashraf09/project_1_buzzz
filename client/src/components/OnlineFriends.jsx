import React, { useEffect, useState } from 'react';
import axios from "axios";

const OnlineFriends = ({onlineUsers, follow, user}) => {

  // const [alreadyPresent, setAlreadyPresent] = useState(false)

  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const DP = follow.dp ? PF+follow.dp : PF+'default-dp.png';
  
  const addToConversationHandler = async() =>{
    
    // try{
    //   const res = await axios.get("/conversations/"+user._id);
    //   res.data.map((data)=>{
    //     if(data.members[0]===follow.id || data.members[1]===follow.id){
    //       setAlreadyPresent(true)
    //       console.log(data.members);
    //     }
    //   })
    // }
    // catch(err){
    //   console.log(err);
    // }

    // if(!alreadyPresent){
      const addToConversation = window.confirm("Do you want to start Conversation with this user?");
      if(addToConversation){
        try{
          await axios.post("/conversations/", {senderId: user._id, receiverId: follow.id});
          window.location.reload();
        }
        catch(err){
          console.log(err);
        }
      }
      // setAlreadyPresent(true)
    // }
  }

  return (
    <div className='online-friend' onClick={addToConversationHandler}>
        <img className='online-friend-dp' src={DP} alt="" />
        {onlineUsers.some(data=>data.userId === follow.id) && <span className="online-friend-icon-badge"></span>}
        <span className='online-friend-name'>{follow.name}</span>
    </div>
  )
}

export default OnlineFriends