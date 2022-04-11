import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Cont from './Cont';
import ContactPerson from './ContactPerson';

const Contact = () => {
    
    const [clr, setClr] = useState("#000");
    const [following, setFollowing] = useState([]);

    
    function changeColorWhite(){
        setClr("#fff");
    }
    function changeColorBlack(){
        setClr("#000");
    }

    useEffect(()=>{
        const fetchFollowings = async() =>{
          const res = await axios.get("users/625400bc00575a0301756870");
          const arr = res.data.followings
          setFollowing(arr);
          //console.log(arr)
        }
        fetchFollowings();
    },[]);
      
  return (
    <div className='contact'>
        <div className="contact-wrapper">
            <div className="z">
                <div style={{color: clr}} className="contact-title">Contacts</div>
                <div onMouseOver={changeColorWhite} onMouseOut={changeColorBlack} className="search-box">
                    <input type="text" className='search-txt' name="" placeholder='Search Contacts' />
                    <a href="#" className='search-btn'>
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </a>
                </div>
            </div>
            <ul className="contact-list">
                {following.map((data)=>(
                    <Cont key={data} follow={data}/>
                ))}
            </ul>
        </div>
    </div>
  )
}

export default Contact