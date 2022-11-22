import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import {Link} from "react-router-dom";
import {AuthContext} from "../context/AuthContext"
import Notification from './Notification';

const Topbar = ({socket}) => {
    const {user} = useContext(AuthContext);
    const [notification, setNotification] = useState([]);
    const [noOfNotifications, setNoOfNotifications] = useState([]);
    const [noOfNotifications2, setNoOfNotifications2] = useState([]);
    const [open, setOpen] = useState(false);
    const [renderNotification, setRenderNotification] = useState(false);

    const {fname, lname, profilePicture, _id} = user;

    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const logo = PF+"images/logo144.png";
    const dp = profilePicture ? PF+profilePicture : PF+"default-dp.png";
    const name = fname +" "+ lname;

    const reverseOrderNotification = [...notification].reverse();

    const newNotifications = reverseOrderNotification.slice(0, noOfNotifications2.length);
    const oldNotifications = reverseOrderNotification.slice(noOfNotifications2.length, reverseOrderNotification.length);


    const logoutHandler = () =>{
        const logout = window.confirm("Are you sure, you want to logout?");
        if(logout){
            localStorage.clear();
            window.location.reload();
        }
    }

    useEffect(()=>{
        socket?.on("getNotification", (data)=>{
            setNoOfNotifications((prev)=>[...prev, data]);
            setNoOfNotifications2((prev)=>[...prev, data]);
        });
    },[socket]);

    useEffect(()=>{
        if(open){
            const fetchNotifications = async()=>{
                try{
                    const res = await axios.get("notifications/"+_id);
                    setNotification(res.data)
                }
                catch(err){}
            }
            fetchNotifications();
        }
    },[open, renderNotification]);

    useEffect(()=>{
        const fetchNotifications = async()=>{
            try{
                const res = await axios.get("notifications/noOfNotifications/" + _id);
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

        if(open)
            setNoOfNotifications2([]);
        
        if(noOfNotifications.length){
            try{
                await axios.put("notifications/noOfNotifications/empty/" + _id);
            }
            catch(err){}
        }
    }

    let x;
    if(window.innerWidth<768)
        x='/conversations';
    else
        x='/messenger';

  return (
    <div className='topbar-container'>
        <div className="topbar-left">
            <Link to="/"> <img src={logo} alt="" className="logo-img"/> </Link>
            <Link to="/" style={{textDecoration: 'none'}}> <div className="logo-text">Buzzz</div> </Link>
        </div>
        <div className="topbar-right">
            <div className="topbar-user">
                <Link to={`/admin/${_id}`} style={{textDecoration: 'none'}}>
                    <img src={dp} alt="" className="topbar-img" />
                </Link>
                <Link to={`/admin/${_id}`} style={{textDecoration: 'none', color: 'black'}}>
                    <div className="topbar-username">{name}</div>
                </Link>
            </div>

            <div className="topbar-icons">
                <Link to={x} style={{textDecoration: 'none', color: 'black'}}>
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
            <div className="logout-icon" onClick={logoutHandler}>
                <i className="fa-solid fa-arrow-right-from-bracket"></i>
            </div>
        </div>
        
        {open && (
            <div className="notification-div">
                {newNotifications.map((notification)=>(
                    <Notification
                        key={notification._id}
                        _id={notification._id}
                        name={notification.name}
                        avatar={notification.avatar}
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
                        name={notification.name}
                        avatar={notification.avatar}
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
        )}
    </div>
  )
}

export default Topbar