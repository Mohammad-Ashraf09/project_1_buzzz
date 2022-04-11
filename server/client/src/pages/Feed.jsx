import React, { useEffect, useState } from 'react';
import Topbar from "../components/Topbar";
import SmallProfile from '../components/leftbar/SmallProfile';
import Utility from '../components/leftbar/Utility';
import Contact from '../components/rightbar/Contact';
import Suggestion from '../components/rightbar/Suggestion';
import SearchBox from '../components/timeline/SearchBox';
import Timeline from '../components/timeline/Timeline';
import axios from 'axios';


const Feed = () => {

  const [posts, setPosts] = useState([]);

  useEffect(()=>{
    const fetchPosts = async() =>{
      const res = await axios.get("posts/timeline/625400bc00575a0301756870");
      setPosts(res.data);
      //console.log(res.data)
    }
    fetchPosts();
  },[]);

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