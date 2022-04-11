import React from 'react'

const Topbar = () => {
  return (
    <div className='topbar-container'>
        <div className="topbar-left">
            <img src="favicons/logo144.png" alt="" className="logo-img" />
            <div className="logo-text">Buzzz</div>
        </div>
        <div className="topbar-right">
            <div className="topbar-user">
                <img src="assets/pic1.jpg" alt="" className="topbar-img" />
                <div className="topbar-username">Mohd Ashraf</div>
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