import axios from 'axios';
import React, { useContext, useEffect, useState, createRef } from 'react';
import { AuthContext } from '../../context/AuthContext';
import Location from '../Location';
import { locationsList } from '../../locationList';
import FriendList from '../FriendList';
import TaggedFriend from '../TaggedFriend';
import EmojiContainer from '../emoji/EmojiContainer';
import PreviewImage from '../PreviewImage';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase";
import ProgressBar from "@ramonak/react-progress-bar";
import Compressor from 'compressorjs';

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
  const [imgRef, setImgRef] = useState([]);
  const [imgURL, setImgURL] = useState([]);
  const [percentage, setPercentage] = useState(null);

  const profile = user?.profilePicture?.includes('https://') ? user?.profilePicture : `/assets/${user.profilePicture}`;
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
    if(file?.length && xyz){
      const len = preview?.length
      const objectUrl = URL.createObjectURL(file?.[len])
      setPreview((prev)=>[...prev, objectUrl])
      // return () => URL.revokeObjectURL(objectUrl)   // free memory when ever this component is unmounted

      if(file?.[len].type === "image/jpeg"){
        new Compressor(file?.[len], {
          quality: 0.4, // 0.6 can also be used, but its not recommended to go below.
          success: (compressedResult) => {
            const imgName = compressedResult?.name?.toLowerCase()?.split(' ').join('-');
            const uniqueImageName = new Date().getTime() + '-' + imgName;
  
            const storageRef = ref(storage, uniqueImageName);
            setImgRef((prev)=> [...prev, storageRef]);
            const uploadTask = uploadBytesResumable(storageRef, compressedResult);
  
            uploadTask.on('state_changed', (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setPercentage(progress);
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
      else {
        const imgName = file?.[len]?.name?.toLowerCase()?.split(' ').join('-');
        const uniqueImageName = new Date().getTime() + '-' + imgName;

        const storageRef = ref(storage, uniqueImageName);
        setImgRef((prev)=> [...prev, storageRef]);
        const uploadTask = uploadBytesResumable(storageRef, file?.[len]);

        uploadTask.on('state_changed', (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setPercentage(progress);
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
    }
  },[file?.length]);

  const handleChange = (e)=>{
    setMessage(e.target.value);
  }

  const submitHandler = async(e) =>{
    e.preventDefault();
    if(message || file.length){
      const newPost = {
        userId: currentUser._id,
        desc: message,
        img: imgURL,
        location: showLocationPostContainer ? location : "",
        taggedFriends: showTaggedFriendsPostContainer ? taggedFriends : [],
      }

      try{
        await axios.post("/posts", newPost)         // to post the desc and file name to database
        window.location.reload();
      }
      catch(err){}
  
      try{
        await axios.put("/users/"+currentUser._id, {userId: currentUser._id, totalPosts: user?.totalPosts+1});    // to update the total post count by 1
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

  if(percentage === 100){
    setPercentage(null);
  }

  return (
    <>
      <form className='create-post' onSubmit={submitHandler}>
        <div className="create-post-wrapper">
          <img className='user-rectangular-image' src={profile} alt="" />
          <textarea type="text" className="post-input" placeholder={"Hello " + name + ", start a post..."} value={message} onChange={handleChange} ref={inputRef} />
          <div className="textarea-functionality">

            <div className='textarea-functionality-icons'>
              <label htmlFor="file">
                <i className="fa-solid fa-photo-film"></i>
                <input style={{display:"none"}} type="file" id="file" name="file" accept='.jpg, .png, .jpeg, .mp4, .MOV' onChange={file.length!==10 && fileHandler}/>
              </label>
              <div className='create-post-emoji-icon'>
                <i class="fa-regular fa-face-laugh" onClick={()=>{setShowEmojis(!showEmojis); setShowLocations(false); setShowFriendList(false)}}></i>
              </div>
              <i class="fa-solid fa-tags" onClick={()=>{setShowFriendList(!showFriendList); setShowEmojis(false); setShowLocations(false)}}></i>
              <i class="fa-solid fa-location-dot" onClick={()=>{setShowLocations(!showLocations); setShowFriendList(false); setShowEmojis(false)}}></i>
            </div>

            <div className="btn">
              <button type="submit" disabled={(percentage !== null && percentage !== 100) ? true : false}>Post</button>
            </div>
          </div>
        </div>

        {showLocationPostContainer ? (
          <div className='selected-post-location tagged-item'>
            <i class="fa-solid fa-location-dot selected-post-location-icon tagged-item-icon"></i>
            <div className='selected-post-location-name tagged-item-name'>{location}</div>
            <div className='selected-post-location-cancel tagged-item-cancel'><i class="fa-solid fa-xmark" onClick={()=>{setShowLocationPostContainer(false)}}></i></div>
          </div>
        ) : null}

        {showTaggedFriendsPostContainer ? (
          <div className='selected-tagged-friends tagged-item'>
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
        ) : null}

        {percentage ? (
          <ProgressBar
            completed={percentage}
            maxCompleted={100}
            bgColor={'#03bfbc'}
            isLabelVisible={false}
            // labelColor={'#000'}
            height={'5px'}
            margin={'8px 0 0 0'}
            // width={'100%'}
          />
        ) : null}

        {preview.length ? (
          <div className='post-media-preview-container'>
            <PreviewImage
              preview={preview}
              setPreview={setPreview}
              file={file}
              setFile={setFile}
              setXYZ={setXYZ}
              imgURL={imgURL}
              setImgURL={setImgURL}
              imgRef={imgRef}
              setImgRef={setImgRef}
              percentage={percentage}
            />
          </div>
        ) : null }

      </form>

      {showEmojis ? (
        <EmojiContainer
          inputRef={inputRef}
          setMessage={setMessage}
          message={message}
          setCursorPosition={setCursorPosition}
          cursorPosition={cursorPosition}
        />
      ) : null}

      {showLocations ? (
        <div className='location-list-container'>
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
        </div>
      ) : null}

      {showFriendList ? (
        <div className="friend-list-container">
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
        </div>
      ) : null}

    </>
  )
}

export default CreateNewPost;
