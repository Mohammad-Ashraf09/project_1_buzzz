import React, { useContext, useEffect, useRef, useState } from 'react'
import Conversation from '../components/Conversation';
import Message from '../components/Message';
import OnlineFriends from '../components/OnlineFriends';
import Topbar from '../components/Topbar';
import { AuthContext } from '../context/AuthContext';
import axios from "axios";
import {io} from "socket.io-client";

const Messenger = () => {

  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const {user} = useContext(AuthContext);
  const scrollRef = useRef();
  const [socket, setSocket] = useState(null);
  const [following, setFollowing] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(()=>{
    setSocket(io("ws://localhost:8100"));
  },[]);

  useEffect(()=>{
    socket?.on("getMessage", data =>{
      setArrivalMessage({
        sender:data.senderId,
        text:data.text,
        createdAt:Date.now(),
      })
    })
  },[socket])

  useEffect(()=>{
    arrivalMessage && currentChat?.members.includes(arrivalMessage.sender) && setMessages((prev)=> [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);
  
  useEffect(()=>{
    socket?.emit("addUser", user._id);
    // socket.current.on("getUsers", users=>{
    //   console.log(users);                      // jobhi user massenger open karega wo users me aa jayega as array with there id and socketId
    // })
  },[socket, user._id]);

  //console.log(socket)
  
  useEffect(()=>{
    const getConversations = async()=>{
      try{
        const res = await axios.get("/conversations/"+user._id);  // logged in user ke jitne bhi conversations hai sab return karega
        setConversations(res.data);
        // console.log(res.data);
      }
      catch(err){
        console.log(err);
      }
    }
    getConversations();
  },[user._id]);

  useEffect(()=>{
    const getMessages = async() =>{
      try{
        const res = await axios.get("/messages/"+currentChat?._id)
        //console.log(res.data)
        setMessages(res.data);
      }catch(err){
        console.log(err);
      }
    };
    getMessages();
  },[currentChat]);

  const submitHandler = async(e)=>{
    e.preventDefault();
    if(newMessage){
      const message={
        sender: user._id,
        text: newMessage,
        conversationId: currentChat._id,
      };

      const receiverId = currentChat.members.find(member => member !== user._id);
      socket?.emit("sendMessage",{
        senderId : user._id,
        receiverId,
        text : newMessage,
      })
  
      try{
        const res = await axios.post("/messages", message);
        setMessages([...messages,res.data])
        setNewMessage("");
      }catch(err){
        console.log(err);
      }
    }
  };

  useEffect(()=>{
    scrollRef.current?.scrollIntoView({behavior: "smooth"});
  },[messages]);

  useEffect(()=>{
    const fetchFollowings = async() =>{
      const res = await axios.get("users/"+user._id);
      const arr = res.data.followings                    // array of objects de raha hai ye
      setFollowing(arr);
    }
    fetchFollowings();
  },[user._id]);

  useEffect(()=>{
    socket?.on("getUsers", (data)=>{
        setOnlineUsers(data);
    });
  },[socket, onlineUsers]);

  // console.log(conversations)

  return (
    <>
      <Topbar/>
      <div className='messenger'>
        <div className="messenger-leftbar">
          <div className="messenger-leftbar-wrapper">
            <input className='messenger-input' type="text" placeholder='Search for chat' />
            <div className="conversation-div">
              {conversations.map((c)=>(
                <div  key={c._id} onClick={()=>setCurrentChat(c)}>
                  <Conversation conversation={c} currentUser={user}/>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="messenger-chat-area">
          <div className="messenger-chat-area-wrapper">
            {
              currentChat ?
              <>
                <div className="chat-area-top">
                  {messages.map((m)=>(
                    <div  key={m._id} ref={scrollRef}>
                      <Message message={m} my={m.sender === user._id}/>
                    </div>
                  ))}
                </div>
                <div className="chat-area-bottom">
                  <textarea className='chat-area-input' onChange={(e) => setNewMessage(e.target.value)} value={newMessage} placeholder='Type your message here...'></textarea>
                  <div className="message-send-icon">
                    <i className="fa-solid fa-paper-plane" onClick={submitHandler} ></i>
                  </div>
                </div>
              </>
              :
              <span className='no-conversation-text'>Open a conversation to start a chat.</span>
            }
          </div>
        </div>
        <div className="messenger-rightbar">
          <div className="messenger-rightbar-wrapper">
            <input className='messenger-input search-online-friend' type="text" placeholder='Search for friend' onChange={(e)=>setQuery(e.target.value)} />
            <h3 className='online-friend-heading'>Online Friends</h3>
            <div className="online-friend-div">
              {following.filter((x)=>x.name.toLowerCase().includes(query)).map((data)=>(
                <OnlineFriends key={data.id} follow={data} onlineUsers={onlineUsers} user={user}/>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Messenger;