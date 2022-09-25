import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import Conversation from '../components/Conversation';
import Topbar from '../components/Topbar';
import { AuthContext } from '../context/AuthContext';

const ConversationsForMobile = () => {
    const [conversations, setConversations] = useState([]);
    const {user} = useContext(AuthContext);

    useEffect(()=>{
        const getConversations = async()=>{
          try{
            const res = await axios.get("/conversations/"+user._id);
            setConversations(res.data);
            // console.log(res.data);
          }
          catch(err){
            console.log(err);
          }
        }
        getConversations();
      },[user._id]);

  return (
    <>
        <Topbar/>
        <div className="conversation-div">
            {conversations.map((c)=>(
            <div  key={c._id} >
                <Conversation conversation={c} currentUser={user}/>
            </div>
            ))}
        </div>
    </>
  )
}

export default ConversationsForMobile