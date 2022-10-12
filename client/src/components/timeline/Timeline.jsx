import axios from 'axios';
import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'timeago.js';
import {AuthContext} from "../../context/AuthContext";
import Comment from "./Comment";

const Timeline = ({post, socket}) => {

  const {desc, img, userId, likes, dislikes, comments, createdAt, updatedAt, _id} = post;
  //console.log(post.comments);

  const [comment, setComment] = useState(comments.length);
  const [lik, setLik] = useState(likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [clr, setClr] = useState("rgb(108, 104, 104)");
  const [dislik, setDisLik] = useState(dislikes.length);
  const [isDisLiked, setIsDisLiked] = useState(false);
  const [clr2, setClr2] = useState("rgb(108, 104, 104)");
  const [user, setUser] = useState({});                 // jis user ne post dali hai wo hai ye
  const {user:currentUser} = useContext(AuthContext);   // jisne login kiya hua hai wo hai ye
  const comment_text = useRef();
  const [showComment, setShowComment] = useState(false);
  const [show3Dots, setShow3Dots] = useState(false);
  const [edit, setEdit] = useState(false);
  const editedDesc = useRef();
  const [updatedDesc, setUpdatedDesc] = useState(desc);

  useEffect(()=>{
    setIsLiked(likes.includes(currentUser._id));
    setIsDisLiked(dislikes.includes(currentUser._id));
  }, [currentUser._id, likes]);

  useEffect(()=>{          // i made this no dependency useEffect only to show initial colors of like and dislike. 
    setClr(isLiked ? "#417af5" : "rgb(108, 104, 104)");
    setClr2(isDisLiked ? "rgba(252, 5, 5,0.8)" : "rgb(108, 104, 104)");
    console.log("rendered...")
  });     // no dependecy, i know it is not good, due to this page re-render for unnecessary 

  useEffect(()=>{
    const fetchUser = async() =>{
      const res = await axios.get(`users/${userId}`);
      setUser(res.data);
      //console.log(res.data)
    }
    fetchUser();
  },[userId]);

  const notificationHandler = (type)=>{
    if(currentUser._id !== user._id){
      socket.emit("sendNotification", {
        senderId : currentUser._id,
        name : currentUser.fname + " " + currentUser.lname,
        avatar : currentUser.profilePicture,
        receiverId : user._id,
        type,
      });
    }
    // console.log(user);
  };

  
  const likeHandler = async() =>{
    try{
      await axios.put("posts/"+ _id +"/like", {userId: currentUser._id});

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
        await axios.put("posts/"+ _id +"/dislike", {userId: currentUser._id});
      }

      notificationHandler("liked");
    }
    catch(err){}
  }
  
  const dislikeHandler = async() =>{
    try{
      await axios.put("posts/"+ _id +"/dislike", {userId: currentUser._id})

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
        await axios.put("posts/"+ _id +"/like", {userId: currentUser._id});
      }

      notificationHandler("disliked");
    }
    catch(err){}
  }

  const commentHandler = async(e)=>{
    e.preventDefault();

    if(comment_text.current.value){
      const newComment = {
        dp: currentUser.profilePicture,
        name: currentUser.fname + " " + currentUser.lname,
        comment: comment_text.current.value,
        date: new Date()
      }

      try{
        await axios.put("posts/"+ _id +"/comment", newComment);
        // window.location.reload();
        setComment(comment+1);
        comment_text.current.value= "";
        
        notificationHandler("commented");
      }
      catch(err){}

      comments.push(newComment);
      setShowComment(true);
    }
  }

  const showCommentHandler = () =>{
    if(comments.length!==0)
      setShowComment(!showComment);
  }

  const deletePostHandler = async()=>{
    try{
      const remove = window.confirm("Are you sure, you want to remove this post?");
      if(remove){
        await axios.delete("posts/"+ _id);
        await axios.put("users/"+currentUser._id, {userId: currentUser._id, totalPosts: currentUser.totalPosts-1});
        window.location.reload();
      }
    }
    catch(err){}
    setShow3Dots(!show3Dots)
  }

  const editPostHandler =()=>{
    setEdit(true);
    setShow3Dots(!show3Dots)
  }

  const updateBtnHandler = async()=>{
    const updatedPost = {
      userId: currentUser._id,
      desc: editedDesc.current.value,
    }

    try{
      await axios.put("/posts/"+_id, updatedPost)
      // window.location.reload();
      setEdit(false);
      setUpdatedDesc(editedDesc.current.value);
    }
    catch(err){}
  }

  const reportPostHandler = ()=>{
    setShow3Dots(!show3Dots)
  }

  console.log(desc)

  const reverseOrderComment = [...comments].reverse();       // last commented shown first

  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const name = user.fname + ' ' + user.lname;
  const DP = user.profilePicture ? PF + user.profilePicture : PF + "default-dp.png";

  return (
    <div className='timeline-post'>
      <div className="timeline-post-wrapper">
        <div className="post-top-section">
          <div className="post-top-left">
            {/* if user that is logged in is same as on which we are clicking for view his profile then show him admin profile page else simple user profile page */}
            {user._id===currentUser._id?
              <Link to={`/admin/${user._id}`}>
                <img src={DP} alt="" className="post-profile-img" />
              </Link>:
              <Link to={`/user/${user._id}`}>
                <img src={DP} alt="" className="post-profile-img" />
              </Link>
            }
            <span className="post-username-date">
              {user._id===currentUser._id?
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
          <div className="post-top-dots" onClick={()=>{setShow3Dots(!show3Dots)}}>
            <i className="fa-solid fa-ellipsis"></i>
          </div>
          {currentUser._id===post.userId ?
            ( show3Dots && (
              <div className="post-3-dots-functionality">
                <div className="post-3-dots-functionality-wrapper">
                  <div className="three-dots-fun" id="delete-post" onClick={deletePostHandler}>Delete</div>
                  <hr className='three-dots-hr'/>
                  <div className="three-dots-fun" id="update-post" onClick={editPostHandler}>Edit</div>
                  <hr className='three-dots-hr' />
                  <div className="three-dots-fun" id="cancel-post" onClick={()=>{setShow3Dots(!show3Dots)}}>Cancel</div>
                </div>
              </div>
            )) :
            ( show3Dots && (
              <div className="post-3-dots-functionality" >
                <div className="post-3-dots-functionality-wrapper">
                  <div className="three-dots-fun" id="delete-post" onClick={reportPostHandler}>Report</div>
                  <hr className='three-dots-hr' />
                  <div className="three-dots-fun" id="cancel-post" onClick={()=>{setShow3Dots(!show3Dots)}}>Cancel</div>
                </div>
              </div>
            ))
          }
        </div>
        {edit 
          ? <div className="edit-post">
              <textarea type="text" className="post-input-edit" placeholder={"Start a post..."} defaultValue={updatedDesc} ref={editedDesc} />
              <div className="edit-btn">
                <button type="submit" className="update-btn" onClick={updateBtnHandler}>Update</button>
                <button type="submit" className="cancel-btn" onClick={()=>{setEdit(false)}}>Cancel</button>
              </div>
            </div>
          : <div className="post-caption"> {updatedDesc} </div>}
        {img && <img src={PF+img} alt="" className="post-img" onDoubleClick={likeHandler} />}
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
          <div className="comment" onClick={showCommentHandler}>
            <i className="fa-regular fa-message"></i>
            <span>Comment</span>
          </div>
        </div>
        <hr className='post-hr'/>
        { showComment && (
          <div className="comment-div">
            {reverseOrderComment.map((data)=>(
                <Comment key={data} cmnt={data} />
            ))}
          </div>
        )}
        <form className="comment-section" onSubmit={commentHandler}>
          <img className='comment-profile-img' src={PF+currentUser.profilePicture} alt="" />
          <input type="text" className="comment-input" placeholder='Write a comment...' ref={comment_text} />
          <div className="send-icon">
            <i className="fa-solid fa-paper-plane" onClick={commentHandler}></i>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Timeline;