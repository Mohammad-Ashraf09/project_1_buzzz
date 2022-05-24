import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import {format} from "timeago.js"
import { AuthContext } from '../context/AuthContext';

const Message = ({message, my}) => {
  const [dp, setDp] = useState("");
  const {user} = useContext(AuthContext);

  useEffect(()=>{
    const getUser= async()=>{
      try{
        const res = await axios("/users/"+message.sender);
        setDp(res.data.profilePicture);
      }catch(err){
        console.log(err);
      }
    }
    getUser();
  },[message]);

  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const dp1 = user.profilePicture ? PF+user.profilePicture : PF+"default-dp.png";
  const dp2 = dp ? PF+dp : PF+"default-dp.png";

  return (
    <div className={my ? "message my" : "message"}>
        <div className="message-top">
            <img src={my ? dp1 : dp2} alt="" className="message-img" />
            <div className="message-text">
                <p className="msg-text">{message.text}</p>
                <div className="message-time">{format(message.createdAt)}</div>
            </div>
        </div>
    </div>
  )
}

export default Message