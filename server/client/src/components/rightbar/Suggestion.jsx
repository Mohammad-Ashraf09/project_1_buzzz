import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {Users} from '../../DummyData';
import Sugg from './Sugg';
import SuggestionPerson from './SuggestionPerson';

const Suggestion = () => {

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