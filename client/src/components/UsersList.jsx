import React from 'react';
import { Link } from 'react-router-dom';

const UsersList = (data) => {

    const {_id, username, name, profilePicture} = data?.data;
    const dp = profilePicture?.includes('https://') ? profilePicture : `/assets/${profilePicture}`;

    return (
        <div className="search-result">
            <Link to={`/user/${_id}`} style={{textDecoration: 'none'}}>
                <div className='chat-area-topbar-name-and-dp'>
                    <img className='online-friend-dp' src={dp} alt="" />
                    <div className=''>
                        <p className='chat-area-topbar-name'>{name}</p>
                        <p className='chat-area-topbar-username'>{username}</p>
                    </div>
                </div>
            </Link>
        </div>
    )
}

export default UsersList;