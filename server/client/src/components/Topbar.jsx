import React, { useContext, useEffect, useState } from 'react';
import {Link} from "react-router-dom";
import {AuthContext} from "../context/AuthContext"

const Topbar = ({socket, firstName, lastName, avatar}) => {

    const [notification, setNotification] = useState([]);
    const [open, setOpen] = useState(false);
    const {user} = useContext(AuthContext);
    const {fname, lname, profilePicture, _id} = user;

    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const logo = PF+"images/logo144.png";
    const dp = profilePicture ? PF+profilePicture : PF+"default-dp.png";
    const name = fname +" "+ lname;

    const logoutHandler = () =>{
        const logout = window.confirm("Are you sure, you want to logout?");
        if(logout){
            localStorage.clear();
            window.location.reload();
        }
    }

    useEffect(()=>{
        socket?.on("getNotification", (data)=>{
            console.log(data);
            setNotification((prev)=>[...prev, data]);
        });
    },[socket]);
    
    console.log(notification);

    const displayNotification = ({name, avatar, type})=>{
        // let action;

        // if(type===1)
        //     action="liked"
        // else if(type===2)
        //     action="disliked"
        // else
        //     action="commented"

        return(
            <div className='notification'>
                <img src={PF+avatar} alt="" className="notification-avatar"/>
                {type!=="commented" 
                    ? <div className='notification-text' >{`${name} ${type} your post`}</div>
                    : <div className='notification-text' >{`${name} ${type} on your post`}</div>
                }
            </div>
        )
    }

    const markReadBtnHandler = ()=>{
        setNotification([]);
        setOpen(false);
    }

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
            {/* /messenger */}
                <Link to="/messenger" style={{textDecoration: 'none', color: 'black'}}>
                    <div className="topbar-icon">
                        <i className="fa-brands fa-facebook-messenger"></i>
                        <span className="topbar-icon-badge">1</span>
                    </div>
                </Link>
                <div className="topbar-icon" onClick={()=>setOpen(!open)}>
                    <i className="fa-solid fa-bell"></i>
                    {notification.length > 0 && <span className="topbar-icon-badge">{notification.length}</span>}
                </div>
            </div>
            {/* <Link to="/login" style={{ textDecoration: "none" }}> */}
                <div className="logout-icon" onClick={logoutHandler}>
                    <i className="fa-solid fa-arrow-right-from-bracket"></i>
                    {/* <i class="fa-solid fa-power-off"></i> */}
                </div>
            {/* </Link> */}
        </div>
        
        {open && (
            <div className="notification-div">
                {notification.map((n)=>displayNotification(n))}
                
                {notification.length
                    ? <button className='markReadBtn' onClick={markReadBtnHandler}>Mark as read</button>
                    : <div className="noNotification">No Notification</div>
                }
            </div>
        )}
    </div>
  )
}

export default Topbar