import axios from 'axios';
import React, { useState, useEffect } from 'react';
import ContactPerson from './ContactPerson';

const Contact = ({user, isUserProfile, socket}) => {
    const [clr, setClr] = useState("#000");
    const [following, setFollowing] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [query, setQuery] = useState("");

    function changeColorWhite(){
        setClr("#fff");
    }
    function changeColorBlack(){
        setClr("#000");
    }

    useEffect(()=>{
        const fetchFollowings = async() =>{
          const res = await axios.get("/users/"+user?._id);
          setFollowing(res.data.followings);
        }
        fetchFollowings();
    },[user?._id]);

    useEffect(()=>{
        socket?.on("getUsers1", (data)=>{
            setOnlineUsers(data);
        });
    },[socket, onlineUsers]);
      
    return (
        <div className={isUserProfile ? "user-profile-contact" : "contact" }>
            <div className={isUserProfile ? "user-profile-z" : "z" }>
                <div style={{color: clr}} className="contact-title">Contacts</div>
                <div onMouseOver={changeColorWhite} onMouseOut={changeColorBlack} className="search-box">
                    <input type="text" className={isUserProfile ? "user-profile-search-txt" : "search-txt" } name="" placeholder='Search Contacts' onChange={(e)=>setQuery(e.target.value)} />
                    <a href="#" className={isUserProfile ? "user-profile-search-btn" : "search-btn" }>
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </a>
                </div>
            </div>
            <div className={isUserProfile ? "user-profile-contact-wrapper" : "contact-wrapper" }>
                <ul className="contact-list">
                    {following.filter((x)=>x.name?.toLowerCase().includes(query)).map((friend)=>(
                        <ContactPerson key={friend.id} friend={friend} onlineUsers={onlineUsers} />
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default Contact;