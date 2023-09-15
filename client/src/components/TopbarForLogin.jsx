import React from 'react';

const TopbarForLogin = () => {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const logo = PF+"images/logo144.png";

  return (
      <div className='topbar-container'>
          <img src={logo} alt="" className="logo-img"/>
          <p className="logo-text">Buzzz</p>
      </div>
  )
}

export default TopbarForLogin;