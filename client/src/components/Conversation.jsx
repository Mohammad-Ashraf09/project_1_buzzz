import React, { useState } from 'react'
import axios from 'axios';

const Conversation = ({index, conversation, setConversations, setCurrentChat, setIsReply, setReplyFor}) => {
  const [show3Dots, setShow3Dots] = useState(false);

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

  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const name = conversation ? conversation.members[0].name : "";
  const DP = conversation ? PF+conversation.members[0].dp : PF+"default-dp.png";

  return (
    <div id={index} className='conversation'>
      <div className='dp-name' onClick={conversationClickHandler}>
        <div className='dp-badge'>
          <img className='conversation-dp' src={DP} alt="" />
          <span className="topbar-icon-badge message-badge">1</span>
        </div>
        <span className='conversation-name'>{name}</span>
      </div>

      <div className="three-dot-icon" onClick={()=>{setShow3Dots(!show3Dots)}}>
          <i className="fa-solid fa-ellipsis"></i>
      </div>
      {show3Dots &&
        <div className="three-dot-functionality">
          <div className="three-dot-functionality-wrapper">
            <div className="three-dots-fun" id="delete-post" onClick={deleteHandler}>Delete</div>
            <hr className='three-dots-hr'/>
            <div className="three-dots-fun" id="update-post" onClick={()=>{setShow3Dots(!show3Dots)}}>Report</div>
            <hr className='three-dots-hr' />
            <div className="three-dots-fun" id="cancel-post" onClick={()=>{setShow3Dots(!show3Dots)}}>Block</div>
            <hr className='three-dots-hr' />
            <div className="three-dots-fun" id="cancel-post" onClick={()=>{setShow3Dots(!show3Dots)}}>Cancel</div>
          </div>
        </div>
      }
    </div>
  )
}

export default Conversation