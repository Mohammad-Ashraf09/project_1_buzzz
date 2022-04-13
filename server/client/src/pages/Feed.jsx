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


const Feed = () => {

  const [posts, setPosts] = useState([]);
  const {user} = useContext(AuthContext)

  useEffect(()=>{
    const fetchPosts = async() =>{
      const res = await axios.get("posts/timeline/"+user._id);
      setPosts(res.data);
      //console.log(res.data)
    }
    fetchPosts();
  },[user._id]);

  return (
    <>
      <Topbar/>
      <div className="feed-container">
        <div className="leftbar">
          <SmallProfile/>
          <Utility/>
        </div>
        <div className="timeline">
          <SearchBox/>
          <div className="timeline-post-area">
            {posts.map((data)=>(
              <Timeline key={data._id} post={data}/>
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