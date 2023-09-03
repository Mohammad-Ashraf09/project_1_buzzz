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
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../../src/firebase";
import Compressor from 'compressorjs';

const Messenger = () => {
  const {user} = useContext(AuthContext);
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const scrollRef = useRef();
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
  const [socket, setSocket] = useState(null);
  const [messageNotifications, setMessageNotifications] = useState([]);
  const [noOfNewmessages, setNoOfNewmessages] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [imgURL, setImgURL] = useState([]);
  const [sendMessageOnlyWithText, setSendMessageOnlyWithText] = useState(false);
  const [sendingFileInProgress, setSendingFileInProgress] = useState(false);
  const [lastPreviewMediaUrl, setLastPreviewMediaUrl] = useState('');
  // const [isNewMsg, setIsNewMsg] = useState(false);                           // apply it mobile view

  const oldMessages = messages.slice(0, messages?.length-noOfNewmessages);
  const newMessages = messages.slice(messages?.length-noOfNewmessages, messages?.length);

  useEffect(()=>{
    setSocket(io("ws://localhost:8100"));
  },[]);

  useEffect(()=>{
    socket?.emit("addUser2", user._id);
  },[socket, user._id]);

  useEffect(()=>{
    socket?.on("getUsers2", (data)=>{
      setOnlineUsers(data);
    });
  },[socket]);

  useEffect(()=>{
    socket?.on("getMessage", data =>{
      setArrivalMessage({
        sender:data.sender,
        text:data.text,
        media: data.media,
        conversationId: data.conversationId,
        replyForId: data.replyForId,
        replyForText: data.replyForText,
        replyForImage: data.replyForImage,
        isSameDp: data.isSameDp,
        createdAt:Date.now(),
      })
    });

    socket?.on("getMessageNotification", (data)=>{
      setMessageNotifications((prev)=>[...prev, data]);
    });
  },[socket]);

  useEffect(()=>{
    if(messageNotifications.length===0){
      notifications?.map((item)=>{
        item.notifications.map((id)=>{
          setMessageNotifications((prev)=>[...prev, item.id]);
        })
      })
    }
  },[notifications]);

  useEffect(()=>{
    arrivalMessage && currentChat?.IDs.includes(arrivalMessage.sender) && setMessages((prev)=> [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);
  
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

    const getNotifications = async()=>{
      try{
        const res = await axios.get("/messages/noOfNotifications/"+user._id);
        setNotifications(res.data.receiverId)
      }
      catch(err){
        console.log(err);
      }
    }
    getNotifications();
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

  useEffect(()=>{              // this useEffect is for preview the file before uploading it
    if(file?.length && xyz){
      const len = preview?.length
      const objectUrl = URL.createObjectURL(file?.[len])
      setPreview((prev)=>[...prev, objectUrl])
      // return () => URL.revokeObjectURL(objectUrl)   // free memory when ever this component is unmounted
    }
  },[file?.length]);

  const removeNotificationFromDatabase = async(id) => {
    try{
      await axios.put("/messages/noOfNotifications/"+user._id, {friendId: id});
    }
    catch(err){
      console.log(err);
    }
  }

  const notificationHandler = async() => {
    const arr = window.location.href.split("/")
    const page = arr[arr.length-1]
    const isOnlinePresent = onlineUsers.filter((user)=> user.userId === (currentChat.members[0].id!==user._id ? currentChat.members[0].id : currentChat.members[1].id));

    if(isOnlinePresent.length && page==='messenger'){
      socket.emit("sendMessageNotification", {
        senderId: user._id,
        receiverId: currentChat.members[0].id!==user._id
          ? currentChat.members[0].id
          : currentChat.members[1].id
      });     // if user is online then directly show them notification without changing in database
    }
    else{
      const increaseCountInDatabase = async()=>{
        try{
          await axios.put("messages/noOfNotifications/", {user1: user._id, user2: currentChat.members[0].id!==user._id ? currentChat.members[0].id : currentChat.members[1].id});  // else increase array length of noOfNotifications by 1
        }
        catch(err){}
      }
      increaseCountInDatabase();
    }
  }

  const submitHandler = async(e)=>{
    e.preventDefault();

    if(file?.length){
      const message={
        sender: user._id,
        text: "",
        media: preview,
        conversationId: currentChat._id,
        replyForId: "",
        replyForText: "",
        replyForImage: "",
        isSameDp: replyFor.isSameDp,
        createdAt: new Date(),
      };
      setMessages([...messages, message]);
      setShowEmojis(false);
      setNoOfNewmessages(0);
      setSendingFileInProgress(true);
      setLastPreviewMediaUrl(preview[preview?.length-1]);
      setPreview([]);

      file.map((item)=>{
        if(item.type === "image/jpeg"){   // for image upload after compressing
          new Compressor(item, {
            quality: 0.3,  // 0.6 can also be used, but its not recommended to go below.
            success: (compressedResult) => {
              const imgName = compressedResult?.name?.toLowerCase()?.split(' ').join('-');
              const uniqueImageName = new Date().getTime() + '-' + imgName;
    
              const storageRef = ref(storage, uniqueImageName);
              // setImgRef((prev)=> [...prev, storageRef]);
              const uploadTask = uploadBytesResumable(storageRef, compressedResult);
    
              uploadTask.on('state_changed', (snapshot) => {
                  const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                  console.log('Upload is ' + progress + '% done');
                  switch (snapshot.state) {
                    case 'paused':
                      console.log('Upload is paused');
                      break;
                    case 'running':
                      console.log('Upload is running');
                      break;
                    default:
                      break;
                  }
                },
                (error) => {
                  console.log(error)
                },
                () => {
                  getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setImgURL((prev)=> [...prev, downloadURL])
                  });
                }
              );
            },
          });
        }
        else {     // for video upload without compressing
          const imgName = item.name?.toLowerCase()?.split(' ').join('-');
          const uniqueImageName = new Date().getTime() + '-' + imgName;
  
          const storageRef = ref(storage, uniqueImageName);
          // setImgRef((prev)=> [...prev, storageRef]);
          const uploadTask = uploadBytesResumable(storageRef, item);
  
          uploadTask.on('state_changed', (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log('Upload is ' + progress + '% done');
              switch (snapshot.state) {
                case 'paused':
                  console.log('Upload is paused');
                  break;
                case 'running':
                  console.log('Upload is running');
                  break;
                default:
                  break;
              }
            }, 
            (error) => {
              console.log(error)
            }, 
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                setImgURL((prev)=> [...prev, downloadURL])
              });
            }
          );
        }
      })
    }
    else{
      setSendMessageOnlyWithText(true);
    }
  };

  useEffect(()=>{
    if((imgURL?.length === file?.length) && imgURL?.length){
      const saveMediaLinkToDatabaseWithEmptyText = async() => {
        const message={
          sender: user._id,
          text: "",
          media: imgURL,
          conversationId: currentChat._id,
          replyForId: "",
          replyForText: "",
          replyForImage: "",
          isSameDp: replyFor.isSameDp,
        };

        try{
          await axios.post("/messages", message);
          setNoOfNewmessages(0)
          notificationHandler();
        }catch(err){
          console.log(err);
        }

        const arr = window.location.href.split("/");
        const page = arr[arr.length-1];
        const isOnlinePresent = onlineUsers.filter((user)=>
          user.userId === (currentChat.members[0].id!==user._id ? currentChat.members[0].id : currentChat.members[1].id));
        if(isOnlinePresent?.length && page==='messenger'){
          socket?.emit("sendMessage",{
            ...message,
            receiver: currentChat.members[0].id!==user._id ? currentChat.members[0].id : currentChat.members[1].id,
          })
        }
  
        // try{                                 // apply it mobile view
        //   await axios.put("/conversations/update/"+currentChat._id, {lastMsgText: newMessage, lastMsgSenderId: user._id,});
        // }
        // catch(err){
        //   console.log(err);
        // }
        // setIsNewMsg(!isNewMsg);
        // setCurrentChat({...currentChat, lastMsgText: newMessage});
  
        setFile([]);
        setImgURL([]);
        // setImgRef([]);
        setSendingFileInProgress(false);
      }
      saveMediaLinkToDatabaseWithEmptyText();
    }
    if(sendMessageOnlyWithText){
      const saveTextMsgToDatabase = async() => {
        const message={
          sender: user._id,
          text: newMessage,
          media: imgURL,
          conversationId: currentChat._id,
          replyForId: replyFor.id ? replyFor.id : "",
          replyForText: replyFor.text ? replyFor.text : "",
          replyForImage: replyFor.media?.length ? replyFor.media : "",
          isSameDp: replyFor.isSameDp,
        };

        try{
          const res = await axios.post("/messages", message);
          setMessages([...messages, res.data]);
          setNewMessage("");
          setIsReply(false);
          setReplyFor({});
          setNoOfNewmessages(0);
          notificationHandler();
        }catch(err){
          console.log(err);
        }

        const arr = window.location.href.split("/");
        const page = arr[arr.length-1];
        const isOnlinePresent = onlineUsers.filter((user)=>
          user.userId === (currentChat.members[0].id!==user._id ? currentChat.members[0].id : currentChat.members[1].id));
        if(isOnlinePresent?.length && page==='messenger'){
          socket?.emit("sendMessage",{
            ...message,
            receiver: currentChat.members[0].id!==user._id ? currentChat.members[0].id : currentChat.members[1].id,
          })
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
        setSendMessageOnlyWithText(false);
      }
      saveTextMsgToDatabase();
    }
  },[sendMessageOnlyWithText, imgURL?.length]);

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
                  currentChat={currentChat}
                  setIsReply={setIsReply}
                  setReplyFor={setReplyFor}
                  setMessageNotifications={setMessageNotifications}
                  messageNotifications={messageNotifications}
                  setNoOfNewmessages={setNoOfNewmessages}
                  notifications={notifications}
                  removeNotificationFromDatabase={removeNotificationFromDatabase}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="messenger-center">
          <div className="messenger-center-wrapper">
            {(currentChat && messages?.length) ? (
              <div className='clear-chat'>
                <i className="fa-solid fa-trash clear-chat-icon" onClick={clearChatHandler}></i>
                <div className='clear-chat-text'>clear chat</div>
              </div>
            ) : null}

            {currentChat ? (
              <>
                <div
                  className="chat-view-area"
                  style={{
                    height: (isReply || preview?.length>0) ? (isReply ? 'calc(81% - 80px)' : 'calc(81% - 20px)') : '81%'
                  }}
                >
                  {oldMessages.map((msg)=>(
                    <div  key={msg._id} ref={scrollRef}>
                      <Message
                        userId={user?._id}
                        message={msg}
                        setMessages={setMessages}
                        my={msg?.sender === user?._id}
                        dp1={user?.profilePicture}
                        dp2={dp2}
                        setIsReply={setIsReply}
                        setReplyFor={setReplyFor}
                        isHideReplyIcon={file?.length}
                        lastPreviewMediaUrl={lastPreviewMediaUrl}
                        sendingFileInProgress={sendingFileInProgress}
                      />
                    </div>
                  ))}

                  {noOfNewmessages ? (
                    <div className='new-msg-separator'>
                      <div className='new-msg-separator-line'></div>
                      <div className='new-msg-indicator-wrapper'>
                        <div className='new-msg-indicator'>
                          {noOfNewmessages} Unread {noOfNewmessages>1 ? 'Messages' : 'Message'}
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {newMessages.map((msg)=>(
                    <div  key={msg._id} ref={scrollRef}>
                      <Message
                        userId={user?._id}
                        message={msg}
                        setMessages={setMessages}
                        my={msg?.sender === user?._id}
                        dp1={user?.profilePicture}
                        dp2={dp2}
                        setIsReply={setIsReply}
                        setReplyFor={setReplyFor}
                      />
                    </div>
                  ))}
                </div>
                <div className="input-chat-area">
                  <div className='input-chat'>
                    {isReply ? (
                      <div className='reply-message-div'>
                        <div className='reply-message'>
                          <img className='reply-message-img' src={DP} alt="" />
                          <span className='reply-message-text'>{text}</span>
                          {replyFor?.media?.length ? (
                            <img className='reply-message-img-right' src={replyFor?.media} alt="" />
                          ) : null}
                          <i class="fa-solid fa-xmark reply-message-cancel" onClick={()=>{setIsReply(false); setReplyFor({})}}></i>
                        </div>
                      </div>
                    ) : null}

                    {preview?.length>0 ? (
                      <div className='media-div'>
                        <div className='reply-message'>
                          {preview.map((media, index)=>(
                            <PreviewMedia
                              key={index}
                              index={index}
                              media={media}
                              setPreview={setPreview}
                              file={file}
                              setFile={setFile}
                              setXYZ={setXYZ}
                            />
                          ))}
                        </div>
                      </div>
                    ) : null}

                    {!file?.length || !preview.length ? (
                      <textarea
                        className='type-message'
                        onChange={(e) => setNewMessage(e.target.value)}
                        value={newMessage}
                        placeholder='Type your message here...'
                        ref={inputRef}
                        style={{borderRadius: isReply ? '' : '8px'}}
                      ></textarea>
                    ) : null}

                    <div className="emoji-media-div" style={{right: `${file?.length ? '16px' : '12px'}`}}>
                      {(isReply || newMessage) ? null : (
                        <label htmlFor="file">
                          <i className="fa-solid fa-photo-film icon"></i>
                          <input style={{display:"none"}} type="file" id="file" name="file" accept='.jpg, .png, .jpeg, .mp4, .MOV' onChange={file?.length!==9 && fileHandler}/>
                        </label>
                      )}
                      {!file?.length || !preview.length ? (
                        <div className="emoji-div">
                          <i className="fa-regular fa-face-laugh icon" onClick={()=>{setShowEmojis(!showEmojis)}}></i>
                        </div>
                      ): null}
                    </div>
                  </div>

                  <div className="message-send-icon">
                    <i className="fa-solid fa-paper-plane" onClick={submitHandler} ></i>
                  </div>
                </div>
              </>) :
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