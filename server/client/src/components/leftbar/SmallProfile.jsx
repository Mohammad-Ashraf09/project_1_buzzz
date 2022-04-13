import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import {Link} from "react-router-dom";
import {AuthContext} from "../../context/AuthContext"

const SmallProfile = () => {

    const [admin, setAdmin] = useState({})
    const {user} = useContext(AuthContext);

    useEffect(()=>{
        const fetchAdmin = async() =>{
          const res = await axios.get("users/"+user._id);
          setAdmin(res.data);
          //console.log(res.data)
        }
        fetchAdmin();
    },[user._id]);

    const {fname, lname, username, desc, profilePicture, coverPicture, _id} = admin;
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
    <Link to={`/admin/${_id}`} style={{textDecoration: 'none'}}>
        <div className='small-profile'>
            <div className="small-profile-cover">
                <img src={cover} alt="" className="cover-img" />
                <img src={profile} alt="" className="user-img" />
            </div>
            <div className="small-profile-info">
                <h3 className='small-profile-username'>{fname +' '+ lname}</h3>
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
    </Link>
  )
}

export default SmallProfile