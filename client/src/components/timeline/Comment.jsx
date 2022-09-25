import { format } from 'timeago.js';
import React from 'react'

const Comment = ({cmnt}) => {

    const {dp, name, comment, date} = cmnt;

    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const DP = dp ? PF+dp : PF+"default-dp.png";

  return (
    <>
        <div className="comment-list">
            <div className="comment-top-left">
                <img src={DP} alt="" className="comment-list-profile-img" />
                <span className="comment-username-date">
                    <div className="comment-username"> {name} </div>
                    <div className="comment-date"> {format(date)} </div>
                </span>
            </div>
            <div className="comment-3-dots">
                <i className="fa-solid fa-ellipsis"></i>
            </div>
        </div>
        <div className="comment-caption"> {comment} </div>
    </>
  )
}

export default Comment