import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';
import {AuthContext} from "../../context/AuthContext"
import ContactPerson from './ContactPerson';

const Contact = ({socket}) => {
    
    const [clr, setClr] = useState("#000");
    const [following, setFollowing] = useState([]);
    const {user} = useContext(AuthContext);
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
          const res = await axios.get("users/"+user._id);
          const arr = res.data.followings                    // array of objects de raha hai ye
          setFollowing(arr);
        }
        fetchFollowings();
    },[user._id]);

    useEffect(()=>{
        socket?.on("getUsers2", (data)=>{
            setOnlineUsers(data);
        });
    },[socket, onlineUsers]);
    //console.log(onlineUsers);
      
  return (
    <div className='contact'>
        <div className="contact-wrapper">
            <div className="z">
                <div style={{color: clr}} className="contact-title">Contacts</div>
                <div onMouseOver={changeColorWhite} onMouseOut={changeColorBlack} className="search-box">
                    <input type="text" className='search-txt' name="" placeholder='Search Contacts' onChange={(e)=>setQuery(e.target.value)} />
                    <a href="#" className='search-btn'>
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </a>
                </div>
            </div>
            <ul className="contact-list">
                {following.filter((x)=>x.name.toLowerCase().includes(query)).map((data)=>(
                    <ContactPerson key={data.id} follow={data} onlineUsers={onlineUsers} />
                ))}
            </ul>
        </div>
    </div>
  )
}

export default Contact;