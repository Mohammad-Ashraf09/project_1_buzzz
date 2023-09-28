import React, { useEffect, useState } from 'react';
import axios from "axios";

const OnlineFriends = ({onlineUsers, follow, user, conversations, setCurrentChat, setIsReply, setReplyFor}) => {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const DP = follow.dp ? follow.dp : PF+'default-dp.png';
  
  const clickHandler = async() =>{
    const collection = document.querySelectorAll('.conversation');     // this comes from Conversation.jsx
    const isPresent = conversations.map((item)=>item.IDs.includes(follow.id));

    if(isPresent.includes(true)){
      isPresent.map((item,idx)=>{
        if(item){
          for(let i=0; i<collection.length; i++){
            const elm = document.getElementById(`${i}`);
            if(i===idx)
              elm.classList.add('clickedConver')
            else
              elm.classList.remove('clickedConver')
          }
          setCurrentChat(conversations[idx]);
          setIsReply(false);
          setReplyFor({});
        }
      })
    }
    else{
      const addToConversationHandler = async() => {
        const addToConversation = window.confirm("Do you want to start Conversation with this user?");
        if(addToConversation){
          try{
            await axios.post("/conversations/", {
              senderId: user._id,
              receiverId: follow.id,
              senderData: {id: user._id, dp: user.profilePicture, name: user.fname+" "+user.lname},
              receiverData: {id: follow.id, dp: follow.dp, name: follow.name}
            });
            window.location.reload();
          }
          catch(err){
            console.log(err);
          }
        }
      }
      addToConversationHandler();
    }
  }

  return (
    <div className='online-friend' onClick={clickHandler}>
      <img className='online-friend-dp' src={DP} alt="" />
      {onlineUsers?.some(data=>data.userId === follow.id) && <span className="online-friend-icon-badge"></span>}
      <p className='online-friend-name'>{follow.name}</p>
    </div>
  )
}

export default OnlineFriends