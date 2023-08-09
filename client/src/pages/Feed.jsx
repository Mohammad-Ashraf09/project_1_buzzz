import React, { useContext, useEffect, useState } from 'react';
import Topbar from "../components/Topbar";
import SmallProfile from '../components/leftbar/SmallProfile';
import Utility from '../components/leftbar/Utility';
import Contact from '../components/rightbar/Contact';
import Suggestion from '../components/rightbar/Suggestion';
import CreateNewPost from '../components/timeline/CreateNewPost';
import Timeline from '../components/timeline/Timeline';
import Bottombar from '../components/Bottombar';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import {io} from "socket.io-client";

const Feed = () => {
  const {user:currentUser} = useContext(AuthContext);
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);
  const [socket, setSocket] = useState(null);
  // const [showPopup, setShowPopup] = useState(false);

  useEffect(()=>{
    const fetchUser = async() =>{
      const res = await axios.get(`/users/${currentUser._id}`);
      setUser(res.data);
    }
    fetchUser();
  },[currentUser._id]);

  useEffect(()=>{
    const fetchPosts = async() =>{
      const res = await axios.get("posts/timeline/"+currentUser._id);
      setPosts(res.data.sort((post1, post2)=>{
        return new Date(post2.createdAt) - new Date(post1.createdAt);
      }));
    }
    fetchPosts();
  },[currentUser._id]);

  useEffect(()=>{
    setSocket(io("ws://localhost:8100"));
  },[]);

  useEffect(()=>{
    socket?.emit("addUser1", currentUser._id);
  },[socket, currentUser._id])

  // console.log(showPopup)
  // useEffect(()=>{
  //   if(showPopup){
  //     document.body.style.overflow = "hidden";
  //     document.body.scrollIntoView();
  //   }
  // },[showPopup]);

  return (
    <>
      <Topbar user={user} socket={socket}
      // setShowPopup={setShowPopup}
      />
      <div className="feed-container">
        <div className="leftbar">
          <SmallProfile user={user}/>
          <Utility/>
        </div>
        <div className="timeline">
          <CreateNewPost currentUser={user}/>
          {/* create 1 new component of name Posts.jsx and call it inside Timeline.jsx and implement map there and only pass here <Timeline socket={socket} /> */}
          <div className="timeline-post-area">
            {posts.map((post)=>(
              <Timeline
                key={post._id}
                currentUser={user}
                post={post}
                setPosts={setPosts}
                isLik={post.likes.includes(currentUser._id)}
                isDisLik={post.dislikes.includes(currentUser._id)}
                socket={socket}
              />
            ))}
          </div>
        </div>
        <div className="rightbar">
          <Contact user={currentUser} socket={socket}/>
          <Suggestion socket={socket}/>
        </div>

        {/* {showPopup && <div className='popup-blurr-div'>
          <div className="popup-container">
            <div className='close-popup-div'>
              <div className="close-popup-icon" onClick={()=> {setShowPopup(false); document.body.style.overflow = "auto"}}>
                  <i class="fa-solid fa-xmark close"></i>
              </div>
            </div>
          </div>
        </div>} */}

      </div>
      <Bottombar user={user}/>
    </>
  )
}

export default Feed