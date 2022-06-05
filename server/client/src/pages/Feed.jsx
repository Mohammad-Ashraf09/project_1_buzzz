import React, { useContext, useEffect, useState } from 'react';
import Topbar from "../components/Topbar";
import SmallProfile from '../components/leftbar/SmallProfile';
import Utility from '../components/leftbar/Utility';
import Contact from '../components/rightbar/Contact';
import Suggestion from '../components/rightbar/Suggestion';
import SearchBox from '../components/timeline/SearchBox';
import Timeline from '../components/timeline/Timeline';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import {io} from "socket.io-client";


const Feed = () => {

  const [posts, setPosts] = useState([]);
  const [socket, setSocket] = useState(null);
  const {user} = useContext(AuthContext);

  useEffect(()=>{
    const fetchPosts = async() =>{
      const res = await axios.get("posts/timeline/"+user._id);
      setPosts(res.data.sort((post1, post2)=>{
        return new Date(post2.createdAt) - new Date(post1.createdAt);
      }));
      //console.log(res.data)
    }
    fetchPosts();
  },[user._id]);

  useEffect(()=>{
    setSocket(io("ws://localhost:8100"));
    //console.log(socket);
  },[]);

  useEffect(()=>{
    socket?.emit("addUser2", user._id);
  },[socket, user._id])

  //console.log(socket);

  return (
    <>
      <Topbar socket={socket} firstName={user.fname} lastName={user.lname} avatar={user.profilePicture}/>
      <div className="feed-container">
        <div className="leftbar">
          <SmallProfile/>
          <Utility/>
        </div>
        <div className="timeline">
          <SearchBox/>
          <div className="timeline-post-area">
            {posts.map((data)=>(
              <Timeline key={data._id} post={data} socket={socket} />
            ))}
          </div>
        </div>
        <div className="rightbar">
          <Contact/>
          <Suggestion/>
        </div>
      </div>
    </>
  )
}

export default Feed