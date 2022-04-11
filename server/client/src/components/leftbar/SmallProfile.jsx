import axios from 'axios';
import React, { useEffect, useState } from 'react'

const SmallProfile = () => {

    const [admin, setAdmin] = useState({})

    useEffect(()=>{
        const fetchAdmin = async() =>{
          const res = await axios.get("users/625400bc00575a0301756870");
          setAdmin(res.data);
          //console.log(res.data)
        }
        fetchAdmin();
    },[]);

    const {username, desc, profilePicture, coverPicture} = admin;
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;

    if(coverPicture==="")
        var cover = PF+"default-cover.jpg";
    else
        var cover = PF+coverPicture;

    if(profilePicture==="")
        var profile = PF+"default-profile.png";
    else
        var profile = PF+profilePicture;

  return (
    <div className='small-profile'>
        <div className="small-profile-cover">
            <img src={cover} alt="" className="cover-img" />
            <img src={profile} alt="" className="user-img" />
        </div>
        <div className="small-profile-info">
            <h3 className='small-profile-username'>{username}</h3>
            <h5 className='small-profile-desc'>{desc}</h5>
            <div className="small-profile-data">
                <div className="small-profile-data1">
                    <div className="small-profile-number">234</div>
                    <div className="small-profile-text">Profile Views</div>
                </div>
                <div className="small-profile-data2">
                    <div className="small-profile-number">10</div>
                    <div className="small-profile-text">Post</div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default SmallProfile