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
  const [dp2, setDp2] = useState("");
  const [isReply, setIsReply] = useState(false);
  const [replyFor, setReplyFor] = useState({});

  // console.log('conversations--------------', conversations)
  // console.log('currentChat--------------', currentChat)
  // console.log('messages--------------', messages)
  // console.log('newMessage--------------', newMessage)
  // console.log('arrivalMessage--------------', arrivalMessage)
  // console.log('following--------------', following)

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
    socket?.emit("addUser2", user._id);
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
      }
      catch(err){
        console.log(err);
      }
    }
    getConversations();
  },[user._id]);

  useEffect(()=>{
    const getMessages = async() =>{
      if(currentChat){
        try{
          const res = await axios.get("/messages/"+currentChat?._id)
          setMessages(res.data);
        }catch(err){
          console.log(err);
        }
  
        let otherUser = currentChat?.members.filter((id)=>id !== user._id);
        try{
          const res = await axios("/users/"+otherUser);
          setDp2(res.data.profilePicture);
        }catch(err){
          console.log(err);
        }
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
        replyForId: replyFor.id ? replyFor.id : "",
        replyForText: replyFor.text ? replyFor.text : "",
        isSameDp: replyFor.isSameDp,
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
        setIsReply(false);
        setReplyFor({});
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

  const clearChatHandler = async() => {
    const confirm = window.confirm('Are You Sure, want to clear chat');
    if(confirm){
      try{
        await axios.delete("/messages/delete/"+currentChat._id);       // form clearing whole chat
      }
      catch(err){
        console.log(err);
      }
      setMessages([]);
    }
  }

  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const DP = replyFor?.isSameDp? PF+user?.profilePicture : PF+dp2;
  const text = replyFor?.text;

  return (
    <>
      <Topbar user={user}/>
      <div className='messenger'>
        <div className="messenger-left">
          <div className="messenger-left-wrapper">
            <input className='messenger-search' type="text" placeholder='Search for chat' />
            <div className="conversation-div">
              {conversations.map((c, index)=>(
                <Conversation
                  key={c._id}
                  index={index}
                  conversation={c}
                  setConversations={setConversations}
                  setCurrentChat={setCurrentChat}
                  currentUser={user}
                  setIsReply={setIsReply}
                  setReplyFor={setReplyFor}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="messenger-center">
          <div className="messenger-center-wrapper">
            {(currentChat && messages?.length) ?
              <div className='clear-chat'>
                <i className="fa-solid fa-trash clear-chat-icon" onClick={clearChatHandler}></i>
                <div className='clear-chat-text'>clear chat</div>
              </div>
              :
              <div style={{height: '40px'}}></div>
            }
            {
              currentChat ?
              <>
                <div className="chat-view-area" style={{height: !isReply ? '81%' : ''}}>
                  {messages.map((m)=>(
                    <div  key={m._id} ref={scrollRef}>
                      <Message
                        user={user}
                        message={m}
                        setMessages={setMessages}
                        my={m.sender === user._id}
                        dp1={user?.profilePicture}
                        dp2={dp2}
                        setIsReply={setIsReply}
                        setReplyFor={setReplyFor}
                      />
                    </div>
                  ))}
                </div>
                <div className="input-chat-area">
                  {isReply && <div className='reply-message-div'>
                    <div className='reply-message'>
                      <img className='reply-message-img' src={DP} alt="" />
                      <span className='reply-message-text'>{text}</span>
                      <i class="fa-solid fa-xmark reply-message-cancel" onClick={()=>{setIsReply(false); setReplyFor({})}}></i>
                    </div>
                  </div>}
                  <div className='input-chat'>
                    <textarea
                      className='type-message'
                      onChange={(e) => setNewMessage(e.target.value)}
                      value={newMessage}
                      placeholder='Type your message here...'
                      style={{borderRadius: !isReply ? '8px' : ''}}
                    ></textarea>

                    <div className="message-send-icon">
                      <i className="fa-solid fa-paper-plane" onClick={submitHandler} ></i>
                    </div>
                  </div>
                </div>
              </>
              :
              <span className='no-conversation-text'>Open a conversation to start a chat.</span>
            }
          </div>
        </div>

        <div className="messenger-right">
          <div className="messenger-right-wrapper">
            <input className='messenger-search search-online-friend' type="text" placeholder='Search for friend' onChange={(e)=>setQuery(e.target.value)} />
            <h3 className='online-friend-heading'>Online Friends</h3>
            <div className="online-friend-div">
              {following.filter((x)=>x.name.toLowerCase().includes(query)).map((data)=>(
                <OnlineFriends
                  key={data.id}
                  follow={data}
                  onlineUsers={onlineUsers}
                  user={user}
                  conversations={conversations}
                  setCurrentChat={setCurrentChat}
                  setIsReply={setIsReply}
                  setReplyFor={setReplyFor}
                />
              ))}
            </div>
          </div>
        </div>

      </div>
    </>
  )
}

export default Messenger;