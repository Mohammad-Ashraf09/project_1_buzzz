import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import Conversation from '../components/Conversation';
import Topbar from '../components/Topbar';
import { AuthContext } from '../context/AuthContext';
import Bottombar from '../components/Bottombar';
import OnlineFriends from '../components/OnlineFriends';
import { useNavigate } from 'react-router-dom';

const ConversationsForMobile = () => {
  const [conversations, setConversations] = useState([]);
  const [following, setFollowing] = useState([]);
  const [user, setUser] = useState(null);
  const [isChats, setIsChats] = useState(true);
  const [isContacts, setIsContacts] = useState(false);
  const [query1, setQuery1] = useState("");
  const [query2, setQuery2] = useState("");
  const [currentChat, setCurrentChat] = useState(null);
  
  // const [messageNotifications, setMessageNotifications] = useState([]);
  // const [noOfNewmessages, setNoOfNewmessages] = useState(0);
  // const [notifications, setNotifications] = useState([]);

  const {user:currentUser} = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(()=>{
    const getConversations = async()=>{
      try{
        const res = await axios.get("/conversations/"+currentUser._id);
        const data = res.data.map((item)=>{
          if(item.members[0].id===currentUser._id){
            item.members.splice(0,1);
            return item;
          }
          else{
            item.members.splice(1,1);
            return item;
          }
        });
        setConversations(data);
      }
      catch(err){
        console.log(err);
      }
    }
    getConversations();

    // const getNotifications = async()=>{
    //   try{
    //     const res = await axios.get("/messages/noOfNotifications/"+currentUser._id);
    //     console.log(res.data)
    //     setNotifications(res.data.receiverId)
    //   }
    //   catch(err){
    //     console.log(err);
    //   }
    // }
    // getNotifications();
  },[currentUser._id]);

  useEffect(()=>{
    const fetchFollowings = async() =>{
      const res = await axios.get("users/"+currentUser._id);
      const arr = res.data.followings                    // array of objects de raha hai ye
      setFollowing(arr);
    }
    fetchFollowings();
  },[currentUser._id]);

  useEffect(()=>{
    const fetchUser = async() =>{
      const res = await axios.get(`/users/${currentUser._id}`);
      setUser(res.data);
    }
    fetchUser();
  },[]);

  useEffect(()=>{
    if(currentChat){
      navigate(`/conversations/${currentChat._id}`);
    }
  },[currentChat]);

  const removeNotificationFromDatabase = async(id) => {
    try{
      await axios.put("/messages/noOfNotifications/"+user._id, {friendId: id});
    }
    catch(err){
      console.log(err);
    }
  }

  return (
    <>
      <Topbar user={user}/>
        <div className='conversation-mobile'>
          <div className="conversation-mobile-wrapper">
            <div className='conversation-search'>
              <div className="conversation-search-box">
                <input
                  type="text"
                  className="conversation-search-box-input"
                  name=""
                  placeholder={isChats ? 'Search Chat' : 'Search Contact'}
                  onChange={(e)=>isChats ? setQuery1(e.target.value) : setQuery2(e.target.value)}
                />
                <div className='conversation-search-icon'> <i className="fa-solid fa-magnifying-glass"></i> </div>
              </div>

              <div className='conversation-tabs'>
                <div 
                  className='conversation-tabs-label'
                  style={isChats ? {color: '#000', borderBottom: '3px solid #0c9a97'} : null}
                  onClick={()=>{setIsChats(true); setIsContacts(false)}}
                > Chats </div>
                <div
                  className='conversation-tabs-label'
                  style={isContacts ? {color: '#000', borderBottom: '3px solid #0c9a97'} : null}
                  onClick={()=>{setIsChats(false); setIsContacts(true)}}
                > Contacts </div>
              </div>
            </div>

            {isChats ?
              <div className='conversation-list-container'>
                {conversations.filter((x)=>x.members[0].name?.toLowerCase().includes(query1)).map((c, index)=>(
                  <Conversation
                    key={c._id}
                    index={index}
                    conversation={c}
                    setConversations={setConversations}
                    setCurrentChat={setCurrentChat}
                    currentChat={currentChat}
                    // setIsReply={setIsReply}
                    // setReplyFor={setReplyFor}
                    // setMessageNotifications={setMessageNotifications}
                    // messageNotifications={messageNotifications}
                    // setNoOfNewmessages={setNoOfNewmessages}
                    // notifications={notifications}
                    // removeNotificationFromDatabase={removeNotificationFromDatabase}
                  />
                ))}
              </div>
              :
              <div className='conversation-list-container'>
                {following.filter((x)=>x.name.toLowerCase().includes(query2)).map((data)=>(
                  <OnlineFriends
                    key={data.id}
                    follow={data}
                    // onlineUsers={onlineUsers}
                    // user={user}
                    // conversations={conversations}
                    // setCurrentChat={setCurrentChat}
                    // setIsReply={setIsReply}
                    // setReplyFor={setReplyFor}
                  />
                ))}
              </div>
            }

          </div>
        </div>
      <Bottombar user={user}/>
    </>
  )
}

export default ConversationsForMobile;