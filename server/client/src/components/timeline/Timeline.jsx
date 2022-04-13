import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'timeago.js';
import {AuthContext} from "../../context/AuthContext"

const Timeline = ({post}) => {
  const {desc, img, userId, likes, dislikes, comments, createdAt, _id} = post;

  //console.log(img)

  const [comment, setComment] = useState(comments.length);
  const [lik, setLik] = useState(likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [clr, setClr] = useState("rgb(108, 104, 104)");
  const [dislik, setDisLik] = useState(dislikes.length);
  const [isDisLiked, setIsDisLiked] = useState(false);
  const [clr2, setClr2] = useState("rgb(108, 104, 104)");
  const [user, setUser] = useState({});
  const {user:currentUser} = useContext(AuthContext);


  useEffect(()=>{
    setIsLiked(likes.includes(currentUser._id));
    setIsDisLiked(dislikes.includes(currentUser._id));
  }, [currentUser._id, likes]);

  useEffect(()=>{          // i put this no dependency useEffect only to show initial colors of like and dislike. 
    setClr(isLiked ? "#417af5" : "rgb(108, 104, 104)");
    setClr2(isDisLiked ? "rgba(252, 5, 5,0.8)" : "rgb(108, 104, 104)");
    console.log("rendered...")
  });     // no dependecy, i know it is not good, due to this page for unnecessary 

  useEffect(()=>{
    const fetchUser = async() =>{
      const res = await axios.get(`users/${userId}`);
      setUser(res.data);
      //console.log(res.data)
    }
    fetchUser();
  },[userId]);

  
  const likeHandler = () =>{
    try{
      axios.put("posts/"+ _id +"/like", {userId: currentUser._id});

      setLik(isLiked ? lik-1 : lik+1);
      setIsLiked(!isLiked)
      
      if(isLiked)
        setClr("rgb(108, 104, 104)");
      else
        setClr("#417af5");
      
      if(isDisLiked){
        setDisLik(dislik-1);
        setClr2("rgb(108, 104, 104)");
        setIsDisLiked(false);
        axios.put("posts/"+ _id +"/dislike", {userId: currentUser._id});
    }
    }
    catch{
      
    }
  }
  
  const dislikeHandler = () =>{
    try{
      axios.put("posts/"+ _id +"/dislike", {userId: currentUser._id})

      setDisLik(isDisLiked ? dislik-1 : dislik+1);
      setIsDisLiked(!isDisLiked);
      
      if(isDisLiked)
        setClr2("rgba(252, 5, 5,0.8)");
      else
        setClr2("rgb(108, 104, 104)");
      
      if(isLiked){
        setLik(lik-1);
        setClr("rgb(108, 104, 104)");
        setIsLiked(false);
        axios.put("posts/"+ _id +"/like", {userId: currentUser._id});
    }
    }
    catch{
      
    }
  }
  
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const name = user.fname + ' ' + user.lname;
  const DP = user.profilePicture ? PF + user.profilePicture : PF + "default-dp.png";

  return (
    <div className='timeline-post'>
      <div className="timeline-post-wrapper">
        <div className="post-top-section">
          <div className="post-top-left">
            {/* if user is admin then show him admin profile page else simple user profile page */}
            {user.isAdmin?
              <Link to={`/admin/${user._id}`}>
                <img src={DP} alt="" className="post-profile-img" />
              </Link>:
              <Link to={`/user/${user._id}`}>
                <img src={DP} alt="" className="post-profile-img" />
              </Link>
            }
            <span className="post-username-date">
              {user.isAdmin?
                <Link to={`/admin/${user._id}`} style={{textDecoration: 'none', color:'black'}}>
                  <div className="post-username"> {name} </div>
                </Link>:
                <Link to={`/user/${user._id}`} style={{textDecoration: 'none', color:'black'}}>
                  <div className="post-username"> {name} </div>
                </Link>
              }
              <div className="post-date"> {format(createdAt)} </div>
            </span>
          </div>
          <div className="post-top-dots">
            <i className="fa-solid fa-ellipsis"></i>
          </div>
        </div>
        <div className="post-caption"> {desc} </div>
        <img src={PF+img} alt="" className="post-img" onDoubleClick={likeHandler} />
        <div className="post-reaction-count">
          <div className="like-dislike-count">
            <i className="fa-solid fa-thumbs-up solid-thumbs-up"></i>
            <span className="count">{lik}</span>
            <i className="fa-solid fa-thumbs-down solid-thumbs-down"></i>
            <span className="count">{dislik}</span>
          </div>
          <div className="comment-count">{comment} comment</div>
        </div>
        <hr className='post-hr'/>
        <div className="post-reaction-icon">
          <div className="like">
            <i className="fa-regular fa-thumbs-up regular-thumbs-up" onClick={likeHandler} style={{color:clr}} ></i>
            <span onClick={likeHandler} style={{color:clr}} >Like</span>
          </div>
          <div className="dislike">
            <i className="fa-regular fa-thumbs-down regular-thumbs-down" onClick={dislikeHandler} style={{color:clr2}} ></i>
            <span onClick={dislikeHandler} style={{color:clr2}}>Dislike</span>
          </div>
          <div className="comment">
            <i className="fa-regular fa-message"></i>
            <span>Comment</span>
          </div>
        </div>
        <hr className='post-hr'/>
        <div className="comment-section">
          <img className='comment-profile-img' src={DP} alt="" />
          <input type="text" className="comment-input" placeholder='Write a comment...'/>
          <div className="send-icon">
            <i className="fa-solid fa-paper-plane"></i>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Timeline