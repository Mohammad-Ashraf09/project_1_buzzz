import React from 'react';
import {Link} from "react-router-dom";

const TopbarForLogin = () => {

    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const logo = PF+"images/logo144.png";

  return (
    <div>
        <div className='topbar-container'>
            <div className="topbar-left">
                <Link to="/"> <img src={logo} alt="" className="logo-img"/> </Link>
                <Link to="/" style={{textDecoration: 'none'}}> <div className="logo-text">Buzzz</div> </Link>
            </div>
            <div className="topbar-right">
                
            </div>
        </div>
    </div>
  )
}

export default TopbarForLogin;