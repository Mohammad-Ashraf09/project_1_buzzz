import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import Sugg from './Sugg';

const Suggestion = () => {

    const [clr, setClr] = useState("#000");
    const [following, setFollowing] = useState([]);
    const {user} = useContext(AuthContext);
    
    function changeColorWhite(){
        setClr("#fff");
    }
    function changeColorBlack(){
        setClr("#000");
    }

    useEffect(()=>{
        const fetchFollowings = async() =>{
          const res = await axios.get("users/"+user._id);
          const arr = res.data.followings
          setFollowing(arr);
          //console.log(arr)
        }
        fetchFollowings();
    },[user._id]);

  return (
    <div className='suggestion'>
        <div className="suggestion-wrapper">
            <div className="z">
                <div style={{color: clr}} className="contact-title">Suggestions</div>
                <div onMouseOver={changeColorWhite} onMouseOut={changeColorBlack} className="search-box">
                    <input type="text" className='search-txt' name="" placeholder='Search Suggestions' />
                    <a href="#" className='search-btn'>
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </a>
                </div>
            </div>
            <ul className="suggestion-list">
                {following.map((data)=>(
                    <Sugg key={data} follow={data}/>
                ))}
            </ul>
        </div>
    </div>
  )
}

export default Suggestion