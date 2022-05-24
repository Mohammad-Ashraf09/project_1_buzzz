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
  const socket = useRef();

  useEffect(()=>{
    socket.current = io("ws://localhost:8100");

    socket.current.on("getMessage", data =>{
      setArrivalMessage({
        sender:data.senderId,
        text:data.text,
        createdAt:Date.now(),
      })
    })
  },[])

  useEffect(()=>{
    arrivalMessage && currentChat?.members.includes(arrivalMessage.sender) && setMessages((prev)=> [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);
  
  useEffect(()=>{
    socket.current.emit("addUser", user._id);
    socket.current.on("getUsers", users=>{
      console.log(users);                      // jobhi user massenger open karega wo users me aa jayega as array with there id and socketId
    })
  },[user]);

  //console.log(socket)
  
  useEffect(()=>{
    const getConversations = async()=>{
      try{
        const res = await axios.get("/conversations/"+user._id);  // logged in user ke jitne bhi conversations hai sab return karega
        setConversations(res.data);
        //console.log(res.data);
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
      socket.current.emit("sendMessage",{
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
  },[messages])

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
            <h3 className='online-friend-heading'>Online Friends</h3>
            <div className="online-friend-div">
              <OnlineFriends/>
              <OnlineFriends/>
              <OnlineFriends/>
              <OnlineFriends/>
              <OnlineFriends/>
              <OnlineFriends/>
              <OnlineFriends/>
              <OnlineFriends/>
              <OnlineFriends/>
              <OnlineFriends/>
              <OnlineFriends/>
              <OnlineFriends/>
              <OnlineFriends/>
              <OnlineFriends/>
              <OnlineFriends/>
              <OnlineFriends/>
              <OnlineFriends/>
              <OnlineFriends/>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Messenger;