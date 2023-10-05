import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import {Link} from "react-router-dom";
import { AuthContext } from '../context/AuthContext';
import Notification from './Notification';

const Topbar = ({user, socket, setShowPopup}) => {
    const {user:currentUser} = useContext(AuthContext);   // jisne login kiya hua hai wo hai ye
    const [notification, setNotification] = useState([]);           // all the notifications of a particular user
    const [noOfNotifications, setNoOfNotifications] = useState([]);       // this is for number in red badge
    const [noOfNotifications2, setNoOfNotifications2] = useState([]);     // this is for new highlighted notifications
    const [open, setOpen] = useState(false);
    const [renderNotification, setRenderNotification] = useState(false);  // on deletion of a notification state will change

    const dp = user?.profilePicture?.includes('https://') ? user?.profilePicture : `/assets/${user?.profilePicture}`;
    const name = user?.fname +" "+ user?.lname;

    const reverseOrderNotification = [...notification].reverse();
    const newNotifications = reverseOrderNotification.slice(0, noOfNotifications2?.length);
    const oldNotifications = reverseOrderNotification.slice(noOfNotifications2?.length, reverseOrderNotification?.length);

    useEffect(()=>{
        socket?.on("getNotification", (data)=>{
            setNoOfNotifications((prev)=>[...prev, data]);
            setNoOfNotifications2((prev)=>[...prev, data]);
        });
    },[socket]);

    useEffect(()=>{    // for fetching all the notifications of a user
        if(open){
            const fetchNotifications = async()=>{
                try{
                    const res = await axios.get("/notifications/"+currentUser?._id);
                    setNotification(res.data)
                }
                catch(err){}
            }
            fetchNotifications();
        }
    },[open, renderNotification]);
    // to resolve the above dependency error watch this https://www.youtube.com/watch?v=D9W7AFeJ3kk&t=2694s video from 50:15

    useEffect(()=>{           // for fetching number of notifications of a user
        const fetchNotifications = async()=>{
            try{
                const res = await axios.get("/notifications/noOfNotifications/" + currentUser?._id);
                setNoOfNotifications(res.data?.notifications);
                setNoOfNotifications2(res.data?.notifications);
            }
            catch(err){}
        }
        fetchNotifications();
    },[]);

    const notificationIconClickHandler = async()=>{
        setOpen(!open);
        setNoOfNotifications([]);

        if(open)                           // when click for close notification, so that new highlighted notification will normal and treated mark as read
            setNoOfNotifications2([]);
        
        if(noOfNotifications.length){
            try{
                await axios.put("/notifications/noOfNotifications/empty/" + currentUser?._id);      // clearing array in database
            }
            catch(err){}
        }
    }

    const logoutHandler = () =>{
        const logout = window.confirm("Are you sure, you want to logout?");
        if(logout){
            localStorage.clear();
            window.location.href='http://localhost:3000/'
            // window.location.reload();
        }
    }

  return (
    <div className='topbar-container'>
        <div className="topbar-left">
            <Link to="/"> <img src='/assets/logo144.png' alt="" className="logo-img"/> </Link>
            <Link to="/" style={{textDecoration: 'none'}}> <div className="logo-text">Buzzz</div> </Link>
        </div>
        <div className="topbar-right">
            <div className="topbar-user">
                <Link to={`/user/${currentUser?._id}`} style={{textDecoration: 'none'}}>
                    <img src={dp} alt="" className="topbar-img" />
                </Link>
                <Link to={`/user/${currentUser?._id}`} style={{textDecoration: 'none', color: 'black'}}>
                    <div className="topbar-username">{name}</div>
                </Link>
            </div>

            <div className="topbar-icons">
                <Link to={'/messenger'} style={{textDecoration: 'none', color: 'black'}}>
                    <div className="topbar-icon">
                        <i className="fa-brands fa-facebook-messenger"></i>
                        <span className="topbar-icon-badge">1</span>
                    </div>
                </Link>
                <div className="topbar-icon" onClick={notificationIconClickHandler}>
                    <i className="fa-solid fa-bell"></i>
                    {noOfNotifications?.length>0 && <span className="topbar-icon-badge">{noOfNotifications.length}</span>}
                </div>
            </div>
            {/* <div className="logout-icon" onClick={()=>setShowPopup(true)}> */}
            <div className="logout-icon" onClick={logoutHandler}>
                <i className="fa-solid fa-arrow-right-from-bracket"></i>
            </div>
        </div>
        
        {open ? (
            <div className="notification-div">
                {newNotifications.map((notification)=>(
                    <Notification
                        key={notification._id}
                        _id={notification._id}
                        type={notification.type}
                        time={notification.createdAt}
                        postId={notification.postId}
                        senderId={notification.senderId}
                        currentUser={user}
                        background={"background-dark"}
                        renderNotification={renderNotification}
                        setRenderNotification={setRenderNotification}
                    />
                ))}
                {oldNotifications.map((notification)=>(
                    <Notification
                        key={notification._id}
                        _id={notification._id}
                        type={notification.type}
                        time={notification.createdAt}
                        postId={notification.postId}
                        senderId={notification.senderId}
                        currentUser={user}
                        background={"background-normal"}
                        renderNotification={renderNotification}
                        setRenderNotification={setRenderNotification}
                    />
                ))}
            </div>
        ) : null}
    </div>
  )
}

export default Topbar