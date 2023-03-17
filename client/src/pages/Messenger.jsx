import React, { createRef, useContext, useEffect, useRef, useState } from 'react'
import Conversation from '../components/Conversation';
import Message from '../components/Message';
import OnlineFriends from '../components/OnlineFriends';
import Topbar from '../components/Topbar';
import { AuthContext } from '../context/AuthContext';
import axios from "axios";
import {io} from "socket.io-client";
import EmojiContainer from '../components/emoji/EmojiContainer';
import PreviewMedia from '../components/PreviewMedia';

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
  const [query2, setQuery2] = useState("");
  const [dp2, setDp2] = useState("");
  const [isReply, setIsReply] = useState(false);
  const [replyFor, setReplyFor] = useState({});
  const [showEmojis, setShowEmojis] = useState(false);
  const inputRef = createRef();
  const [cursorPosition, setCursorPosition] = useState();
  const [file, setFile] = useState([]);
  const [xyz, setXYZ] = useState(false);
  const [preview, setPreview] = useState([]);
  // const [isNewMsg, setIsNewMsg] = useState(false);                           // apply it mobile view

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
    arrivalMessage && currentChat?.IDs.includes(arrivalMessage.sender) && setMessages((prev)=> [...prev, arrivalMessage]);
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
        const data = res.data.map((item)=>{
          if(item.members[0].id===user._id){
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
        setDp2(currentChat?.members[0].dp);
      }
    };
    getMessages();
  },[currentChat]);

  const submitHandler = async(e)=>{
    e.preventDefault();
    if(newMessage || file.length){
      const message={
        sender: user._id,
        text: newMessage,
        media: [],
        conversationId: currentChat._id,
        replyForId: replyFor.id ? replyFor.id : "",
        replyForText: replyFor.text ? replyFor.text : "",
        replyForImage: replyFor.media.length ? replyFor.media : "",
        isSameDp: replyFor.isSameDp,
      };

      if(file.length){
        file.map((image)=>{
          const uploadFile = async() =>{
            const data = new FormData();
            const fileName = Date.now() + image.name;
            data.append("name", fileName)
            data.append("file", image)
            message.media.push(fileName);
            try{
              await axios.post("/upload", data)        // to upload photo into local storage
            }catch(err){
              console.log(err)
            }
          }
          uploadFile();
        })
      }

      socket?.emit("sendMessage",{
        senderId : user._id,
        receiverId: currentChat.members[0].id,
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

      // try{                                 // apply it mobile view
      //   await axios.put("/conversations/update/"+currentChat._id, {lastMsgText: newMessage, lastMsgSenderId: user._id,});
      // }
      // catch(err){
      //   console.log(err);
      // }

      // setIsNewMsg(!isNewMsg);
      // setCurrentChat({...currentChat, lastMsgText: newMessage});
      setShowEmojis(false);
      setPreview([]);
      setFile([]);
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

  useEffect(()=>{              // this useEffect is for preview the file before uploading it
    if(file?.[0] && xyz){
      const len = preview.length
      const objectUrl = URL.createObjectURL(file?.[len])
      setPreview((prev)=>[...prev, objectUrl])
      // return () => URL.revokeObjectURL(objectUrl)   // free memory when ever this component is unmounted
    }
  },[file]);

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

  const fileHandler = (e) =>{
    if(e.target.files[0]){
      setXYZ(true);
      setFile((prev)=>[...prev, e.target.files[0]]);
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
            <input className='messenger-search' type="text" placeholder='Search for chat' onChange={(e)=>setQuery2(e.target.value)}/>
            <div className="conversation-div">
              {conversations.filter((x)=>x.members[0].name?.toLowerCase().includes(query2)).map((c, index)=>(
                <Conversation
                  key={c._id}
                  index={index}
                  conversation={c}
                  setConversations={setConversations}
                  setCurrentChat={setCurrentChat}
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
                <div
                  className="chat-view-area"
                  style={{
                    height: (isReply || preview?.length>0) ? (isReply && preview?.length>0 ? 'calc(81% - 160px)' : 'calc(81% - 80px)') : '81%'
                  }}
                >
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
                      {replyFor?.media.length ? <img className='reply-message-img-right' src={PF+replyFor?.media} alt="" /> : null}
                      <i class="fa-solid fa-xmark reply-message-cancel" onClick={()=>{setIsReply(false); setReplyFor({})}}></i>
                    </div>
                  </div>}

                  {preview?.length>0 &&
                    <div
                      className='reply-message-div media-div'
                      style={{
                        borderTopLeftRadius: isReply ? '0px' : '',
                        borderTopRightRadius: isReply ? '0px' : ''
                      }}
                    >
                      <div className='reply-message'>
                        {preview.map((media, index)=>(
                          <PreviewMedia
                            key={index}
                            idx={index}
                            media={media}
                            setPreview={setPreview}
                            file={file}
                            setFile={setFile}
                            setXYZ={setXYZ}
                          />
                        ))}
                      </div>
                    </div>
                  }

                  <div className='input-chat'>
                    <textarea
                      className='type-message'
                      onChange={(e) => setNewMessage(e.target.value)}
                      value={newMessage}
                      placeholder='Type your message here...'
                      ref={inputRef}
                      style={{borderRadius: (isReply || preview?.length>0) ? '' : '8px'}}
                    ></textarea>

                    <div className="emoji-media-div">
                      <label htmlFor="file">
                        {/* <i className="fa-solid fa-paperclip icon"></i> */}
                        <i className="fa-solid fa-photo-film icon"></i>
                        <input style={{display:"none"}} type="file" id="file" name="file" accept='.jpg, .png, .jpeg, .mp4, .MOV' onChange={file.length!==9 && fileHandler}/>
                      </label>
                      <div className="emoji-div">
                        <i className="fa-regular fa-face-laugh icon" onClick={()=>{setShowEmojis(!showEmojis)}}></i>
                      </div>
                    </div>

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

      {showEmojis &&
        <EmojiContainer
          inputRef={inputRef}
          setMessage={setNewMessage}
          message={newMessage}
          setCursorPosition={setCursorPosition}
          cursorPosition={cursorPosition}
        />
      }

    </>
  )
}

export default Messenger;