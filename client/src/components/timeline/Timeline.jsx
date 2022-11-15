import axios from 'axios';
import React, { useState, useEffect, useContext, createRef } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'timeago.js';
import {AuthContext} from "../../context/AuthContext";
import { locationsList } from '../../locationList';
import ClickedPost from '../ClickedPost';
import EmojiContainer from '../emoji/EmojiContainer';
import FriendList from '../FriendList';
import Location from '../Location';
import TaggedFriend from '../TaggedFriend';
import Comment from "./Comment";

const Timeline = ({post, socket}) => {

  const {_id, userId, createdAt, updatedAt, location, edited, desc, taggedFriends, img, likes, dislikes, comments} = post;
  // console.log(comments);

  const [totalComment, setTotalComment] = useState(comments);
  const [numberOfComments, setNumberOfComments] = useState(comments.length);
  const [lik, setLik] = useState(likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [clr, setClr] = useState("rgb(108, 104, 104)");
  const [disLik, setDisLik] = useState(dislikes.length);
  const [isDisLiked, setIsDisLiked] = useState(false);
  const [clr2, setClr2] = useState("rgb(108, 104, 104)");
  const [user, setUser] = useState({});                 // jis user ne post dali hai wo hai ye
  const {user:currentUser} = useContext(AuthContext);   // jisne login kiya hua hai wo hai ye
  const [showComment, setShowComment] = useState(false);
  const [show3Dots, setShow3Dots] = useState(false);
  const [edit, setEdit] = useState(false);

  const [editedDone, setEditedDone] = useState(edited);

  const inputRef = createRef();
  const [message, setMessage] = useState(desc);
  const [cursorPosition, setCursorPosition] = useState();
  const [showEmojisForEditDesc, setShowEmojisForEditDesc] = useState(false);
  
  const [following, setFollowing] = useState([]);
  const [showFriendList, setShowFriendList] = useState(false);
  const [taggedFriend, setTaggedFriend] = useState(taggedFriends);

  const [showLocations, setShowLocations] = useState(false);
  const [query, setQuery] = useState("");
  const [loc, setLoc] = useState(location);

  const [descGreaterThan200, setDescGreaterThan200] = useState(message.length>200);

  const [showParticularPost, setShowParticularPost] = useState(false);

  const inputRef2 = createRef();
  const [commentedText, setCommentedText] = useState("");
  const [cursorPosition2, setCursorPosition2] = useState();
  const [showEmojisForComment, setShowEmojisForComment] = useState(false)

  const [replyIconClicked, setReplyIconClicked] = useState(false);
  const [particularCommentId, setParticularCommentId] = useState("");

  const [editIconClicked, setEditIconClicked] = useState(false);
  const [editDone, setEditDone] = useState(false);

  const [nestedCommentLength, setNestedCommentLength] = useState(0);

  // console.log(totalComment);


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

  useEffect(()=>{
    const fetchFollowings = async() =>{
      const res = await axios.get("users/"+currentUser._id);
      const arr = res.data.followings
      setFollowing(arr);
    }
    fetchFollowings();
  },[currentUser._id]);

  const handleDescChange = (e)=>{
    setMessage(e.target.value);
  }

  const handleCommentChange = (e)=>{
    setCommentedText(e.target.value);
  }

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
        setDisLik(disLik-1);
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

      setDisLik(isDisLiked ? disLik-1 : disLik+1);
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
    setShowEmojisForComment(false);

    if(commentedText){
      const newComment = {
        commentId: Math.random().toString(),
        dp: currentUser.profilePicture,
        name: currentUser.fname + " " + currentUser.lname,
        id: currentUser._id,
        comment: commentedText,
        commentLikes: [],
        nestedComments: [],
        date: new Date()
      }

      try{
        await axios.put("posts/"+ _id +"/comment", newComment);
        setNumberOfComments(numberOfComments+1);
        setCommentedText("");
        
        notificationHandler("commented");
      }
      catch(err){}

      setTotalComment((prev)=>[...prev, newComment]);
      setShowComment(true);
    }
  }

  const showCommentHandler = () =>{
    if(comments.length!==0)
      setShowComment(!showComment);
    
    if(showComment)
      setReplyIconClicked(false)
  }

  const replyCommentHandler = (id, name) =>{
    setReplyIconClicked(true);
    const ref = inputRef2.current;
    ref.focus();
    setParticularCommentId(id);
    setCommentedText("@" + name + " ");
  }
  
  const replySubmitHandler = async(e) =>{
    e.preventDefault();
    setShowEmojisForComment(false);

    if(commentedText){
      const newNestedComment = {
        nestedCommentId: Math.random().toString(),
        nestedDp: currentUser.profilePicture,
        nestedName: currentUser.fname + " " + currentUser.lname,
        nestedId: currentUser._id,
        nestedComment: commentedText,
        nestedCommentLikes: [],
        date: new Date()
      }

      try{
        await axios.put("posts/"+ _id +"/comment/"+ particularCommentId + "/reply", newNestedComment);
        setCommentedText("");
        
        notificationHandler("commented");

        setNestedCommentLength(nestedCommentLength + 1);
        setReplyIconClicked(false);
      }
      catch(err){}
    }
  }

  const editCommentHandler = (id, comment) =>{
    setEditIconClicked(true);
    const ref = inputRef2.current;
    ref.focus();
    setParticularCommentId(id);
    setCommentedText(comment);
  }

  const editCommentSubmitHandler = async(e) =>{
    e.preventDefault();
    setShowEmojisForComment(false);

    if(commentedText){
      try{
        await axios.put("posts/"+ _id +"/comment/"+ particularCommentId + "/edit", {updatedComment: commentedText});
        setCommentedText("");
        
        notificationHandler("commented");

        setEditIconClicked(false);
      }
      catch(err){}

      setEditDone(!editDone);
    }
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
      desc: message,
      location: loc,
      taggedFriends: taggedFriend,
      edited : desc!==message,
    }

    try{
      await axios.put("/posts/"+_id, updatedPost)
      // window.location.reload();
      setEdit(false);
      setShowEmojisForEditDesc(false);
      setShowFriendList(false);
      setTaggedFriend(taggedFriend);
      if(desc!==message)
        setEditedDone(true);
    }
    catch(err){}
  }

  const cancelBtnHandler = ()=>{
    setEdit(false);
    setShowEmojisForEditDesc(false);
    setShowFriendList(false);
    setShowLocations(false);
    setMessage(desc);
    setTaggedFriend(taggedFriends);
    setLoc(location);
  }

  const reportPostHandler = ()=>{
    setShow3Dots(!show3Dots)
  }

  const blurrScreenHandler = ()=>{
    setShowParticularPost(!showParticularPost);

    if(!showParticularPost){
      document.body.style.overflow = "hidden";
      document.body.scrollIntoView();
    }
    else
      document.body.style.overflow = "auto";

    
  }

  const reverseOrderComment = [...totalComment].reverse();       // last commented shown first

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
              {user._id===currentUser._id ?
                <Link to={`/admin/${user._id}`} style={{textDecoration: 'none', color:'black'}}>
                  <div className="post-username"> {name} </div>
                </Link> :
                <Link to={`/user/${user._id}`} style={{textDecoration: 'none', color:'black'}}>
                  <div className="post-username"> {name} </div>
                </Link>
              }

              <div className="post-date-location">
                <div className='post-date'>{format(createdAt)}</div>
                {edit ?
                  (loc &&(
                    <div className='location-post-container-edited'>
                      <div className='dot-edited'>.</div>
                      <i class="fa-solid fa-location-dot location-post-icon"></i>
                      <div className='location-post-name'>{loc}</div>
                      <div className='location-post-cross'><i class="fa-solid fa-xmark" onClick={()=>setLoc("")}></i></div>
                    </div>
                  ))
                  :
                  (loc &&(
                    <>
                      <div className='dot'>.</div>
                      <i class="fa-solid fa-location-dot"></i>
                      <p className='location-name'>{loc}</p>
                    </>
                  ))
                }

                {editedDone &&
                  <>
                    <div className='dot'>.</div>
                    <div className='edited-done'>edited</div>
                  </>
                }

              </div>
            </span>
          </div>
          
          <div className="post-top-dots" onClick={()=>{setShow3Dots(!show3Dots)}}>
            <i className="fa-solid fa-ellipsis"></i>
          </div>

          {currentUser._id===userId ?
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

        {edit ?
          <div className="edit-post">
            <textarea type="text" className="post-input-edit" placeholder={"Start a post..."} value={message} onChange={handleDescChange} ref={inputRef}/>
            <div className="edit-btn">
              <button type="submit" className="update-btn" onClick={updateBtnHandler}>Update</button>
              <button type="submit" className="cancel-btn" onClick={cancelBtnHandler}>Cancel</button>
              <div className='icons-after-edit'>
                <div className='edit-emoji'><i class="fa-regular fa-face-laugh" onClick={()=>{setShowEmojisForEditDesc(!showEmojisForEditDesc); setShowLocations(false); setShowFriendList(false)}}></i></div>
                <div className='edit-tag'><i class="fa-solid fa-tags" onClick={()=>{setShowFriendList(!showFriendList); setShowEmojisForEditDesc(false); setShowLocations(false)}}></i></div>
                <div className='edit-location'><i class="fa-solid fa-location-dot" onClick={()=>{setShowLocations(!showLocations); setShowFriendList(false); setShowEmojisForEditDesc(false)}}></i></div>
              </div>
            </div>
          </div> :
          (descGreaterThan200 && img ?
            <div className="post-caption">
              {message.substr(0,200)}
              <span className='read-more' onClick={()=>{setDescGreaterThan200(false)}}>... read more</span>
            </div> :
            <div className="post-caption"> {message} </div>
          )
        }

        {edit ?
          <div className='location-post-container'>
            {taggedFriend.map((friend)=>(
              <TaggedFriend
                key={Math.random()}
                friend={friend}
                setTaggedFriends={setTaggedFriend}
                taggedFriends={taggedFriend}
              />
            ))}
          </div> :
          <div className='tagged-friend-container'>
            {taggedFriend.map((friend)=>(
              <Link to={`/user/${friend.id}`} style={{textDecoration: 'none'}}>
                <div className='tagged-friend'>@{friend.name}</div>
              </Link>
            ))}
          </div>
        }

        {img && <img src={PF+img} alt="" className="post-img" onDoubleClick={likeHandler} onClick={blurrScreenHandler} />}

        <div className="post-reaction-count">
          <div className="like-dislike-count">
            <i className="fa-solid fa-thumbs-up solid-thumbs-up"></i>
            <span className="count">{lik}</span>
            <i className="fa-solid fa-thumbs-down solid-thumbs-down"></i>
            <span className="count">{disLik}</span>
          </div>
          <div className="comment-count">{numberOfComments} comment</div>
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
                <Comment
                  key={data.commentId}
                  commentId={data.commentId}
                  user={user}
                  currentUser={currentUser}
                  numberOfComments={numberOfComments}
                  setNumberOfComments={setNumberOfComments}
                  setTotalComment={setTotalComment}
                  replyCommentHandler={replyCommentHandler}
                  nestedCommentLength={nestedCommentLength}
                  editCommentHandler={editCommentHandler}
                  editDone={editDone}
                  _id={_id}
                />
            ))}
          </div>
        )}
        
        <form className="comment-section">
          <img className='comment-profile-img' src={PF+currentUser.profilePicture} alt="" />
          <textarea type="text" className="comment-input" placeholder='Write a comment...' value={commentedText} onChange={handleCommentChange} ref={inputRef2} />
          <div className="emoji-icon">
            <i className="fa-regular fa-face-laugh" onClick={()=>{setShowEmojisForComment(!showEmojisForComment)}}></i>
          </div>
          <div className="tag-icon">
            <i class="fa-solid fa-tags"></i>
          </div>

          {showComment ?
            ((replyIconClicked || editIconClicked) ?
              (replyIconClicked ?
                <div className="send-icon">
                  <i className="fa-solid fa-paper-plane" onClick={replySubmitHandler}></i>
                </div> :
                <div className="send-icon">
                  <i className="fa-solid fa-paper-plane" onClick={editCommentSubmitHandler}></i>
                </div>
              ) : 
              <div className="send-icon">
                <i className="fa-solid fa-paper-plane" onClick={commentHandler}></i>
              </div>
            ) :
            <div className="send-icon">
              <i className="fa-solid fa-paper-plane" onClick={commentHandler}></i>
            </div>
          }

        </form>
      </div>

      {showEmojisForEditDesc &&
        <EmojiContainer
          inputRef={inputRef}
          setMessage={setMessage}
          message={message}
          setCursorPosition={setCursorPosition}
          cursorPosition={cursorPosition}
        />
      }

      {showEmojisForComment &&
        <EmojiContainer
          inputRef={inputRef2}
          setMessage={setCommentedText}
          message={commentedText}
          setCursorPosition={setCursorPosition2}
          cursorPosition={cursorPosition2}
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
              setLocation={setLoc}
              // setShowLocationPostContainer={setShowLocationPostContainer}
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
                  setTaggedFriends={setTaggedFriend}
                  setQuery={setQuery}
                />
            ))}
        </ul>
      </div>}

      {showParticularPost && <div className='blurr-div'>
        <ClickedPost
          user={user}
          currentUser={currentUser}
          DP={DP}
          name={name}
          _id={_id}
          createdAt={createdAt} 
          location={location}
          edited={edited}
          desc={desc}
          taggedFriends={taggedFriends}
          img={img}

          likes={lik}
          setLike={setLik}
          isLik={isLiked}
          setIsLik={setIsLiked}

          dislikes={disLik}
          setDisLike={setDisLik}
          isDisLik={isDisLiked}
          setIsDisLik={setIsDisLiked}

          color1={clr}
          setColor={setClr}
          color2={clr2}
          setColor2={setClr2}

          setTotalComment={setTotalComment}
          totalComment={totalComment}
          setNumberOfComments={setNumberOfComments}
          setShowParticularPost={setShowParticularPost}
          replyCommentHandler={replyCommentHandler}
          nestedCommentLength={nestedCommentLength}
          setNestedCommentLength={setNestedCommentLength}
          showParticularPost={showParticularPost}
          socket={socket}
        />
      </div>}

    </div>
  )
}

export default Timeline;