import axios from 'axios';
import React, { useEffect, useState } from 'react'

const Conversation = ({conversation, currentUser}) => {

  const [name, setName] = useState("");
  const [dp, setDp] = useState("");

  useEffect(()=>{
    const friendId = conversation.members.find(m=>m !== currentUser._id);

    const getUser= async()=>{
      try{
        const res = await axios("/users/"+friendId);
        
        setName(res.data.fname + " " + res.data.lname);
        setDp(res.data.profilePicture);
      }catch(err){
        console.log(err);
      }
    }
    getUser();
  },[currentUser, conversation])

  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const DP = dp ? PF+dp : PF+"default-dp.png";

  return (
    <div className='conversation'>
        <img className='conversation-dp' src={DP} alt="" />
        <span className='conversation-name'>{name}</span>
    </div>
  )
}

export default Conversation