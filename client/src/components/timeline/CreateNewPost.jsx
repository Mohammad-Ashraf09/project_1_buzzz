import axios from 'axios';
import React, { useContext, useEffect, useState, createRef } from 'react';
import { AuthContext } from '../../context/AuthContext';
import Location from '../Location';
import { locationsList } from '../../locationList';
import FriendList from '../FriendList';
import TaggedFriend from '../TaggedFriend';
import EmojiContainer from '../emoji/EmojiContainer';
import PreviewImage from '../PreviewImage';

const CreateNewPost = () => {
  const [file, setFile] = useState([]);
  const [preview, setPreview] = useState([]);
  const {user:currentUser} = useContext(AuthContext);
  const [user, setUser] = useState({});
  const inputRef = createRef();
  const [message, setMessage] = useState("");
  const [showEmojis, setShowEmojis] = useState(false);
  const [cursorPosition, setCursorPosition] = useState();
  const [showLocations, setShowLocations] = useState(false);
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [showLocationPostContainer, setShowLocationPostContainer] = useState(false)
  const [following, setFollowing] = useState([]);
  const [showFriendList, setShowFriendList] = useState(false);
  const [taggedFriends, setTaggedFriends] = useState([]);
  const [showTaggedFriendsPostContainer, setShowTaggedFriendsPostContainer] = useState(false);
  const [xyz, setXYZ] = useState(false);

  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const profile = user?.profilePicture ? PF+user.profilePicture : PF+"default-dp.png";
  const name = user?.fname;

  useEffect(()=>{
    const fetchUser = async() =>{
      const res = await axios.get(`/users/${currentUser._id}`);
      setUser(res.data);
    }
    fetchUser();
  },[currentUser._id]);

  useEffect(()=>{
    const fetchFollowings = async() =>{
      const res = await axios.get("users/"+currentUser._id);
      setFollowing(res.data.followings);
    }
    fetchFollowings();
  },[currentUser._id]);

  useEffect(()=>{              // this useEffect is for preview the file before uploading it
    if(file?.[0] && xyz){
      const len = preview.length
      const objectUrl = URL.createObjectURL(file?.[len])
      setPreview((prev)=>[...prev, objectUrl])
      // return () => URL.revokeObjectURL(objectUrl)   // free memory when ever this component is unmounted
    }
  },[file]);

  const handleChange = (e)=>{
    setMessage(e.target.value);
  }

  const submitHandler = async(e) =>{
    e.preventDefault();
    if(message || file){
      const newPost = {
        userId: currentUser._id,
        desc: message,
        img: [],
        location: showLocationPostContainer ? location : "",
        taggedFriends: showTaggedFriendsPostContainer ? taggedFriends : [],
      }

      if(file.length){
        file.map((image)=>{
          const uploadFile = async() =>{
            const data = new FormData();
            const fileName = Date.now() + image.name;
            data.append("name", fileName)
            data.append("file", image)
            newPost.img.push(fileName);
            try{
              await axios.post("/upload", data)        // to upload photo into local storage
            }catch(err){
              console.log(err)
            }
          }
          uploadFile();
        })
      }
  
      try{
        await axios.post("/posts", newPost)         // to post the desc and file name to database
        window.location.reload();
      }
      catch(err){}
  
      try{
        await axios.put("users/"+currentUser._id, {userId: currentUser._id, totalPosts: user.totalPosts+1});    // to update the total post count by 1
      }
      catch(err){}
    }
  }

  const fileHandler = (e) =>{
    if(e.target.files[0]){
      setXYZ(true);
      setFile((prev)=>[...prev, e.target.files[0]]);
    }
  }

  return (
    <>
      <form className='timeline-search' onSubmit={submitHandler}>
        <div className="timeline-search-wrapper">
          <img className='post-user-img' src={profile} alt="" />
          <textarea type="text" className="post-input" placeholder={"Hello " + name + ", Start a post..."} value={message} onChange={handleChange} ref={inputRef} />
          <div className="y">

            <label htmlFor="file">
              <i className="fa-solid fa-photo-film"></i>
              <input style={{display:"none"}} type="file" id="file" name="file" accept='.jpg, .png, .jpeg, .mp4, .MOV' onChange={file.length!==10 && fileHandler}/>
            </label>
            <i class="fa-regular fa-face-laugh" onClick={()=>{setShowEmojis(!showEmojis); setShowLocations(false); setShowFriendList(false)}}></i>
            <i class="fa-solid fa-tags" onClick={()=>{setShowFriendList(!showFriendList); setShowEmojis(false); setShowLocations(false)}}></i>
            <i class="fa-solid fa-location-dot" onClick={()=>{setShowLocations(!showLocations); setShowFriendList(false); setShowEmojis(false)}}></i>

            <div className="btn">
              <button type="submit">Post</button>
            </div>
          </div>
        </div>

        {showLocationPostContainer && <div className='location-post-container'>
          <i class="fa-solid fa-location-dot location-post-icon"></i>
          <div className='location-post-name'>{location}</div>
          <div className='location-post-cross'><i class="fa-solid fa-xmark" onClick={()=>{setShowLocationPostContainer(false)}}></i></div>
        </div>}

        {showTaggedFriendsPostContainer &&
          <div className='location-post-container'>
              {taggedFriends.map((friend)=>(
                <TaggedFriend
                  key={Math.random()}
                  friend={friend}
                  setTaggedFriends={setTaggedFriends}
                  setShowTaggedFriendsPostContainer={setShowTaggedFriendsPostContainer}
                  taggedFriends={taggedFriends}
                />
              ))}
          </div>
        }

        {preview.length>0 && <div className='preview'>
          <PreviewImage preview={preview} setPreview={setPreview} file={file} setFile={setFile} setXYZ={setXYZ}/>
        </div>}
      </form>

      {showEmojis &&
        <EmojiContainer
          inputRef={inputRef}
          setMessage={setMessage}
          message={message}
          setCursorPosition={setCursorPosition}
          cursorPosition={cursorPosition}
        />
      }

      {showLocations && <div className='location-div'>
        <div className='location-search-filter'>
          <input type="text" className='location-search-input' name="" placeholder='Search Location' onChange={(e)=>setQuery(e.target.value)} />
        </div>
        <ul className="locations-list">
          {locationsList.sort().filter((x)=>x.toLowerCase().includes(query)).map((location)=>(
            <Location
              key={location}
              location={location}
              setShowLocations={setShowLocations}
              setLocation={setLocation}
              setShowLocationPostContainer={setShowLocationPostContainer}
              setQuery={setQuery}
            />
          ))}
        </ul>
      </div>}

      {showFriendList && <div className="friend-list-container">
        <div className='location-search-filter'>
            <input type="text" className='location-search-input' name="" placeholder='Search Friend' onChange={(e)=>setQuery(e.target.value)} />
        </div>
        <ul className="friend-list">
            {following.filter((data)=>data.name.toLowerCase().includes(query)).map((friend)=>(
                <FriendList
                  key={friend.id}
                  friend={friend}
                  setShowFriendList={setShowFriendList}
                  setTaggedFriends={setTaggedFriends}
                  setShowTaggedFriendsPostContainer={setShowTaggedFriendsPostContainer}
                  setQuery={setQuery}
                />
            ))}
        </ul>
      </div>}

    </>
  )
}

export default CreateNewPost;
