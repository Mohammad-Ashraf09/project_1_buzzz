import { format } from 'timeago.js';
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// user --> jisne post dali hai
// currentUserId --> jisne login kiya hua hai uski id
const NestedComment = ({
    user,
    currentUserId,
    postId,
    commentId,
    nestedComment,
    setNestedComments,
    replyNestedCommentHandler,
    showParticularPost,
    replyNestedCommentHandlerForParticularPost,
}) => {
    const [particularNestedComment, setParticularNestedComment] = useState({});
    const [nestedCommentUser, setNestedCommentUser] = useState({});
    const [noOfLikes, setNoOfLikes] = useState(null);
    const [isLiked, setIsLiked] = useState(false);
    const [clr, setClr] = useState("#000");

    const [textBeforeTag, setTextBeforeTag] = useState("");
    const [tagName, setTagName] = useState("");
    const [textAfterTag, setTextAfterTag] = useState("");
    const [tagId, setTagId] = useState("");
    const navigate = useNavigate();

    useEffect(()=>{
        const tagNameRefactor = async() =>{
            let id = "";
            for(let i=0; i<nestedComment?.nestedComment.length; i++){
                if(nestedComment?.nestedComment[i]==='@'){
                    setTextBeforeTag(nestedComment?.nestedComment.substr(0,i));
                    id = nestedComment?.nestedComment.substr(i+1, 24);
                    setTagId(nestedComment?.nestedComment.substr(i+1, 24));
                    setTextAfterTag(nestedComment?.nestedComment.substr(i+25));
                }
            }
            const res = await axios.get(`/users/${id}`);
            setTagName("@" + res.data.fname + " " + res.data.lname)
        }
        tagNameRefactor();
    },[]);
    
    useEffect(()=>{
        const fetchParticularNestedComment = async() =>{
            const res = await axios.get("/posts/"+ postId +"/comment/"+ commentId + "/reply/" + nestedComment.nestedCommentId);
            // console.log(res.data)

            setParticularNestedComment(res.data);
            setIsLiked(res.data?.nestedCommentLikes.includes(currentUserId));
            setNoOfLikes(res.data?.nestedCommentLikes.length);
            setClr(res.data?.nestedCommentLikes.includes(currentUserId) ? "#417af5" : "#000");
        }
        fetchParticularNestedComment();
    },[]);

    useEffect(()=>{
        const fetchUser = async() =>{
            const res = await axios.get(`/users/${particularNestedComment?.nestedId}`);
            setNestedCommentUser(res.data);
          }
          fetchUser();
    },[particularNestedComment]);

    const likeCommentHandler = async() =>{
        try{
            await axios.put("posts/"+ postId +"/comment/"+ commentId + "/like/" + particularNestedComment?.nestedCommentId + "/nestedLike/", {userId: currentUserId});

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
            const remove = window.confirm("Are you sure, you want to remove this comment?");
            if(remove){
                await axios.put("posts/"+ postId +"/comment/"+ commentId +  "/removeNestedComment/", {nestedCommentId: particularNestedComment?.nestedCommentId});
                // setNumberOfComments(numberOfComments-1);
                setNestedComments((prev)=> prev.filter((item)=> item.nestedCommentId !== particularNestedComment?.nestedCommentId))

                // notificationHandler("commented");
            }
        }
        catch(err){}
    }

    const clickHandler = async(type) =>{
        document.body.style.overflow = "auto";
        if(type==='1')
            navigate(`/user/${particularNestedComment.nestedId}`);
        else
            navigate(`/user/${tagId}`);
    }

    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const DP = nestedCommentUser?.profilePicture?.includes('https://') ? nestedCommentUser?.profilePicture : PF+nestedCommentUser?.profilePicture;
    const name = nestedCommentUser?.fname + " " + nestedCommentUser?.lname;

    return (
        <>
            <div className="nested-comment-top-left">
                <img src={DP} alt="" className="nested-comment-list-profile-img" onClick={()=>clickHandler('1')}/>
                <span className="nested-comment-username-date">
                    <div className="nested-comment-username" onClick={()=>clickHandler('1')}> {name} </div>
                    <div className="nested-comment-date"> {format(nestedComment?.date)} </div>
                </span>
            </div>
            <div className="nested-comment-caption">
                {tagId ?
                    <>
                        {textBeforeTag}
                        <span className='nested-comment-tag'  onClick={()=>clickHandler('2')}>{tagName}</span>
                        <span>{textAfterTag}</span>
                    </>
                    :
                    <>{nestedComment?.nestedComment}</>
                }
            </div>
            <div className='nested-comment-caption-icon'>
                <div className='caption-icon' onClick={likeCommentHandler} >
                    {clr==="#417af5" 
                        ? <i class="fa-solid fa-thumbs-up solid-thumbs-ups" style={{color:clr}}></i>
                        : <i class="fa-regular fa-thumbs-up"></i>
                    }
                    {noOfLikes>0 && <span style={{marginLeft: "5px"}}>{noOfLikes}</span>}
                </div>

                {showParticularPost ?
                    (currentUserId!==particularNestedComment?.nestedId &&
                        <div className='caption-icon'
                            onClick={()=>
                                replyNestedCommentHandlerForParticularPost(
                                    commentId,
                                    nestedCommentUser.fname + " " + nestedCommentUser.lname,
                                    particularNestedComment.nestedId
                                )
                            }>
                            <i class="fa-solid fa-reply"></i>
                        </div>
                    ) :
                    (currentUserId!==particularNestedComment?.nestedId &&
                        <div className='caption-icon'
                            onClick={()=>
                                replyNestedCommentHandler(
                                    commentId,
                                    nestedCommentUser.fname + " " + nestedCommentUser.lname,
                                    particularNestedComment.nestedId
                                )
                            }>
                            <i class="fa-solid fa-reply"></i>
                        </div>
                    )
                }

                {(user._id===currentUserId || particularNestedComment?.nestedId===currentUserId) &&
                    <div className='caption-icon trash' onClick={deleteCommentHandler}>
                        <i class="fa-solid fa-trash"></i>
                    </div>
                }
            </div>
        </>
    )
}

export default NestedComment;