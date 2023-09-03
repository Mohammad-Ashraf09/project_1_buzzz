import React, { useState } from 'react'

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
                <div
                    className='functionality image-reply'
                    onClick={()=>{
                        replyMessageHandler(currentIndex);
                        setShowMediaPopup(false);
                        document.body.style.overflow = "auto"
                    }}>
                    <i className="fa-solid fa-reply"></i>
                </div>
                <div className="post-top-dots" onClick={()=> {setShowMediaPopup(false); document.body.style.overflow = "auto"}}>
                    <i class="fa-solid fa-xmark"></i>
                </div>
            </div>

            <div className='clicked-media'>
                {media?.length>1 && <div className='media-count'>{media?.length>1 && currentIndex+1}/{media?.length}</div>}
                {media?.length>1 && <img src={leftArrow} alt="" className="left-arrow left-arrow-media" onClick={goToPrevious} />}
                {media?.length>1 && <img src={rightArrow} alt="" className="right-arrow right-arrow-media" onClick={goToNext} />}

                {/* {(file[currentIndex].name.includes(".mp4") || file[currentIndex].name.includes(".MOV")) ?
                    <ReactPlayer
                        url={preview[currentIndex]}
                        muted={true}
                        playing={true}
                        controls
                        // height="380px"
                        // width="670px"
                    />
                    :
                    <div className="preview-img" style={{backgroundImage: `url(${preview[currentIndex]})`, height: `${preview.length>1 ? "97%" : "100%"}`}} ></div>
                } */}
                <div className="clicked-img" style={{backgroundImage: `url(${media[currentIndex]})`, height: `${media.length>1 ? "97%" : "100%"}`}} ></div>

                {media.length>1 && <div className='preview-img-dots-container'>
                    {media.map((prev, prevIndex)=>(
                        <div
                            key={prevIndex}
                            className='preview-img-dots'
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