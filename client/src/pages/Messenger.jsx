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
import ReactPlayer from 'react-player';
import Bottombar from '../components/Bottombar';
import { Link } from 'react-router-dom';

const Messenger = () => {
  const {user:currentUser} = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const scrollRef = useRef();
  const [following, setFollowing] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [query1, setQuery1] = useState("");
  const [query2, setQuery2] = useState("");
  const [isReply, setIsReply] = useState(false);
  const [replyFor, setReplyFor] = useState({});
  const [showEmojis, setShowEmojis] = useState(false);
  const inputRef = createRef();
  const [cursorPosition, setCursorPosition] = useState();
  const [file, setFile] = useState([]);
  const [xyz, setXYZ] = useState(false);
  const [preview, setPreview] = useState([]);
  const [socket, setSocket] = useState(null);
  const [rawNotificationsOfCurrentUser, setRawNotificationsOfCurrentUser] = useState([]);
  const [processedNotificationsOfCurrentUser, setProcessedNotificationsOfCurrentUser] = useState([]);
  const [noOfNewmessages, setNoOfNewmessages] = useState(0);
  const [isChatInOpenState, setIsChatInOpenState] = useState('');
  const [imgURL, setImgURL] = useState([]);
  const [sendMessageOnlyWithText, setSendMessageOnlyWithText] = useState(false);
  const [sendingFileInProgress, setSendingFileInProgress] = useState(false);
  const [lastPreviewMediaUrl, setLastPreviewMediaUrl] = useState('');

  const [isChats, setIsChats] = useState(true);
  const [isContacts, setIsContacts] = useState(false);
  // const [isNewMsg, setIsNewMsg] = useState(false);                           // apply it mobile view

  const oldMessages = messages.slice(0, messages?.length-noOfNewmessages);
  const newMessages = messages.slice(messages?.length-noOfNewmessages, messages?.length);

  useEffect(()=>{
    setSocket(io("ws://localhost:8100"));

    const fetchUser = async() =>{
      const res = await axios.get(`/users/${currentUser._id}`);
      setUser(res.data);
    }
    fetchUser();
  },[]);

  useEffect(()=>{
    socket?.emit("addUser2", currentUser._id);
  },[socket, currentUser._id]);

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
      setProcessedNotificationsOfCurrentUser((prev)=>[...prev, data]);
    });

    socket?.on("getChatInOpenState", (data)=>{
      setIsChatInOpenState(data?.isChatInOpenState);
    });
  },[socket]);

  useEffect(()=>{
    if(processedNotificationsOfCurrentUser.length===0){
      rawNotificationsOfCurrentUser?.map((item)=>{
        item.notifications.map((id)=>{
          setProcessedNotificationsOfCurrentUser((prev)=>[...prev, item.id]);
        })
      })
    }
  },[rawNotificationsOfCurrentUser]);

  useEffect(()=>{
    arrivalMessage && currentChat?.IDs.includes(arrivalMessage.sender) && setMessages((prev)=> [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);
  
  useEffect(()=>{
    const getConversations = async()=>{
      try{
        const res = await axios.get("/conversations/"+currentUser._id);  // logged in user ke jitne bhi conversations hai sab return karega

        const conver = await Promise.all(res?.data?.map((item)=>{
          const fetchUserDataOfConversationList = async()=>{
            try{
              const response = await axios.get(`/users/${item?.IDs[0] !== currentUser._id ? item?.IDs[0] : item?.IDs[1]}`);
              const obj = {
                ...item,
                otherMemberData: {
                  id: response?.data?._id,
                  dp: response?.data?.profilePicture?.includes('https://') ? response?.data?.profilePicture : `/assets/${response?.data?.profilePicture}`,
                  name: response?.data?.fname + ' ' + response?.data?.lname,
                  username: response?.data?.username,
                },
              };
              return obj;
            }catch(err){
              console.log(err);
            }
          }
          return fetchUserDataOfConversationList();
        }))
        setConversations(conver);
      }
      catch(err){
        console.log(err);
      }
    }
    getConversations();

    const getNotifications = async()=>{
      try{
        const res = await axios.get("/messages/noOfNotifications/"+currentUser._id);
        setRawNotificationsOfCurrentUser(res.data.receiverId)
      }
      catch(err){
        console.log(err);
      }
    }
    getNotifications();
  },[currentUser._id, currentChat]);

  useEffect(()=>{
    const getMessages = async() =>{
      if(currentChat){
        try{
          const res = await axios.get("/messages/"+currentChat?._id)
          setMessages(res.data);
        }catch(err){
          console.log(err);
        }
      }
    };
    getMessages();
  },[currentChat]);

  useEffect(()=>{
    scrollRef.current?.scrollIntoView({behavior: "smooth"});
  },[messages]);

  useEffect(()=>{
    const fetchFollowings = async() =>{
      const res = await axios.get("users/"+currentUser._id);
      const arr = res.data.followings                    // array of objects de raha hai ye
      setFollowing(arr);
    }
    fetchFollowings();
  },[currentUser._id]);

  useEffect(()=>{              // this useEffect is for preview the file before uploading it
    if(file?.length && xyz){
      const len = preview?.length
      const fileType = file?.[len].name.includes('.mp4') || file?.[len].name.includes('.MOV')
      const objectUrl = URL.createObjectURL(file?.[len])

      setPreview((prev)=>[...prev, {url: objectUrl, isVideo: fileType}])
      // return () => URL.revokeObjectURL(objectUrl)   // free memory when ever this component is unmounted
    }
  },[file?.length]);

  useEffect(()=>{
    const isOnlinePresent = onlineUsers.filter((user)=>
      user.userId === (currentChat?.IDs[0]!==user._id ? currentChat?.IDs[0] : currentChat?.IDs[1]));
    if(isOnlinePresent.length){
      socket?.emit("sendChatInOpenState", {
        senderId: currentUser._id,
        isChatInOpenState: currentChat?.otherMemberData?.id!==user?._id ? currentChat?.otherMemberData?.id : '',
        receiverId: currentChat?.IDs[0]!==currentUser?._id
          ? currentChat?.IDs[0]
          : currentChat?.IDs[1]
      }); // if a user open his chat area then send other user by socket that i have opened my chat area and please dont increase notification count in database
    }
  },[messages, currentChat]);

  const removeNotificationFromDatabase = async(id) => {
    try{
      await axios.put("/messages/noOfNotifications/"+currentUser._id, {friendId: id});
    }
    catch(err){
      console.log(err);
    }
  }

  const notificationHandler = async() => {
    const isOnlinePresent = onlineUsers.filter((user)=>
      user.userId === (currentChat?.IDs[0]!==user._id ? currentChat?.IDs[0] : currentChat?.IDs[1]));
    if(isOnlinePresent.length){
      socket.emit("sendMessageNotification", {
        senderId: currentUser._id,
        receiverId: currentChat.IDs[0]!==currentUser._id
          ? currentChat.IDs[0]
          : currentChat.IDs[1]
      });     // if user is online then directly show them notification without changing in database
    }

    if(isChatInOpenState !== currentUser._id){
      const increaseCountInDatabase = async()=>{
        try{
          await axios.put("/messages/noOfNotifications/", {
              user1: currentUser._id,
              user2: currentChat?.IDs[0]!==currentUser._id
                ? currentChat?.IDs[0]
                : currentChat?.IDs[1]
          });  // if user is online but his chat area is not in open state then increase count in database
        }
        catch(err){}
      }
      increaseCountInDatabase();
    }
    setIsChatInOpenState('');
  }

  const submitHandler = async(e)=>{
    e.preventDefault();

    if(file?.length){
      const message={
        sender: currentUser._id,
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
                    setImgURL((prev)=> [...prev, {url: downloadURL, isVideo: false}])
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
                setImgURL((prev)=> [...prev, {url: downloadURL, isVideo: true}])
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

  useEffect(()=>{   // this useEffect is real submitHandler (sending to database)
    if((imgURL?.length === file?.length) && imgURL?.length){
      const saveMediaLinkToDatabaseWithEmptyText = async() => {
        const message={
          sender: currentUser._id,
          text: "",
          media: imgURL,
          conversationId: currentChat._id,
          replyForId: "",
          replyForText: "",
          replyForImage: "",
          isSameDp: replyFor.isSameDp,
        };

        try{
          const res = await axios.post("/messages", message);
          setMessages([...(messages.slice(0, -1)), res.data]);     // removing the preview media message first then adding the last message from database
          setNoOfNewmessages(0)
          notificationHandler();
        }catch(err){
          console.log(err);
        }

        const isOnlinePresent = onlineUsers.filter((user)=>
          user.userId === (currentChat?.IDs[0]!==user._id ? currentChat?.IDs[0] : currentChat?.IDs[1]));
        if(isOnlinePresent?.length){
          socket?.emit("sendMessage",{
            ...message,
            receiver: currentChat?.IDs[0]!==currentUser._id ? currentChat?.IDs[0] : currentChat?.IDs[1],
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
        setSendingFileInProgress(false);
      }
      saveMediaLinkToDatabaseWithEmptyText();
    }
    if(sendMessageOnlyWithText){
      const saveTextMsgToDatabase = async() => {
        const message={
          sender: currentUser._id,
          text: newMessage,
          media: imgURL,
          conversationId: currentChat._id,
          replyForId: replyFor.id ? replyFor.id : "",
          replyForText: replyFor.text ? replyFor.text : "",
          replyForImage: replyFor.media ? replyFor.media : null,
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

        const isOnlinePresent = onlineUsers.filter((user)=>
          user.userId === (currentChat?.IDs[0]!==user._id ? currentChat?.IDs[0] : currentChat?.IDs[1]));
        if(isOnlinePresent?.length){
          socket?.emit("sendMessage",{
            ...message,
            receiver: currentChat?.IDs[0]!==currentUser._id ? currentChat?.IDs[0] : currentChat?.IDs[1],
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
    const confirm = (currentChat && messages?.length) ? window.confirm('Are You Sure, want to clear chat') : null;
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

  const DP = replyFor?.isSameDp? (user?.profilePicture?.includes('https://') ? user?.profilePicture : `/assets/${user.profilePicture}`) : currentChat?.otherMemberData?.dp;
  const text = replyFor?.text;

  return (
    <>
      <Topbar user={user}/>
      {window.innerWidth<=420 ?
        <>
          {currentChat ?
            <div className='messenger'>
              <div className="messenger-center">
                <div className="messenger-center-wrapper">

                  {/* chat area topbar */}
                  <div className='chat-area-topbar'>
                    <div className='chat-area-topbar-left'>
                      <div className='move-back-icon' onClick={()=>setCurrentChat(null)}> <i class="fa-solid fa-arrow-left"></i> </div>
                      <Link to={``} style={{textDecoration: 'none', color:'black'}}>
                        <div className='chat-area-topbar-name-and-dp'>
                          <img className='chat-area-topbar-dp' src={currentChat?.otherMemberData?.dp} alt="" />
                          <div>
                            <p className='chat-area-topbar-name'>{currentChat?.otherMemberData?.name}</p>
                            <p className='chat-area-topbar-username'>{currentChat?.otherMemberData?.username}</p>
                          </div>
                        </div>
                      </Link>
                    </div>
                    <div className='clear-chat-icon' onClick={clearChatHandler}> <i className="fa-solid fa-trash "></i> </div>
                    <div className='clear-chat-text'>clear chat</div>
                  </div>

                  {/* chat area view msg */}
                  <div
                    className="chat-view-area"
                    style={{
                      height: (isReply || preview?.length>0) ? (isReply ? 'calc(84% - 47px)' : 'calc(86% - 12px)') : '86%'
                    }}
                  >
                    {oldMessages.map((msg)=>(
                      <div  key={msg._id} ref={scrollRef}>
                        <Message
                          userId={currentUser?._id}
                          message={msg}
                          setMessages={setMessages}
                          my={msg?.sender === currentUser?._id}
                          dp1={user?.profilePicture?.includes('https://') ? user?.profilePicture : `/assets/${user?.profilePicture}`}
                          dp2={currentChat?.otherMemberData?.dp}
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
                          userId={currentUser?._id}
                          message={msg}
                          setMessages={setMessages}
                          my={msg?.sender === currentUser?._id}
                          dp1={user?.profilePicture?.includes('https://') ? user?.profilePicture : `/assets/${user?.profilePicture}`}
                          dp2={currentChat?.otherMemberData?.dp}
                          setIsReply={setIsReply}
                          setReplyFor={setReplyFor}
                        />
                      </div>
                    ))}
                  </div>

                  {/* chat area input */}
                  <div className="input-chat-area">
                    <div className='input-chat'>
                      {isReply ? (
                        <div className='reply-message-div'>
                          <div className='reply-message'>
                            <img className='reply-message-img' src={DP} alt="" />
                            <span className='reply-message-text'>{text}</span>
                            {replyFor?.media ? (
                              (replyFor?.media?.isVideo) ?
                                <div className='reply-message-img-right'>
                                  <ReactPlayer
                                    url={replyFor?.media?.url}
                                    muted={true}
                                    playing={false}
                                    height='100%'
                                    width="66px"
                                    className='video'
                                  />
                                </div> 
                                :
                                <img className='reply-message-img-right' src={replyFor?.media?.url} alt="" />
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

                </div>
              </div>
            </div>
            :
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
                    {conversations.filter((x)=>x.otherMemberData.name?.toLowerCase().includes(query1)).map((c, index)=>(
                      <Conversation
                        key={c._id}
                        index={index}
                        conversation={c}
                        setConversations={setConversations}
                        setCurrentChat={setCurrentChat}
                        currentChat={currentChat}
                        setIsReply={setIsReply}
                        setReplyFor={setReplyFor}
                        rawNotificationsOfCurrentUser={rawNotificationsOfCurrentUser}
                        processedNotificationsOfCurrentUser={processedNotificationsOfCurrentUser}
                        setProcessedNotificationsOfCurrentUser={setProcessedNotificationsOfCurrentUser}
                        setNoOfNewmessages={setNoOfNewmessages}
                        removeNotificationFromDatabase={removeNotificationFromDatabase}
                      />
                    ))}
                  </div>
                  :
                  <div className='conversation-list-container'>
                    {following.filter((x)=>x.name.toLowerCase().includes(query2)).map((data)=>(
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
                }

              </div>
            </div>
          }
        </>
        :
        <div className='messenger'>
          <div className="messenger-left">
            <div className="messenger-left-wrapper">
              <input className='messenger-search' type="text" placeholder='Search for chat' onChange={(e)=>setQuery1(e.target.value)}/>
              <div className="conversation-div">
                {conversations.filter((x)=>x.otherMemberData.name?.toLowerCase().includes(query1)).map((c, index)=>(
                  <Conversation
                    key={c._id}
                    index={index}
                    conversation={c}
                    setConversations={setConversations}
                    setCurrentChat={setCurrentChat}
                    currentChat={currentChat}
                    setIsReply={setIsReply}
                    setReplyFor={setReplyFor}
                    rawNotificationsOfCurrentUser={rawNotificationsOfCurrentUser}
                    processedNotificationsOfCurrentUser={processedNotificationsOfCurrentUser}
                    setProcessedNotificationsOfCurrentUser={setProcessedNotificationsOfCurrentUser}
                    setNoOfNewmessages={setNoOfNewmessages}
                    removeNotificationFromDatabase={removeNotificationFromDatabase}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="messenger-center">
            <div className="messenger-center-wrapper">
              <div className='chat-area-topbar'>
                {currentChat ?
                  <>
                    <Link to={``} style={{textDecoration: 'none', color:'black'}}>
                      <div className='chat-area-topbar-left'>
                        <img className='chat-area-topbar-dp' src={currentChat?.otherMemberData?.dp} alt="" />
                        <div>
                          <p className='chat-area-topbar-name'>{currentChat?.otherMemberData?.name}</p>
                          <p className='chat-area-topbar-username'>{currentChat?.otherMemberData?.username}</p>
                        </div>
                      </div>
                    </Link>
                    <div className='clear-chat-icon' onClick={clearChatHandler}> <i className="fa-solid fa-trash "></i> </div>
                    <div className='clear-chat-text'>clear chat</div>
                  </>
                : null}
              </div>
              {currentChat ? (
                <>
                  <div
                    className="chat-view-area"
                    style={window.innerWidth<768 ? {
                      height: (isReply || preview?.length>0) ? (isReply ? 'calc(89% - 47px)' : 'calc(91% - 12px)') : '91%'
                    } : {
                      height: (isReply || preview?.length>0) ? (isReply ? 'calc(81% - 80px)' : 'calc(81% - 20px)') : '81%'
                    }}
                  >
                    {oldMessages.map((msg)=>(
                      <div  key={msg._id} ref={scrollRef}>
                        <Message
                          userId={currentUser?._id}
                          message={msg}
                          setMessages={setMessages}
                          my={msg?.sender === currentUser?._id}
                          dp1={user?.profilePicture?.includes('https://') ? user?.profilePicture : `/assets/${user?.profilePicture}`}
                          dp2={currentChat?.otherMemberData?.dp}
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
                          userId={currentUser?._id}
                          message={msg}
                          setMessages={setMessages}
                          my={msg?.sender === currentUser?._id}
                          dp1={user?.profilePicture?.includes('https://') ? user?.profilePicture : `/assets/${user?.profilePicture}`}
                          dp2={currentChat?.otherMemberData?.dp}
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
                            {replyFor?.media ? (
                              (replyFor?.media?.isVideo) ?
                                <div className='reply-message-img-right'>
                                  <ReactPlayer
                                    url={replyFor?.media?.url}
                                    muted={true}
                                    playing={false}
                                    height='100%'
                                    width="66px"
                                    className='video'
                                  />
                                </div> 
                                :
                                <img className='reply-message-img-right' src={replyFor?.media?.url} alt="" />
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
              <input className='messenger-search search-online-friend' type="text" placeholder='Search for friend' onChange={(e)=>setQuery2(e.target.value)} />
              <h3 className='online-friend-heading'>Online Friends</h3>
              <div className="online-friend-div">
                {following.filter((x)=>x.name.toLowerCase().includes(query2)).map((data)=>(
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
      }
      <Bottombar user={user}/>

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