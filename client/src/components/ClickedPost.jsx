import axios from 'axios';
import React, { useState, useRef, createRef } from 'react'
import { Link } from 'react-router-dom'
import { format } from 'timeago.js';
import EmojiContainer from './emoji/EmojiContainer';
import PostImage from './PostImage';
import Comment from './timeline/Comment';
import WhoLikedDisliked from './WhoLikedDisliked';

const ClickedPost = ({
    user,
    currentUserId,
    currentUserDp,
    DP,
    name,
    _id,
    createdAt,
    location,
    edited,
    desc,
    taggedFriends,
    img,

    likeArray,
    likes,
    setLike,
    isLik,
    setIsLik,

    dislikeArray,
    dislikes,
    setDisLike,
    isDisLik,
    setIsDisLik,

    color1,
    setColor,
    color2,
    setColor2,

    setTotalComment,
    totalComment,
    setNumberOfComments,
    setShowParticularPost,
    replyCommentHandler,
    nestedCommentLength,
    setNestedCommentLength,
    showParticularPost,
    replyNestedCommentHandler,
    socket,
}) =>{

    const [numberOfCommentsForThisComponent, setNumberOfCommentsForThisComponent] = useState(totalComment?.length);
    const [lik, setLik] = useState(likes);
    const [isLiked, setIsLiked] = useState(isLik);
    const [clr, setClr] = useState(color1);
    const [dislik, setDisLik] = useState(dislikes);
    const [isDisLiked, setIsDisLiked] = useState(isDisLik);
    const [clr2, setClr2] = useState(color2);
    const [showComment, setShowComment] = useState(true);

    const inputRef = createRef();
    const [commentedText, setCommentedText] = useState("");
    const [cursorPosition, setCursorPosition] = useState();
    const [showEmojisForComment, setShowEmojisForComment] = useState(false)

    const [replyIconClicked, setReplyIconClicked] = useState(false);
    const [particularCommentId, setParticularCommentId] = useState("");

    const [editIconClicked, setEditIconClicked] = useState(false);
    const [editDone, setEditDone] = useState(false);

    const [showWhoLiked, setShowWhoLiked] = useState(false);
    const [showWhoDisLiked, setShowWhoDisLiked] = useState(false);

    const [replyToName, setReplyToName] = useState("");
    const [replyToId, setReplyToId] = useState("");


    const notificationHandler = (type)=>{
        if(currentUserId !== user._id){
            socket.emit("sendNotification", {
            senderId : currentUserId,
            receiverId : user._id,
            type,
            });
        }
        // console.log(user);
    };

    const handleCommentChange = (e)=>{
        setCommentedText(e.target.value);
    }

    const likeHandler = async() =>{
        try{
            await axios.put("posts/"+ _id +"/like", {userId: currentUserId});

            setLik(isLiked ? lik-1 : lik+1);
            setLike(isLiked ? lik-1 : lik+1);
            setIsLiked(!isLiked)
            setIsLik(!isLiked);
            
            if(isLiked){
                setClr("rgb(108, 104, 104)");
                setColor("rgb(108, 104, 104)");
            }
            else{
                setClr("#417af5");
                setColor("#417af5");
            }
            
            if(isDisLiked){
                setDisLik(dislik-1);
                setDisLike(dislik-1);
                setClr2("rgb(108, 104, 104)");
                setColor2("rgb(108, 104, 104)");
                setIsDisLiked(false);
                setIsDisLik(false);
                await axios.put("posts/"+ _id +"/dislike", {userId: currentUserId});
            }

            notificationHandler("liked");
        }
        catch(err){}
    }
  
    const dislikeHandler = async() =>{
        try{
            await axios.put("posts/"+ _id +"/dislike", {userId: currentUserId})

            setDisLik(isDisLiked ? dislik-1 : dislik+1);
            setDisLike(isDisLiked ? dislik-1 : dislik+1);
            setIsDisLiked(!isDisLiked);
            setIsDisLik(!isDisLiked);
            
            if(isDisLiked){
                setClr2("rgb(108, 104, 104)");
                setColor2("rgb(108, 104, 104)");
            }
            else{
                setClr2("rgba(252, 5, 5,0.8)");
                setColor2("rgba(252, 5, 5,0.8)")
            }
            
            if(isLiked){
                setLik(lik-1);
                setLike(lik-1);
                setClr("rgb(108, 104, 104)");
                setColor("rgb(108, 104, 104)");
                setIsLiked(false);
                setIsLik(false);
                await axios.put("posts/"+ _id +"/like", {userId: currentUserId});
            }

            notificationHandler("disliked");
        }
        catch(err){}
    }

    const showCommentHandler = () =>{
        if(totalComment?.length!==0)
            setShowComment(!showComment);

        if(showComment)
            setReplyIconClicked(false);
    }

    const commentHandler = async(e)=>{
        e.preventDefault();
        setShowEmojisForComment(false);

        if(commentedText){
            const newComment = {
                commentId: Math.random().toString(),
                id: currentUserId,
                comment: commentedText,
                commentLikes: [],
                nestedComments: [],
                date: new Date()
            }

            try{
                await axios.put("posts/"+ _id +"/comment", newComment);

                setNumberOfCommentsForThisComponent(numberOfCommentsForThisComponent + 1);
                setNumberOfComments(numberOfCommentsForThisComponent + 1);
                setCommentedText("");
                
                // notificationHandler("commented");
            }
            catch(err){}

            setTotalComment((prev)=>[...prev, newComment]);
            setShowComment(true);
        }
    }

    const replyCommentHandlerForParticularPost = (id, name, nameId) =>{
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
                nestedId: currentUserId,
                nestedComment: text,
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

    const replyNestedCommentHandlerForParticularPost = (commentId, name, nameId) =>{
        setReplyIconClicked(true);
        const ref = inputRef.current;
        ref.focus();
        setParticularCommentId(commentId);
        setCommentedText("@" + name + " ");
    
        setReplyToName(name);
        setReplyToId(nameId);
    }

    const editCommentHandlerForParticularPost = (id, comment) =>{
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
            await axios.put("posts/"+ _id +"/comment/"+ particularCommentId + "/edit", {updatedComment: commentedText});
            setCommentedText("");
            
            notificationHandler("commented");

            setEditIconClicked(false);
          }
          catch(err){}
    
          setEditDone(!editDone);
        }
    }


    const reverseOrderComment = [...totalComment].reverse();

    return (
        <>
            <div className="particular-post-wrapper">
                <div className="post-top-section">
                    <div className="post-top-left">
                        {user._id===currentUserId ?
                            <Link to={`/edit/user/${user._id}`}>
                                <img src={DP} alt="" className="post-profile-img" />
                            </Link> :
                            <Link to={`/user/${user._id}`}>
                                <img src={DP} alt="" className="post-profile-img" />
                            </Link>
                        }

                        <span className="post-username-date">
                            {user._id===currentUserId ?
                                <Link to={`/edit/user/${user._id}`} style={{textDecoration: 'none', color:'black'}}>
                                    <div className="post-username"> {name} </div>
                                </Link> :
                                <Link to={`/user/${user._id}`} style={{textDecoration: 'none', color:'black'}}>
                                    <div className="post-username"> {name} </div>
                                </Link>
                            }

                            <div className="post-date-location">
                                <div className='post-date'>{format(createdAt)}</div>
                                
                                {location && <>
                                    <div className='dot'>.</div>
                                    <i class="fa-solid fa-location-dot"></i>
                                    <p className='location-name'>{location}</p>
                                </>}

                                {edited && <>
                                    <div className='dot'>.</div>
                                    <div className='edited-done'>edited</div>
                                </>}
                            </div>
                        </span>
                    </div>
                    
                    <div className="post-top-dots" >
                        <i class="fa-solid fa-xmark" onClick={()=> {setShowParticularPost(false); document.body.style.overflow = "auto"}}></i>
                    </div>
                </div>
                
                <div className="post-caption"> {desc} </div>

                <div className='tagged-friend-container'>
                    {taggedFriends?.map((friend)=>(
                    <Link to={`/user/${friend.id}`} style={{textDecoration: 'none'}}>
                        <div className='tagged-friend'>@{friend.name}</div>
                    </Link>
                    ))}
                </div>

                {img?.length && <div className='preview-clicked-post'>
                    <PostImage images={img}/>
                </div>}

                <div className="post-reaction-count">
                    <div className="like-dislike-count">
                        <i className="fa-solid fa-thumbs-up solid-thumbs-up" onClick={()=>{setShowWhoLiked(!showWhoLiked); setShowWhoDisLiked(false)}}></i>
                        <span className="count">{lik}</span>
                        <i className="fa-solid fa-thumbs-down solid-thumbs-down" onClick={()=>{setShowWhoDisLiked(!showWhoDisLiked); setShowWhoLiked(false)}}></i>
                        <span className="count">{dislik}</span>
                    </div>
                    {numberOfCommentsForThisComponent > 1 ?
                        <div className="comment-count">{numberOfCommentsForThisComponent} comments</div>
                        :
                        <div className="comment-count">{numberOfCommentsForThisComponent} comment</div>
                    }

                    {(showWhoLiked && likeArray?.length>0) && (
                        <div className="liked-disliked-div">
                            {likeArray.map((userId)=>(
                                <WhoLikedDisliked
                                    key={userId}
                                    userId={userId}
                                />
                            ))}
                        </div>
                    )}

                    {(showWhoDisLiked && dislikeArray?.length>0) && (
                        <div className="liked-disliked-div">
                            {dislikeArray.map((userId)=>(
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
                                currentUserId={currentUserId}
                                setNumberOfCommentsForPopupPost={setNumberOfCommentsForThisComponent}
                                numberOfComments={numberOfCommentsForThisComponent}
                                setNumberOfComments={setNumberOfComments}
                                setTotalComment={setTotalComment}
                                replyCommentHandler={replyCommentHandler}
                                nestedCommentLength={nestedCommentLength}
                                replyCommentHandlerForParticularPost={replyCommentHandlerForParticularPost}
                                editCommentHandlerForParticularPost={editCommentHandlerForParticularPost}
                                editDone={editDone}
                                showParticularPost={showParticularPost}
                                replyNestedCommentHandlerForParticularPost={replyNestedCommentHandlerForParticularPost}
                                _id={_id}
                            />
                        ))}
                    </div>
                )}
                
                <form className="comment-section" onSubmit={commentHandler}>
                    <div className='comment-profile-img-container'>
                        <img className='comment-profile-img' src={currentUserDp} alt="" />
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
        </>
    )
}

export default ClickedPost;