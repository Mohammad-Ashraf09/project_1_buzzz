import React from 'react'

const OnlineFriends = () => {

    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const dp = PF+"pic2.jpg"

  return (
    <div className='online-friend'>
        <img className='online-friend-dp' src={dp} alt="" />
        <span className="online-friend-icon-badge"></span>
        <span className='online-friend-name'>Max Dilli</span>
    </div>
  )
}

export default OnlineFriends