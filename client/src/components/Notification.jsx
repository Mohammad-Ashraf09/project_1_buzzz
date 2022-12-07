import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'timeago.js';
import ClickedPost from './ClickedPost';

const Notification = ({_id, name, avatar, type, time, postId, senderId, currentUser, background, renderNotification, setRenderNotification}) => {
    const [post, setPost] = useState({});
    const [lik, setLik] = useState(null);
    const [isLiked, setIsLiked] = useState(false);
    const [disLik, setDisLik] = useState(null);
    const [isDisLiked, setIsDisLiked] = useState(false);
    const [clr, setClr] = useState("");
    const [clr2, setClr2] = useState("");
    const [totalComment, setTotalComment] = useState([]);
    const [numberOfComments, setNumberOfComments] = useState(null);
    const [showParticularPost, setShowParticularPost] = useState(false);
    const [nestedCommentLength, setNestedCommentLength] = useState(0);

    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const DP = currentUser?.profilePicture ? PF + currentUser?.profilePicture : PF + "default-dp.png";
    const profileName = currentUser?.fname + ' ' + currentUser?.lname;

    useEffect(()=>{
        const fetchParticularPost = async() =>{
            const res = await axios.get("posts/" + postId);

            setPost(res.data);
            setLik(res.data.likes.length)
            setIsLiked(res.data.likes.includes(currentUser._id));
            setDisLik(res.data.dislikes.length)
            setIsDisLiked(res.data.dislikes.includes(currentUser._id));
            setClr(res.data.likes.includes(currentUser._id) ? "#417af5" : "rgb(108, 104, 104)");
            setClr2(res.data.dislikes.includes(currentUser._id) ? "rgba(252, 5, 5,0.8)" : "rgb(108, 104, 104)");
            setTotalComment(res.data.comments)
            setNumberOfComments(res.data.comments.length)
        }
        fetchParticularPost();
    },[postId]);

    const blurrScreenHandler = ()=>{
        setShowParticularPost(!showParticularPost);
    
        if(!showParticularPost){
          document.body.style.overflow = "hidden";
          document.body.scrollIntoView();
        }
        else
          document.body.style.overflow = "auto";
    }

    const deleteNotificationHandler = async()=>{
        try{
            await axios.delete("notifications/"+ _id);
        }
        catch(err){}
        
        setRenderNotification(!renderNotification);
    }

    return (
        <>
            <div className={`notification ${background}`}>
                {background==="background-dark" && <div className='notification-dot'></div>}
                <Link to={`/user/${senderId}`} style={{textDecoration: 'none'}}> <img src={PF+avatar} alt="" className="notification-avatar"/> </Link>
                <div className='comment-time'>
                    {(type==="liked" || type==="disliked")  ?
                        <div className='notification-text-name' >
                            <Link to={`/user/${senderId}`} style={{textDecoration: 'none', color: 'black'}}>
                                {name}
                            </Link>
                            <span className='notification-text'>{`${type} your`}</span>
                            <span className='clickable-post' onClick={blurrScreenHandler} >post</span>
                        </div>
                        :
                        <div className='notification-text-name' >
                            <Link to={`/user/${senderId}`} style={{textDecoration: 'none', color: 'black'}}>
                                {name}
                            </Link>
                            <span className='notification-text'>{`${type} on your`}</span>
                            <span className='clickable-post' onClick={blurrScreenHandler} >post</span>
                        </div>
                    }
                    <div className="time">
                        {format(time)}
                        <span className='pipe'> | </span>
                        <span className='notification-delete' onClick={deleteNotificationHandler}>
                            <i class="fa-solid fa-trash"></i>
                        </span>
                    </div>
                </div>
                {post.img && <img src={PF+post.img} alt="" className="notification-post-img" onClick={blurrScreenHandler} />}
            </div>

            {showParticularPost && <div className='blurr-div-notification-click'>
                <ClickedPost
                    user={currentUser}
                    currentUser={currentUser}
                    DP={DP}
                    name={profileName}
                    _id={postId}
                    createdAt={post.createdAt} 
                    location={post.location}
                    edited={post.edited}
                    desc={post.desc}
                    taggedFriends={post.taggedFriends}
                    img={post.img}

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
                    showParticularPost={showParticularPost}
                    nestedCommentLength={nestedCommentLength}
                    setNestedCommentLength={setNestedCommentLength}
                    // socket={socket}
                />
            </div>}
        </>
    )
}

export default Notification;