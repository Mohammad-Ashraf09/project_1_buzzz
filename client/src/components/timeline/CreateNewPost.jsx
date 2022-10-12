import axios from 'axios';
import React, { useContext, useEffect, useRef, useState, createRef } from 'react';
import { AuthContext } from '../../context/AuthContext';
import EmojiInput from "../EmojiInput";
import { EmojiStyle, SkinTones, Theme, Categories, EmojiClickData, Emoji, SuggestionMode } from "emoji-picker-react";


const CreateNewPost = () => {

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState()
  const {user} = useContext(AuthContext);
  // const desc = useRef();
  const inputRef = createRef();
  const [message, setMessage] = useState("");
  const [showEmojis, setShowEmojis] = useState(false);
  const [cursorPosition, setCursorPosition] = useState();
  const [selectedEmoji, setSelectedEmoji] = useState("");
  // const [emojiList, setEmojiList] = useState([]);

  const handleChange = (e)=>{
    setMessage(e.target.value);
  }
  
  const onClick = (emojiData: EmojiClickData) => {
    setSelectedEmoji(emojiData.unified);
    
    const ref = inputRef.current;
    ref.focus();
    const start = message.substring(0, ref.selectionStart);
    const end = message.substring(ref.selectionStart);
    const text = start + emojiData.emoji + end;
    setMessage(text);
    setCursorPosition(start.length + emojiData.emoji.length);
  }
  
  useEffect(()=>{
    inputRef.current.selectionEnd = cursorPosition;
  }, [cursorPosition]);


  // useEffect(()=>{
  //     setEmojiList(prev => [...prev, selectedEmoji]);
  // },[selectedEmoji]);

  useEffect(()=>{              // this useEffect is for preview the file before uploading it
    if(!file){
        setPreview(undefined)
        return
    }
    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)   // free memory when ever this component is unmounted

  },[file]);

  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const profile = user.profilePicture ? PF + user.profilePicture : PF + "default-dp.png";
  const name = user.fname;

  const submitHandler = async(e) =>{
    e.preventDefault();
    if(message || file){
      const newPost = {
        userId: user._id,
        desc: message,
      }
      if(file){
        const data = new FormData();
        const fileName = Date.now() + file.name;
        data.append("name", fileName)
        data.append("file", file)
        newPost.img = fileName;
        try{
          await axios.post("/upload", data)        // to upload photo into local storage
        }catch(err){
          console.log(err)
        }
      }
  
      try{
        await axios.post("/posts", newPost)         // to post the desc and file name to database
        window.location.reload();
      }
      catch(err){}
  
      try{
        await axios.put("users/"+user._id, {userId: user._id, totalPosts: user.totalPosts+1});    // to update the total post count by 1
      }
      catch(err){}
    }
  }

  return (
    <>
      <form className='timeline-search' onSubmit={submitHandler}>
        <div className="timeline-search-wrapper">
          <img className='post-user-img' src={profile} alt="" />
          {/* <textarea type="text" className="post-input" placeholder={"Hello " + name + ", Start a post..."} ref={desc} /> */}
          <textarea type="text" className="post-input" placeholder={"Hello " + name + ", Start a post..."} value={message} onChange={handleChange} ref={inputRef} />
          <div className="y">

            <label htmlFor="file">
              <i className="fa-solid fa-photo-film"></i>
              <input style={{display:"none"}} type="file" id="file" name="file" accept='.jpg, .png, .jpeg' onChange={(e)=>setFile(e.target.files[0])}/>
            </label>
            <i class="fa-regular fa-face-laugh" onClick={()=>{setShowEmojis(!showEmojis)}}></i>
            <i class="fa-solid fa-tags"></i>
            <i class="fa-solid fa-location-dot"></i>

            <div className="btn">
              <button type="submit">Post</button>
            </div>
          </div>
        </div>
        <div className="share-img-container">
          {file && <img className="share-img" src={preview} alt="" />}
          {file && <i class="fa-solid fa-square-xmark" onClick={()=>setFile(null)} ></i>}
        </div>
      </form>

      {/*------------------------------------------------------------------------------------------------- 
        <h2>Emoji Picker React 4 Demo</h2>
        <div className="show-emoji">
            Your selected Emoji is:
            {emojiList.map((emoji)=>(
                <Emoji unified={emoji} emojiStyle={EmojiStyle.APPLE} size={22} />
            ))}

        </div> */}
      <div className='emoji-container'>
        {showEmojis ? <EmojiInput onClick={onClick} selectedEmoji={selectedEmoji}/> : null}
      </div>
    </>
  )
}

export default CreateNewPost