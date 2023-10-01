import axios from 'axios';
import React, { useContext, useState, useEffect, createRef } from 'react'
import { Link } from 'react-router-dom';
import { format } from 'timeago.js';
import { AuthContext } from '../context/AuthContext';
import EmojiContainer from './emoji/EmojiContainer';
import PostImage from './PostImage';
import Comment from './timeline/Comment';
import WhoLikedDisliked from './WhoLikedDisliked';

const UserPost = ({user, name, DP, post, isLik, isDisLik}) => {
    const {_id, userId, createdAt, location, edited, desc, taggedFriends, img, likes, dislikes, comments} = post;

    const {user:currentUser} = useContext(AuthContext);
    const [totalComment, setTotalComment] = useState();
    const [numberOfComments, setNumberOfComments] = useState();
    const [lik, setLik] = useState();
    const [isLiked, setIsLiked] = useState(isLik);
    const [clr, setClr] = useState("");
    const [disLik, setDisLik] = useState();
    const [isDisLiked, setIsDisLiked] = useState(isDisLik);
    const [clr2, setClr2] = useState("");
    const [showComment, setShowComment] = useState(false);
    const [descGreaterThan200, setDescGreaterThan200] = useState(desc.length>200);
    const [showWhoLiked, setShowWhoLiked] = useState(false);
    const [showWhoDisLiked, setShowWhoDisLiked] = useState(false);

    const inputRef = createRef();
    const [commentedText, setCommentedText] = useState("");
    const [showEmojisForComment, setShowEmojisForComment] = useState(false)
    const [cursorPosition, setCursorPosition] = useState();
    const [replyIconClicked, setReplyIconClicked] = useState(false);
    const [editIconClicked, setEditIconClicked] = useState(false);
    const [editDone, setEditDone] = useState(false);
    const [particularCommentId, setParticularCommentId] = useState("");
    const [nestedCommentLength, setNestedCommentLength] = useState(0);
    const [replyToName, setReplyToName] = useState("");
    const [replyToId, setReplyToId] = useState("");

    const PF = process.env.REACT_APP_PUBLIC_FOLDER;

    useEffect(()=>{
        setTotalComment(comments);
        setNumberOfComments(comments.length)
        setLik(likes.length);
        setDisLik(dislikes.length)
        setIsLiked(isLik)
        setIsDisLiked(isDisLik)
        setClr(isLik ? "#417af5" : "rgb(108, 104, 104)");
        setClr2(isDisLik ? "rgba(252, 5, 5,0.8)" : "rgb(108, 104, 104)");
    },[userId]);

    const likeDislikeHandler = async(type) =>{
        if(type==='liked'){
            try{
                await axios.put("/posts/"+ _id +"/like", {userId: currentUser._id});
          
                setLik(isLiked ? lik-1 : lik+1);
                setIsLiked(!isLiked)
                
                if(isLiked)
                  setClr("rgb(108, 104, 104)");    //grey
                else
                  setClr("#417af5");               //blue
                
                if(isDisLiked){
                  setDisLik(disLik-1);
                  setClr2("rgb(108, 104, 104)");   //grey
                  setIsDisLiked(false);
                  await axios.put("/posts/"+ _id +"/dislike", {userId: currentUser._id});
                }
          
                // notificationHandler("liked");
            }
            catch(err){}
        }
        else{
            try{
                await axios.put("/posts/"+ _id +"/dislike", {userId: currentUser._id})
          
                setDisLik(isDisLiked ? disLik-1 : disLik+1);
                setIsDisLiked(!isDisLiked);
                
                if(isDisLiked)
                  setClr2("rgb(108, 104, 104)");     //grey
                else
                  setClr2("rgba(252, 5, 5,0.8)");    //red
                
                if(isLiked){
                  setLik(lik-1);
                  setClr("rgb(108, 104, 104)");      //grey
                  setIsLiked(false);
                  await axios.put("/posts/"+ _id +"/like", {userId: currentUser._id});
                }
          
                // notificationHandler("disliked")
            }
            catch(err){}
        }
    }

    const showCommentHandler = () =>{
        if(comments.length!==0)
          setShowComment(!showComment);
        
        if(showComment)
          setReplyIconClicked(false)
    }

    const handleCommentChange = (e)=>{
        setCommentedText(e.target.value);
    }

    const commentHandler = async(e)=>{
        e.preventDefault();
        setShowEmojisForComment(false);
    
        if(commentedText){
            const newComment = {
                commentId: Math.random().toString(),
                dp: user.profilePicture?.includes('https://') ? user.profilePicture : PF+user.profilePicture,
                name: user.fname + " " + user.lname,
                id: user._id,
                comment: commentedText,
                commentLikes: [],
                nestedComments: [],
                date: new Date()
            }
        
            try{
                await axios.put("/posts/"+ _id +"/comment", newComment);
                setNumberOfComments(numberOfComments+1);
                setCommentedText("");
                
                // notificationHandler("commented");
            }
            catch(err){}
        
            setTotalComment((prev)=>[...prev, newComment]);
            setShowComment(true);
        }
    }
    
    const replyCommentHandler = (id, name, nameId) =>{
        setReplyIconClicked(true);
        const ref = inputRef.current;
        ref.focus();
        setParticularCommentId(id);
        setCommentedText("@" + name + " ");
    
        setReplyToName(name);
        setReplyToId(nameId);
    }
      
    const replySubmitHandler = async(e) =>{
        e.preventDefault();
        setShowEmojisForComment(false);
    
        if(commentedText){
          let text = commentedText;
          text = text.replace('@'+replyToName, '@'+replyToId);
    
          const newNestedComment = {
            nestedCommentId: Math.random().toString(),
            nestedDp: user.profilePicture?.includes('https://') ? user.profilePicture : PF+user.profilePicture,
            nestedName: user.fname + " " + user.lname,
            nestedId: user._id,
            nestedComment: text,
            nestedCommentLikes: [],
            date: new Date()
          }
    
          try{
            await axios.put("/posts/"+ _id +"/comment/"+ particularCommentId + "/reply", newNestedComment);
            setCommentedText("");
            
            // notificationHandler("replied");
    
            setNestedCommentLength(nestedCommentLength + 1);
            setReplyIconClicked(false);
          }
          catch(err){}
        }
    }
    
    const editCommentHandler = (id, comment) =>{
        setEditIconClicked(true);
        const ref = inputRef.current;
        ref.focus();
        setParticularCommentId(id);
        setCommentedText(comment);
    }
    
    const editCommentSubmitHandler = async(e) =>{
        e.preventDefault();
        setShowEmojisForComment(false);
    
        if(commentedText){
          try{
            await axios.put("/posts/"+ _id +"/comment/"+ particularCommentId + "/edit", {updatedComment: commentedText});
            setCommentedText("");
            
            // notificationHandler("commented");
    
            setEditIconClicked(false);
          }
          catch(err){}
    
          setEditDone(!editDone);
        }
    }

    const reverseOrderComment = totalComment && [...totalComment].reverse();

    return (
        <div className='timeline-post'>
            <div className="timeline-post-wrapper">
                <div className="post-top-section">
                    <div className="post-top-left">
                        <img src={DP} alt="" className="post-profile-img" style={{cursor:"default"}} />

                        <span className="post-username-date">
                            <div className="post-username" style={{cursor:"text"}}> {name} </div>

                            <div className="post-date-location">
                                <div className='post-date'>{format(createdAt)}</div>
                                {location &&
                                    <>
                                        <div className='dot'>.</div>
                                        <i class="fa-solid fa-location-dot"></i>
                                        <p className='location-name'>{location}</p>
                                    </>
                                }
                                {edited &&
                                    <>
                                        <div className='dot'>.</div>
                                        <div className='edited-done'>edited</div>
                                    </>
                                }
                            </div>
                        </span>
                    </div>
                    
                    <div className="post-top-dots">
                        <i className="fa-solid fa-ellipsis"></i>
                    </div>
                </div>

                {(descGreaterThan200 && img.length) ?
                    <div className="post-caption">
                        {desc.substr(0,200)}
                        <span className='read-more' onClick={()=>{setDescGreaterThan200(false)}}>... read more</span>
                    </div> :
                    <div className="post-caption"> {desc} </div>
                }

                <div className='tagged-friend-container'>
                    {taggedFriends.map((friend)=>(
                        <Link to={`/user/${friend.id}`} style={{textDecoration: 'none'}}>
                            {friend.id !== currentUser._id ? 
                                <div className='tagged-friend'>@{friend.name}</div>
                                :
                                <div className='tagged-friend' style={{backgroundColor: 'blue', color: 'white'}}>@{friend.name}</div>
                            }
                        </Link>
                    ))}
                </div>

                {img.length && <div className='post-media-preview-container'>
                    <PostImage images={img} />
                </div>}

                <div className="post-reaction-count">
                    <div className="like-dislike-count">
                        <i className="fa-solid fa-thumbs-up solid-thumbs-up" onClick={()=>{setShowWhoLiked(!showWhoLiked); setShowWhoDisLiked(false)}}></i>
                        <span className="count">{lik}</span>
                        <i className="fa-solid fa-thumbs-down solid-thumbs-down" onClick={()=>{setShowWhoDisLiked(!showWhoDisLiked); setShowWhoLiked(false)}}></i>
                        <span className="count">{disLik}</span>
                    </div>
                    {numberOfComments > 1 ?
                        <div className="comment-count">{numberOfComments} comments</div>
                        :
                        <div className="comment-count">{numberOfComments} comment</div>
                    }
                
                    {(showWhoLiked && likes.length>0) && (
                        <div className="liked-disliked-div">
                            {likes.map((userId)=>(
                                <WhoLikedDisliked
                                    key={userId}
                                    userId={userId}
                                />
                            ))}
                        </div>
                    )}

                    {(showWhoDisLiked && dislikes.length>0) && (
                        <div className="liked-disliked-div">
                            {dislikes.map((userId)=>(
                                <WhoLikedDisliked
                                key={userId}
                                userId={userId}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <hr className='post-hr'/>

                <div className="post-reaction-icon">
                    <div className="like" onClick={()=>likeDislikeHandler("liked")}>
                        <i className="fa-regular fa-thumbs-up regular-thumbs-up" style={{color:clr}} ></i>
                        <span style={{color:clr}} >Like</span>
                    </div>
                    <div className="dislike" onClick={()=>likeDislikeHandler("disliked")}>
                        <i className="fa-regular fa-thumbs-down regular-thumbs-down" style={{color:clr2}} ></i>
                        <span style={{color:clr2}} >Dislike</span>
                    </div>
                    <div className="comment" onClick={showCommentHandler}>
                        <i className="fa-regular fa-message"></i>
                        <span>Comment</span>
                    </div>
                </div>

                <hr className='post-hr'/>

                {showComment && (
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
                    <div className='comment-profile-img-container'>
                        <img className='comment-profile-img' src={user.profilePicture?.includes('https://') ? user.profilePicture : PF+user.profilePicture} alt="" />
                    </div>
                    <div className='comment-input-container'>
                        <textarea
                            type="text"
                            className="comment-input"
                            placeholder='Write a comment...'
                            value={commentedText}
                            onChange={handleCommentChange}
                            ref={inputRef}
                        />
                        <div className="emoji-icon">
                            <i className="fa-regular fa-face-laugh" onClick={()=>{setShowEmojisForComment(!showEmojisForComment)}}></i>
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
                    </div>
                </form>
            </div>

            {showEmojisForComment &&
                <EmojiContainer
                    inputRef={inputRef}
                    setMessage={setCommentedText}
                    message={commentedText}
                    setCursorPosition={setCursorPosition}
                    cursorPosition={cursorPosition}
                />
            }
        </div>
    )
}

export default UserPost;
