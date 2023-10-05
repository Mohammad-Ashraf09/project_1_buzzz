import axios from 'axios';
import React, { useEffect, useState } from 'react'
import {format} from "timeago.js"
import ClickedMedia from './ClickedMedia';
import ReactPlayer from 'react-player';
import { ref, deleteObject } from "firebase/storage";
import { storage } from "../firebase";

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
  const [VideoContain, setVideoContain] = useState(0);

  const {_id, sender, text, media, replyForText, replyForImage, isSameDp, createdAt} = message;

  const DP1 = dp1;
  const DP2 = dp2;
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
  const playIcon = "/assets/play-icon.png";

  useEffect(()=>{
    let count = 0;
    media?.map((item)=>{
      if(item?.isVideo) count += 1;
    })
    setVideoContain(count);
  },[]);

  const deleteMessageHandler = async() => {
    const confirm = window.confirm('Are You Sure, want to delete message');
    if(confirm){
      try{
        await axios.delete("/messages/delete/message/"+_id);
      }
      catch(err){
        console.log(err);
      }

      media?.map(item=>{
        const st1 = item?.url.split('/o/')[1]
        const imgName = st1.split('?alt')[0]
        const storageRef = ref(storage, imgName);
  
        deleteObject(storageRef).then(() => {
          console.log('file deleted--------------', storageRef)
        }).catch((error) => {
            console.log(error)
        });
      })  // to delete files from firebase

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
        <div>
          <div className='message-and-user-image'>
            {!my && <img src={DP2} alt="" className="message-img other-img" />}
            <div className={(replyForText || media?.length) ? "message-text replied" : "message-text"}>
              {(replyForText || replyForImage) && <div className='replied-div'>
                <img className='replied-img' src={repliedDp} alt="" />
                {replyForText ?
                  <span className="reply-message-text">{replyForText}</span>
                  :
                  <>
                    <i className="fa-solid fa-image reply-message-img-icon"></i>
                    {(replyForImage?.isVideo) ?
                      <span className="reply-message-text">Video</span>
                      :
                      <span className="reply-message-text">Photo</span>
                    }
                  </>
                }
                {replyForImage ? (
                  (replyForImage?.isVideo) ?
                    <div className='reply-message-image-right reply-message-img-right'>
                      <ReactPlayer
                        url={replyForImage?.url}
                        muted={true}
                        playing={false}
                        height='100%'
                        width="36px"
                        className='video'
                      />
                    </div>
                    :
                    <img className='reply-message-img-right reply-message-image-right' src={replyForImage?.url} alt="" />
                ) : null}
              </div>}

              {media?.length ?
                (media?.length<4 ?
                  (media?.length===1 ?
                    ((media[0]?.isVideo) ?
                      <div className='video-player-wrapper single' onClick={()=>imageClickedHandler(0)}>
                        <ReactPlayer
                          url={media[0]?.url}
                          // light={true}
                          // light='https://firebasestorage.googleapis.com/v0/b/buzzz-app-c5646.appspot.com/o/1693671831540-pexels-irina-iriser-673803.jpg?alt=media&token=16fce18e-40d8-4237-b293-abaaae65d925'
                          // playIcon={<button>Play</button>}
                          muted={true}
                          playing={false}
                          // controls
                          height='auto'
                          width="100%"
                          className='single-video'
                        />
                        <div className='control-container'><img className='play-icon' src={playIcon} alt="" /></div>
                      </div>
                      :
                      <img className='message-image' src={media[0]?.url} alt="" onClick={()=>imageClickedHandler(0)} />  // if length 1
                    )
                    :
                    ((media[0]?.isVideo) ?
                      <div className='video-player-wrapper double-tripple' onClick={()=>imageClickedHandler(0)}>
                        <ReactPlayer
                          url={media[0]?.url}
                          muted={true}
                          playing={false}
                          height='auto'
                          width="100%"
                          className='double-tripple-video'
                        />
                        <div className='control-container'>+ {media?.length-1}</div>
                      </div>
                      :
                      <div
                        className='message-image-two-three'
                        style={{
                          background: `linear-gradient(rgba(4,9,30,0.7), rgba(4,9,30,0.7)), url(${media[0]?.url})`,
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
                  )
                  :
                  (media?.length===4 ?
                    <div className='message-image-four'>
                      <div className='message-image-four-half'>
                        {(media[0]?.isVideo) ?
                          <div className='video-player-wrapper four' onClick={()=>imageClickedHandler(0)}>
                            <ReactPlayer
                              url={media[0]?.url}
                              muted={true}
                              playing={false}
                              height='138px'
                              width="138px"
                              className='four-video'
                            />
                            <div className='control-container'><img className='play-icon play-icon-small' src={playIcon} alt="" /></div>
                          </div>
                          :
                          <img className='message-image image-two-in-line' src={media[0]?.url} alt="" onClick={()=>imageClickedHandler(0)} />
                        }
                        {(media[1]?.isVideo) ?
                          <div className='video-player-wrapper four' onClick={()=>imageClickedHandler(1)}>
                            <ReactPlayer
                              url={media[1]?.url}
                              muted={true}
                              playing={false}
                              height='138px'
                              width="138px"
                              className='four-video'
                            />
                            <div className='control-container'><img className='play-icon play-icon-small' src={playIcon} alt="" /></div>
                          </div>
                          :
                          <img className='message-image image-two-in-line' src={media[1]?.url} alt="" onClick={()=>imageClickedHandler(1)} />
                        }
                      </div>
                      <div className='message-image-four-half'>
                        {(media?.[2]?.isVideo) ?
                          <div className='video-player-wrapper four' onClick={()=>imageClickedHandler(2)}>
                            <ReactPlayer
                              url={media[2]?.url}
                              muted={true}
                              playing={false}
                              height='138px'
                              width="138px"
                              className='four-video'
                            />
                            <div className='control-container'><img className='play-icon play-icon-small' src={playIcon} alt="" /></div>
                          </div>
                          :
                          <img className='message-image image-two-in-line' src={media[2]?.url} alt="" onClick={()=>imageClickedHandler(2)} />
                        }
                        {(media[3]?.isVideo) ?
                          <div className='video-player-wrapper four' onClick={()=>imageClickedHandler(3)}>
                            <ReactPlayer
                              url={media[3]?.url}
                              muted={true}
                              playing={false}
                              height='138px'
                              width="138px"
                              className='four-video'
                            />
                            <div className='control-container'><img className='play-icon play-icon-small' src={playIcon} alt="" /></div>
                          </div>
                          :
                          <img className='message-image image-two-in-line' src={media[3]?.url} alt="" onClick={()=>imageClickedHandler(3)} />
                        }
                      </div>
                    </div>   // if length 4
                    :
                    <div className='message-image-four'>
                      <div className='message-image-four-half'>
                        {(media[0]?.isVideo) ?
                          <div className='video-player-wrapper four' onClick={()=>imageClickedHandler(0)}>
                            <ReactPlayer
                              url={media[0]?.url}
                              muted={true}
                              playing={false}
                              height='138px'
                              width="138px"
                              className='four-video'
                            />
                            <div className='control-container'><img className='play-icon play-icon-small' src={playIcon} alt="" /></div>
                          </div>
                          :
                          <img className='message-image image-two-in-line' src={media[0]?.url} alt="" onClick={()=>imageClickedHandler(0)} />
                        }
                        {(media[1]?.isVideo) ?
                          <div className='video-player-wrapper four' onClick={()=>imageClickedHandler(1)}>
                            <ReactPlayer
                              url={media[1]?.url}
                              muted={true}
                              playing={false}
                              height='138px'
                              width="138px"
                              className='four-video'
                            />
                            <div className='control-container'><img className='play-icon play-icon-small' src={playIcon} alt="" /></div>
                          </div>
                          :
                          <img className='message-image image-two-in-line' src={media[1]?.url} alt="" onClick={()=>imageClickedHandler(1)} />
                        }
                      </div>
                      <div className='message-image-four-half'>
                        {(media[2]?.isVideo) ?
                          <div className='video-player-wrapper four' onClick={()=>imageClickedHandler(2)}>
                            <ReactPlayer
                              url={media[2]?.url}
                              muted={true}
                              playing={false}
                              height='138px'
                              width="138px"
                              className='four-video'
                            />
                            <div className='control-container'><img className='play-icon play-icon-small' src={playIcon} alt="" /></div>
                          </div>
                          :
                          <img className='message-image image-two-in-line' src={media[2]?.url} alt="" onClick={()=>imageClickedHandler(2)} />
                        }
                        {((media[3]?.isVideo) ?
                          <div className='video-player-wrapper four' onClick={()=>imageClickedHandler(3)}>
                            <ReactPlayer
                              url={media[3]?.url}
                              muted={true}
                              playing={false}
                              height='138px'
                              width="138px"
                              className='four-video'
                            />
                            <div className='control-container'>+ {media?.length-4}</div>
                          </div>
                          :
                          <div
                            className='message-image-two-three image-two-in-line'
                            style={{
                              background: `linear-gradient(rgba(4,9,30,0.7), rgba(4,9,30,0.7)), url(${media[3]?.url})`,
                              borderRadius: '6px',
                              backgroundPosition: 'center',
                              backgroundSize: 'cover',
                              cursor: 'pointer',
                            }}
                            onClick={()=>imageClickedHandler(3)}
                          >+ {media?.length-4}</div>
                        )}
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
          {(VideoContain && (VideoContain !== media?.length)) ? (
              <p className='media-contain-video-text' style={{ margin: my ? '4px 0 0 12px' : '4px 0 0 50px'}}>
                {VideoContain}{VideoContain > 1 ? ' videos' : ' video'} and {media?.length - VideoContain}{(media?.length - VideoContain) > 1 ? ' images' : ' image'}
              </p>
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