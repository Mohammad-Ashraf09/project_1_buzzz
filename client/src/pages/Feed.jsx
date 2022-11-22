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
  const {user} = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(()=>{
    const fetchPosts = async() =>{
      const res = await axios.get("posts/timeline/"+user._id);
      setPosts(res.data.sort((post1, post2)=>{
        return new Date(post2.createdAt) - new Date(post1.createdAt);
      }));
    }
    fetchPosts();
  },[user._id]);

  useEffect(()=>{
    setSocket(io("ws://localhost:8100"));
  },[]);

  useEffect(()=>{
    socket?.emit("addUser1", user._id);
  },[socket, user._id])

  //console.log(socket);

  return (
    <>
      <Topbar socket={socket} />
      <div className="feed-container">
        <div className="leftbar">
          <SmallProfile/>
          <Utility/>
        </div>
        <div className="timeline">
          <CreateNewPost/>
          {/* create 1 new component of name Posts.jsx and call it inside Timeline.jsx and implement map there and only pass here <Timeline socket={socket} /> */}
          <div className="timeline-post-area">
            {posts.map((post)=>(
              <Timeline
                key={post._id}
                post={post}
                isLik={post.likes.includes(user._id)}
                isDisLik={post.dislikes.includes(user._id)}
                socket={socket}
              />
            ))}
          </div>
        </div>
        <div className="rightbar">
          <Contact socket={socket} />
          <Suggestion socket={socket} />
        </div>
      </div>
      <Bottombar/>
    </>
  )
}

export default Feed