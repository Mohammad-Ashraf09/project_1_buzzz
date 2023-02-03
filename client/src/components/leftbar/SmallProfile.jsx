import React, { useContext } from 'react'
import {Link} from "react-router-dom";
import {AuthContext} from "../../context/AuthContext"

const SmallProfile = () => {
    const {user} = useContext(AuthContext);

    const {fname, lname, bio, profilePicture, coverPicture, followings, followers, totalPosts, _id} = user;
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;

    const profile = profilePicture ? PF + profilePicture : PF + "default-dp.png";
    const cover = coverPicture ? PF + coverPicture : PF + "default-cover.jpg";

    return (
        <div className='small-profile'>
            <Link to={`/user/${_id}`} style={{textDecoration: 'none'}}>
                <div className="small-profile-cover">
                    <img src={cover} alt="" className="cover-img" />
                    <img src={profile} alt="" className="user-img" />
                </div>
                <div className="small-profile-info">
                    <h3 className='small-profile-username'>{fname +' '+ lname}</h3>
                    <h5 className='small-profile-desc'>{bio}</h5>
                    <div className="small-profile-data">
                        <div className="small-profile-data1">
                            <div className="small-profile-number">{followings.length}</div>
                            <div className="small-profile-text">Followings</div>
                        </div>
                        <div className="small-profile-data1">
                            <div className="small-profile-number">{followers.length}</div>
                            <div className="small-profile-text">Followers</div>
                        </div>
                        <div className="small-profile-data2">
                            <div className="small-profile-number">{totalPosts}</div>
                            <div className="small-profile-text">Post</div>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    )
}

export default SmallProfile