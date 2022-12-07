import React, {useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { Waypoint } from 'react-waypoint';

const PostImage = ({images, blurrScreenHandler, clicked}) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const leftArrow = PF+"images/left-arrow.png";
    const rightArrow = PF+"images/right-arrow.png";

    const goToPrevious = () =>{
        if(currentIndex!==0)
            setCurrentIndex(currentIndex-1);
    }

    const goToNext = () =>{
        if(currentIndex!==images?.length-1)
            setCurrentIndex(currentIndex+1);
    }
    console.log(images)

    return (
        <div className='post-img-container'>
            <div className='post-img-count'>{images?.length>1 && currentIndex+1}</div>
            {images?.length>1 && <img src={leftArrow} alt="" className="left-arrow" onClick={goToPrevious} />}
            {images?.length>1 && <img src={rightArrow} alt="" className="right-arrow" onClick={goToNext} />}

            {(images?.[currentIndex].includes(".mp4") || images?.[currentIndex].includes(".MOV")) ?
                <ReactPlayer
                    // url="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
                    url={PF+images?.[currentIndex]}
                    muted={true}
                    playing={true}
                    controls
                    height={clicked && "295px"}
                    width={clicked && "520px"}
                />
                :
                <div
                    className="preview-img"
                    style={{backgroundImage: `url(${PF+images?.[currentIndex]})`, height: `${images?.length>1 ? "97%" : "100%"}`}}
                    onClick={blurrScreenHandler}
                ></div>
            }
            
            {images?.length>1 && <div className='preview-img-dots-container'>
                {images.map((prev, prevIndex)=>(
                    <div
                        key={prevIndex}
                        className='preview-img-dots'
                        style={{color: `${prevIndex===currentIndex ? "black" : "rgb(154, 147, 147)"}`}}
                        onClick={()=>setCurrentIndex(prevIndex)}
                        > &#x2022;
                        {/* &#x2022; code is code of dot circle symbol */}
                    </div>
                ))}
            </div>}
        </div>
    )
}

export default PostImage;
