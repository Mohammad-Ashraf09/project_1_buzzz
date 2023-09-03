import axios from 'axios';
import React, { useState } from 'react'
import {format} from "timeago.js"
import ClickedMedia from './ClickedMedia';

const Message = ({
  userId,
  message,
  setMessages,
  my,
  dp1,
  dp2,
  setIsReply,
  setReplyFor,
  isHideReplyIcon,
  sendingFileInProgress,
  lastPreviewMediaUrl
}) => {
  const [hover, setHover] = useState(false);
  const [showMediaPopup, setShowMediaPopup] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  const {_id, sender, text, media, replyForText, replyForImage, isSameDp, createdAt} = message;

  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const DP1 = PF+dp1;
  const DP2 = PF+dp2;
  let repliedDp;
  if(isSameDp){
    if(sender===userId)
      repliedDp = DP1;
    else
      repliedDp = DP2;
  }
  else{
    if(sender===userId)
      repliedDp = DP2;
    else
      repliedDp = DP1;
  }

  const deleteMessageHandler = async() => {
    const confirm = window.confirm('Are You Sure, want to delete message');
    if(confirm){
      try{
        await axios.delete("/messages/delete/message/"+_id);
      }
      catch(err){
        console.log(err);
      }
      setMessages((prev)=> prev.filter((item)=> item._id !== _id));
    }
  };
  const replyMessageHandler = (index) => {
    setIsReply(true);
    setReplyFor({
      id: _id,
      text: text,
      media: media[index],
      isSameDp: my,
    });
  };
  const imageClickedHandler = (index) => {
    setShowMediaPopup(!showMediaPopup);
    setImageIndex(index)
    if(!showMediaPopup){
      document.body.style.overflow = "hidden";
      document.body.scrollIntoView();
    }
    else
      document.body.style.overflow = "auto";
  }

  return (
    <>
      <div className={my ? "message my" : "message other"}>
        <div className="message-top">
          {!my && <img src={DP2} alt="" className="message-img other-img" />}
          <div className={(replyForText || media?.length) ? "message-text replied" : "message-text"}>
            {(replyForText || replyForImage) && <div className='replied-div'>
              <img className='replied-img' src={repliedDp} alt="" />
              {replyForText ?
                <span className="reply-message-text">{replyForText}</span>
                :
                <>
                  <i className="fa-solid fa-image reply-message-img-icon"></i>
                  <span className="reply-message-text">Photo</span>
                </>
              }
              {replyForImage ? (
                <img className='reply-message-img-right reply-message-image-right' src={replyForImage} alt="" />
              ) : null}
            </div>}

            {media?.length ?
              (media?.length<4 ?
                (media?.length===1 ?
                  <img className='message-image' src={media[0]} alt="" onClick={()=>imageClickedHandler(0)} />   // if length 1
                  :
                  <div
                    className='message-image-two-three'
                    style={{
                      background: `linear-gradient(rgba(4,9,30,0.7), rgba(4,9,30,0.7)), url(${media[0]})`,
                      width: '280px',
                      height: '190px',
                      borderRadius: '6px',
                      backgroundPosition: 'center',
                      backgroundSize: 'cover',
                      cursor: 'pointer',
                    }}
                    onClick={()=>imageClickedHandler(0)}
                  >+ {media?.length-1}</div>   // if length 2,3
                )
                :
                (media?.length===4 ?
                  <div className='message-image-four'>
                    <div className='message-image-four-half'>
                      <img className='message-image image-two-in-line' src={media[0]} alt="" onClick={()=>imageClickedHandler(0)} />
                      <img className='message-image image-two-in-line' src={media[1]} alt="" onClick={()=>imageClickedHandler(1)} />
                    </div>
                    <div className='message-image-four-half'>
                      <img className='message-image image-two-in-line' src={media[2]} alt="" onClick={()=>imageClickedHandler(2)} />
                      <img className='message-image image-two-in-line' src={media[3]} alt="" onClick={()=>imageClickedHandler(3)} />
                    </div>
                  </div>   // if length 4
                  :
                  <div className='message-image-four'>
                    <div className='message-image-four-half'>
                      <img className='message-image image-two-in-line' src={media[0]} alt="" onClick={()=>imageClickedHandler(0)} />
                      <img className='message-image image-two-in-line' src={media[1]} alt="" onClick={()=>imageClickedHandler(1)} />
                    </div>
                    <div className='message-image-four-half'>
                      <img className='message-image image-two-in-line' src={media[2]} alt="" onClick={()=>imageClickedHandler(2)} />
                      <div
                        className='message-image-two-three image-two-in-line'
                        style={{
                          background: `linear-gradient(rgba(4,9,30,0.7), rgba(4,9,30,0.7)), url(${media[3]})`,
                          borderRadius: '6px',
                          backgroundPosition: 'center',
                          backgroundSize: 'cover',
                          cursor: 'pointer',
                        }}
                        onClick={()=>imageClickedHandler(3)}
                      >+ {media?.length-4}</div>
                    </div>
                  </div>   // // if length 5,6,...  
                )
              )
              :
              null
            }

            {text && <p className={replyForText ? "msg-text msg-text-margin-left" : "msg-text"}>{text}</p>}
            {text && <div className="message-time">{format(createdAt)}</div>}
            {(!text && media.length) && <div className="message-time message-time-for-image">{format(createdAt)}</div>}
            {(sendingFileInProgress && media[media?.length-1] === lastPreviewMediaUrl) ? null : (
              <div
                onMouseOver={()=>setHover(true)}
                onMouseOut={()=>setHover(false)}
                className={my ? "message-functionality message-functionality-my" : "message-functionality message-functionality-other"}
              >
                {!hover && <i class="fa-solid fa-ellipsis-vertical"></i>}
                {hover &&<div className='delete-reply-div'>
                  {isHideReplyIcon ? null : (
                    <>
                      <div className='functionality' onClick={()=>replyMessageHandler(0)}><i className="fa-solid fa-reply"></i></div>
                      <div> | </div>
                    </>
                  )}
                  <div className='functionality'><i className="fa-regular fa-face-laugh"></i></div>
                  {my ? (
                    <>
                      <div> | </div>
                      <div className='functionality' onClick={deleteMessageHandler}><i className="fa-solid fa-trash message-delete"></i></div>
                    </>
                  ) : null}
                </div>}
              </div>
            )}
          </div>
          {my && <img src={DP1} alt="" className="message-img my-img" />}
          {(sendingFileInProgress && media[media?.length-1] === lastPreviewMediaUrl) ? (
            <div className='sending-in-progress'><p>sending...</p></div>
          ) : null}
        </div>
      </div>

      {showMediaPopup &&
        <div className='blurr-div'>
          <ClickedMedia setShowMediaPopup={setShowMediaPopup} media={media} imageIndex={imageIndex} replyMessageHandler={replyMessageHandler}/>
        </div>
      }
    </>
  )
}

export default Message;