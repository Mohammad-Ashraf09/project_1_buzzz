import React, { useState } from 'react'
import ReactPlayer from 'react-player';

const ClickedMedia = ({setShowMediaPopup, media, imageIndex, replyMessageHandler}) => {
    const [currentIndex, setCurrentIndex] = useState(imageIndex);

    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const leftArrow = PF+"images/left-arrow.png";
    const rightArrow = PF+"images/right-arrow.png";

    const goToPrevious = () =>{
        if(currentIndex!==0)
            setCurrentIndex(currentIndex-1);
    }

    const goToNext = () =>{
        if(currentIndex!==media?.length-1)
            setCurrentIndex(currentIndex+1);
    }

    return (
        <div className="clicked-media-container">
            <div className='clicked-media-top'>
                <div className='image-reply'>
                    <i className="fa-solid fa-reply functionality" onClick={()=>{
                        replyMessageHandler(currentIndex);
                        setShowMediaPopup(false);
                        document.body.style.overflow = "auto"
                    }}></i>
                    <i class="fa-solid fa-download functionality"></i>
                </div>
                <div className="post-top-dots" onClick={()=> {setShowMediaPopup(false); document.body.style.overflow = "auto"}}>
                    <i class="fa-solid fa-xmark"></i>
                </div>
            </div>

            <div className='clicked-media'>
                {media?.length>1 && <div className='media-count'>{media?.length>1 && currentIndex+1}/{media?.length}</div>}
                {media?.length>1 && <img src={leftArrow} alt="" className="left-arrow left-arrow-media arrow" onClick={goToPrevious} />}
                {media?.length>1 && <img src={rightArrow} alt="" className="right-arrow right-arrow-media arrow" onClick={goToNext} />}

                {(media[currentIndex]?.isVideo) ?
                    <ReactPlayer
                        url={media[currentIndex]?.url}
                        muted={true}
                        playing={true}
                        controls
                        height={media.length>1 ? "97%" : "100%"}
                        width="100%"
                        className='video'
                    />
                    :
                    <div className="preview-image" style={{backgroundImage: `url(${media[currentIndex]?.url})`, height: `${media.length>1 ? "97%" : "100%"}`}} ></div>
                }

                {media.length>1 && <div className='preview-image-dots-container'>
                    {media.map((prev, prevIndex)=>(
                        <div
                            key={prevIndex}
                            className='preview-image-dots'
                            style={{color: `${prevIndex===currentIndex ? "black" : "rgb(154, 147, 147)"}`}}
                            onClick={()=>setCurrentIndex(prevIndex)}
                            > &#x2022;
                        </div>
                    ))}
                </div>}
            </div>
        </div>
    )
}

export default ClickedMedia;