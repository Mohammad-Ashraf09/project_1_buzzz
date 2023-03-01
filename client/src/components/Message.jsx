import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import {format} from "timeago.js"
import { AuthContext } from '../context/AuthContext';

const Message = ({user, message, setMessages, my, dp1, dp2, setIsReply, setReplyFor}) => {
  const [hover, setHover] = useState(false);
  

  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const DP1 = PF+dp1;
  const DP2 = PF+dp2;
  let repliedDp;
  if(message?.isSameDp){
    if(message.sender===user._id)
      repliedDp = DP1;
    else
      repliedDp = DP2;
  }
  else{
    if(message.sender===user._id)
      repliedDp = DP2;
    else
      repliedDp = DP1;
  }

  const deleteMessageHandler = async() => {
    const confirm = window.confirm('Are You Sure, want to delete message');
    if(confirm){
      try{
        await axios.delete("/messages/delete/message/"+message._id);
      }
      catch(err){
        console.log(err);
      }
      setMessages((prev)=> prev.filter((item)=> item._id !== message._id));
    }
  };
  const replyMessageHandler = () => {
    setIsReply(true);
    setReplyFor({
      id: message._id,
      text: message.text,
      isSameDp: my,
    });
  };
// console.log(message)

  return (
    <div className={my ? "message my" : "message other"}>
      <div className="message-top">
        {!my && <img src={DP2} alt="" className="message-img other-img" />}
        <div className={message?.replyForText ? "message-text replied" : "message-text"}>
          {message?.replyForText && <div className='replied-div'>
            <img className='replied-img' src={repliedDp} alt="" />
            <span className="reply-message-text">{message.replyForText}</span>
          </div>}

          <p className={message?.replyForText ? "msg-text msg-text-margin-left" : "msg-text"}>{message.text}</p>
          <div className="message-time">{format(message.createdAt)}</div>
          <div
            onMouseOver={()=>setHover(true)}
            onMouseOut={()=>setHover(false)}
            className={my ? "message-functionality message-functionality-my" : "message-functionality message-functionality-other"}
          >
            {!hover && <i class="fa-solid fa-ellipsis-vertical"></i>}
            {hover &&<div className='delete-reply-div'>
              <div className='functionality' onClick={replyMessageHandler}><i className="fa-solid fa-reply"></i></div>
              <div> | </div>
              <div className='functionality'><i className="fa-regular fa-face-laugh"></i></div>
              {my && <>
                <div> | </div>
                <div className='functionality' onClick={deleteMessageHandler}><i className="fa-solid fa-trash message-delete"></i></div>
              </>}
            </div>}
          </div>
        </div>
        {my && <img src={DP1} alt="" className="message-img my-img" />}
      </div>
    </div>
  )
}

export default Message;