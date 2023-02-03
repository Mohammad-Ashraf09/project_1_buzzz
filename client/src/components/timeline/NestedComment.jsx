import { format } from 'timeago.js';
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom';

// user --> jisne post dali hai
// currentUser --> jisne login kiya hua hai
const NestedComment = ({user, currentUser, postId, commentId, nestedComment, nestedCommentLength}) => {
    const [particularNestedComment, setParticularNestedComment] = useState({});
    const [noOfLikes, setNoOfLikes] = useState(null);
    const [isLiked, setIsLiked] = useState(false);
    const [clr, setClr] = useState("#000");

    const [textBeforeTag, setTextBeforeTag] = useState("");
    const [tagName, setTagName] = useState("");
    const [textAfterTag, setTextAfterTag] = useState("");
    const [tagId, setTagId] = useState("");

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
    // console.log(textBeforeTag);
    // console.log(tagName);
    // console.log(textAfterTag);
    // console.log(tagId);
    
    useEffect(()=>{
        const fetchParticularNestedComment = async() =>{
            const res = await axios.get("/posts/"+ postId +"/comment/"+ commentId + "/reply/" + nestedComment.nestedCommentId);
            // console.log(res.data)

            setParticularNestedComment(res.data);
            setIsLiked(res.data?.nestedCommentLikes.includes(currentUser._id));
            setNoOfLikes(res.data?.nestedCommentLikes.length);
            setClr(res.data?.nestedCommentLikes.includes(currentUser._id) ? "#417af5" : "#000");
        }
        fetchParticularNestedComment();
    },[]);

    const likeCommentHandler = async() =>{
        try{
            await axios.put("posts/"+ postId +"/comment/"+ commentId + "/like/" + particularNestedComment?.nestedCommentId + "nestedLike", {userId: currentUser._id});

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
                await axios.put("posts/"+ postId +"/comment/"+ commentId +  "/nestedComment/"+ particularNestedComment?.nestedCommentId);
                // setNumberOfComments(numberOfComments-1);
                // setTotalComment((prev)=> prev.filter((item)=> item.commentId !== particularComment?.commentId))

                // notificationHandler("commented");
            }
        }
        catch(err){}
    }

    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const DP = nestedComment?.nestedDp ? PF+nestedComment?.nestedDp : PF+"default-dp.png";

    return (
        <>
            <div className="nested-comment-list">
                <div className="comment-top-left">
                    <Link to={`/user/${particularNestedComment.nestedId}`} style={{textDecoration: 'none', color:'black'}}>
                        <img src={DP} alt="" className="nested-comment-list-profile-img" />
                    </Link>
                    <span className="nested-comment-username-date">
                        <Link to={`/user/${particularNestedComment.nestedId}`} style={{textDecoration: 'none', color:'black'}}>
                            <div className="nested-comment-username"> {nestedComment?.nestedName} </div>
                        </Link>
                        <div className="nested-comment-date"> {format(nestedComment?.date)} </div>
                    </span>
                </div>
            </div>
            <div className="nested-comment-caption">
                {tagId ?
                    <>
                        {textBeforeTag}
                        <Link to={`/user/${tagId}`} style={{textDecoration: 'none', color:'black'}}>
                            <span className='nested-comment-tag'>{tagName}</span>
                        </Link>
                        <span>{textAfterTag}</span>
                    </>
                    :
                    <>{nestedComment?.nestedComment}</>
                }
            </div>
            <div className='nested-comment-caption-icon'>
                {/* <div className='caption-icon' 
                // onClick={likeCommentHandler}
                >
                    {clr==="#417af5" 
                        ? <i class="fa-solid fa-thumbs-up solid-thumbs-ups" style={{color:clr}}></i>
                        : <i class="fa-regular fa-thumbs-up"></i>
                    }
                    {noOfLikes>0 && <span style={{marginLeft: "5px"}}>{noOfLikes}</span>}
                </div>
                <div className='caption-icon'><i class="fa-solid fa-reply"></i></div> */}
                {/* {currentUser._id===particularComment?.id && <div className='caption-icon'><i class="fa-solid fa-pen"></i></div>}
                {(user._id===currentUser._id || particularComment?.id===currentUser._id)  && <div className='caption-icon trash' onClick={deleteCommentHandler}><i class="fa-solid fa-trash"></i></div>} */}
                {/* <div className='caption-icon'><i class="fa-solid fa-pen"></i></div>
                <div className='caption-icon trash'><i class="fa-solid fa-trash"></i></div> */}
            </div>
        </>
    )
}

export default NestedComment;