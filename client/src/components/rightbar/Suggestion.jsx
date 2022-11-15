import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import Sugg from './Sugg';

const Suggestion = ({socket}) => {

    const [clr, setClr] = useState("#000");
    const [allUsers, setAllUsers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const {user} = useContext(AuthContext);
    const [query, setQuery] = useState("");

    useEffect(()=>{
        const fetchFollowings = async() =>{
            const res = await axios.get("users/"+user._id);
            const arr = res.data.followings;
            setFollowing(arr);
            //console.log(arr)
        }
        fetchFollowings();
    },[user._id]);

    useEffect(()=>{
        const fetchAllUsers = async() =>{
            const res = await axios.get("users/");
            const arr = res.data
            setAllUsers(arr);
            //console.log(res.data)
        }
        fetchAllUsers();
    },[]);

    useEffect(()=>{
        socket?.on("getUsers2", (data)=>{
            setOnlineUsers(data);
        });
    },[socket, onlineUsers]);
    // console.log(onlineUsers);

    function changeColorWhite(){
        setClr("#fff");
    }
    function changeColorBlack(){
        setClr("#000");
    }

    // console.log(allUsers);

  return (
    <div className='suggestion'>
        <div className="suggestion-wrapper">
            <div className="z">
                <div style={{color: clr}} className="contact-title">Suggestions</div>
                <div onMouseOver={changeColorWhite} onMouseOut={changeColorBlack} className="search-box">
                    <input type="text" className='search-txt' name="" placeholder='Search Suggestions' onChange={(e)=>setQuery(e.target.value)} />
                    <a href="#" className='search-btn'>
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </a>
                </div>
            </div>
            <ul className="suggestion-list">
                {allUsers.filter((x)=>x.fname.toLowerCase().includes(query)).map((data)=>(
                    <Sugg key={data._id} users={data} myFollowings={following} onlineUsers={onlineUsers} />
                ))}
            </ul>
        </div>
    </div>
  )
}

export default Suggestion;