import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { format } from 'timeago.js';

const Timeline = ({post}) => {

  const {desc, img, date, userId, likes, dislikes, comments, createdAt} = post;

  const [comment, setComment] = useState(comments.length);
  
  const [lik, setLik] = useState(likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [clr, setClr] = useState("rgb(108, 104, 104)");

  const [dislik, setDisLik] = useState(dislikes.length);
  const [isDisLiked, setIsDisLiked] = useState(false);
  const [clr2, setClr2] = useState("rgb(108, 104, 104)");

  const [user, setUser] = useState({});

  useEffect(()=>{
    const fetchUser = async() =>{
      const res = await axios.get(`users/${userId}`);
      setUser(res.data);
      //console.log(res.data)
    }
    fetchUser();
  },[userId]);

  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const name = user.username;
  const DP = PF+user.profilePicture;

  const likeHandler = () =>{
    setLik(isLiked ? lik-1 : lik+1);
    setIsLiked(!isLiked)
    
    if(isLiked)
      setClr("rgb(108, 104, 104)");
    else
      setClr("#417af5");

    if(isDisLiked){
      setDisLik(dislik-1)
      setClr2("rgb(108, 104, 104)");
      setIsDisLiked(false)
    }
  }

  const dislikeHandler = () =>{
    setDisLik(isDisLiked ? dislik-1 : dislik+1);
    setIsDisLiked(!isDisLiked);

    if(isDisLiked)
      setClr2("rgb(108, 104, 104)");
    else
      setClr2("rgba(252, 5, 5,0.8)");

    if(isLiked){
      setLik(lik-1)
      setClr("rgb(108, 104, 104)");
      setIsLiked(false)
    }
  }

  return (
    <div className='timeline-post'>
      <div className="timeline-post-wrapper">
        <div className="post-top-section">
          <div className="post-top-left">
            <img src={DP} alt="" className="post-profile-img" />
            <span className="post-username-date">
              <div className="post-username"> {name} </div>
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
          <img className='comment-profile-img' src="assets/pic1.jpg" alt="" />
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