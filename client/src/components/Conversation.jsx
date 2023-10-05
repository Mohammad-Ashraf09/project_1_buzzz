import React, { useEffect, useState } from 'react'
import axios from 'axios';

const Conversation = ({
  index,
  conversation,
  setConversations,
  setCurrentChat,
  currentChat,
  setIsReply,
  setReplyFor,
  setProcessedNotificationsOfCurrentUser,
  processedNotificationsOfCurrentUser,
  setNoOfNewmessages,
  rawNotificationsOfCurrentUser,
  removeNotificationFromDatabase
}) => {
  const [show3Dots, setShow3Dots] = useState(false);
  const [noOfNotifications, setNoOfNotifications] = useState(0);

  useEffect(()=>{
    if(!processedNotificationsOfCurrentUser?.includes(currentChat?.otherMemberData?.id)){  // if no chat in open state then set their notifications
      setNoOfNotifications((processedNotificationsOfCurrentUser?.filter((id)=>id===conversation?.otherMemberData?.id))?.length)
    }
    else{                                   // if a chat in open state then remove notifications of that coversation
      setProcessedNotificationsOfCurrentUser(processedNotificationsOfCurrentUser?.filter((id)=>id!==currentChat?.otherMemberData?.id))
    }
  },[processedNotificationsOfCurrentUser]);

  const conversationClickHandler = () => {
    const collection = document.querySelectorAll('.conversation');

    for(let i=0; i<collection.length; i++){
      const elm = document.getElementById(`${i}`);
      if(i===index)
        elm.classList.add('clickedConver')
      else
        elm.classList.remove('clickedConver')
    }
    setCurrentChat(conversation);
    setIsReply(false);
    setReplyFor({});
    setProcessedNotificationsOfCurrentUser(processedNotificationsOfCurrentUser?.filter((id)=>id!==conversation?.otherMemberData.id));
    setNoOfNewmessages(noOfNotifications);

    rawNotificationsOfCurrentUser?.map((item)=>{
      if(item.id===conversation?.otherMemberData.id){
        removeNotificationFromDatabase(item.id);
      }
    })
  }

  const deleteHandler = async(e)=>{
    e.preventDefault();
    const confirm = window.confirm('Are You Sure, want to delete conversation');
    if(confirm){
      try{
        await axios.delete("/conversations/delete/"+conversation._id);       // for deleting members in left portion
      }
      catch(err){
        console.log(err);
      }
      try{
        await axios.delete("/messages/delete/"+conversation._id);       // form clearing whole chat
      }
      catch(err){
        console.log(err);
      }
      setConversations((prev)=> prev.filter((item)=> item._id !== conversation._id));
      setCurrentChat(null)
    }
    setShow3Dots(false);
  }

  const name = conversation ? conversation.otherMemberData.name : "";
  const DP = conversation ? conversation.otherMemberData.dp : "/assets/default-dp.png";

  return (
    <div id={index} className='conversation'>
      <div className='dp-name' onClick={conversationClickHandler}>
        <div className='dp-badge'>
          <img className='conversation-dp' src={DP} alt="" />
          {noOfNotifications ? <span className="topbar-icon-badge message-badge">{noOfNotifications}</span> : null}
        </div>
        <p className='conversation-name'>{name}</p>
      </div>

      <div className="three-dot-icon" onClick={()=>{setShow3Dots(!show3Dots)}}>
          <i className="fa-solid fa-ellipsis"></i>
      </div>
      {show3Dots &&
        <div className="three-dot-functionality">
          <div className="three-dots-fun" id="delete-post" onClick={deleteHandler}>Delete</div>
          <div className="three-dots-fun" id="update-post" onClick={()=>{setShow3Dots(!show3Dots)}}>Report</div>
          <div className="three-dots-fun" id="cancel-post" onClick={()=>{setShow3Dots(!show3Dots)}}>Block</div>
          <div className="three-dots-fun" id="cancel-post" onClick={()=>{setShow3Dots(!show3Dots)}}>Cancel</div>
        </div>
      }
    </div>
  )
}

export default Conversation;