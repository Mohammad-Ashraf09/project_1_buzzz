import { format } from 'timeago.js';
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import NestedComment from './NestedComment';
import { useNavigate } from 'react-router-dom';

// user --> jisne post dali hai
// currentUser --> jisne login kiya hua hai
const Comment = ({
    commentId,
    user,
    currentUser,
    numberOfComments,
    setNumberOfComments,
    setTotalComment,
    replyCommentHandler,
    nestedCommentLength,
    editCommentHandler,
    editDone,
    setNumberOfCommentsForPopupPost,
    showParticularPost,
    replyCommentHandlerForParticularPost,
    editCommentHandlerForParticularPost,
    _id
}) => {
    const [particularComment, setParticularComment] = useState({});
    const [commentUser, setCommentUser] = useState({});
    const [noOfLikes, setNoOfLikes] = useState(null);
    const [isLiked, setIsLiked] = useState(false);
    const [clr, setClr] = useState("#000");
    const [nestedComments, setNestedComments] = useState([]);
    const [hover, setHover] = useState(false);
    const navigate = useNavigate();
    
    useEffect(()=>{
        const fetchParticularComment = async() =>{
            const res = await axios.get("/posts/"+ _id +"/comment/"+ commentId);

            setParticularComment(res.data);
            setIsLiked(res.data?.commentLikes.includes(currentUser._id));
            setNoOfLikes(res.data?.commentLikes.length);
            setClr(res.data?.commentLikes.includes(currentUser._id) ? "#417af5" : "#000");
            setNestedComments(res.data.nestedComments);
        }
        fetchParticularComment();
    },[numberOfComments, nestedCommentLength, editDone]);

    useEffect(()=>{
        const fetchUser = async() =>{
            const res = await axios.get(`/users/${particularComment?.id}`);
            setCommentUser(res.data);
          }
          fetchUser();
    },[particularComment]);

    const likeCommentHandler = async() =>{
        try{
            await axios.put("/posts/"+ _id +"/comment/"+ particularComment?.commentId + "/like", {userId: currentUser._id});

            setNoOfLikes(isLiked ? noOfLikes-1 : noOfLikes+1);
            setIsLiked(!isLiked);
            
            if(isLiked)
                setClr("#000");
            else
                setClr("#417af5");

            // notificationHandler("commented");
        }
        catch(err){}
    }

    const deleteCommentHandler = async() =>{
        try{
            console.log(particularComment.commentId)
            const remove = window.confirm("Are you sure, you want to remove this comment?");
            if(remove){
                console.log(particularComment.commentId)
                await axios.put("/posts/"+ _id +"/comment/"+ particularComment?.commentId);
                console.log(particularComment.commentId)
                setNumberOfComments(numberOfComments-1);
                console.log(particularComment.commentId)
                if(showParticularPost)
                    setNumberOfCommentsForPopupPost(numberOfComments-1);
                console.log(particularComment.commentId)
                setTotalComment((prev)=> prev.filter((item)=> item.commentId !== particularComment?.commentId))
                console.log(particularComment.commentId)

                // notificationHandler("commented");
            }
        }
        catch(err){}
    }

    const clickHandler = async() =>{
        document.body.style.overflow = "auto";
        navigate(`/user/${particularComment.id}`);
    }

    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const DP = commentUser?.profilePicture ? PF+commentUser?.profilePicture : PF+"default-dp.png";
    const name = commentUser?.fname + " " + commentUser?.lname;

    return (
        <div onMouseOver={()=>setHover(true)} onMouseOut={()=>setHover(false)}>
            <div className="comment-list">
                <div className="comment-top-left">
                    <img src={DP} alt="" className="comment-list-profile-img" onClick={clickHandler}/>
                    <span className="comment-username-date">
                        <div className="comment-username"  onClick={clickHandler}> {name} </div>
                        <div className="comment-date"> {format(particularComment?.date)} </div>
                    </span>
                </div>
            </div>
            <div className="comment-caption"> {particularComment?.comment} </div>
            <div className='comment-caption-icon'>

                <div className='caption-icon' onClick={likeCommentHandler}>
                    {clr==="#417af5" 
                        ? <i class="fa-solid fa-thumbs-up solid-thumbs-ups" style={{color:clr}}></i>
                        : <i class="fa-regular fa-thumbs-up"></i>
                    }
                    {noOfLikes>0 && <span style={{marginLeft: "5px"}}>{noOfLikes}</span>}
                </div>

                {showParticularPost ?
                    <div className='caption-icon onHover' style={{display: hover && 'block'}} onClick={()=>replyCommentHandlerForParticularPost(commentId, particularComment.name, particularComment.id)}>
                        <i class="fa-solid fa-reply"></i>
                    </div> :
                    <div className='caption-icon onHover' style={{display: hover && 'block'}} onClick={()=>replyCommentHandler(commentId, particularComment.name, particularComment.id)}>
                        <i class="fa-solid fa-reply"></i>
                    </div>
                }

                {showParticularPost ?
                    (currentUser._id===particularComment?.id &&
                        <div className='caption-icon onHover'style={{display: hover && 'block'}} onClick={()=>editCommentHandlerForParticularPost(commentId, particularComment.comment)}>
                            <i class="fa-solid fa-pen"></i>
                        </div>
                    ) :
                    (currentUser._id===particularComment?.id &&
                        <div className='caption-icon onHover'style={{display: hover && 'block'}} onClick={()=>editCommentHandler(commentId, particularComment.comment)}>
                            <i class="fa-solid fa-pen"></i>
                        </div>
                    )
                }

                {(user._id===currentUser._id || particularComment?.id===currentUser._id) &&
                    <div className='caption-icon trash onHover'style={{display: hover && 'block'}} onClick={deleteCommentHandler}>
                        <i class="fa-solid fa-trash"></i>
                    </div>
                }
            </div>

            {nestedComments.map((nestedComment)=>(
                <NestedComment
                    key={nestedComment.nestedCommentId}
                    user={user}
                    currentUser={currentUser}
                    postId={_id}
                    commentId={commentId}
                    nestedComment={nestedComment}
                    nestedCommentLength={nestedCommentLength}
                />
            ))}
        </div>
    )
}

export default Comment