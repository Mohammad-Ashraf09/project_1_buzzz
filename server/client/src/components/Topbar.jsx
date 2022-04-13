import React, { useContext } from 'react';
import {Link} from "react-router-dom";
import {AuthContext} from "../context/AuthContext"

const Topbar = () => {

    const {user} = useContext(AuthContext);
    const {fname, lname, profilePicture, _id} = user;

    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const logo = PF+"images/logo144.png";
    const dp = profilePicture ? PF+profilePicture : PF+"default-dp.png";
    const name = fname +" "+ lname;

  return (
    <div className='topbar-container'>
        <div className="topbar-left">
            <Link to="/"> <img src={logo} alt="" className="logo-img"/> </Link>
            <Link to="/" style={{textDecoration: 'none'}}> <div className="logo-text">Buzzz</div> </Link>
        </div>
        <div className="topbar-right">
            <div className="topbar-user">
                <Link to={`/admin/${_id}`} style={{textDecoration: 'none'}}>
                    <img src={dp} alt="" className="topbar-img" />
                </Link>
                <Link to={`/admin/${_id}`} style={{textDecoration: 'none', color: 'black'}}>
                    <div className="topbar-username">{name}</div>
                </Link>
            </div>
            <div className="topbar-icons">
                <div className="topbar-icon">
                    <i className="fa-brands fa-facebook-messenger"></i>
                    <span className="topbar-icon-badge">1</span>
                </div>
                <div className="topbar-icon">
                    <i className="fa-solid fa-user-check"></i>
                    <span className="topbar-icon-badge">2</span>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Topbar