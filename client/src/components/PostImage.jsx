import React, {useState } from 'react';
import ReactPlayer from 'react-player';

const PostImage = ({images, blurrScreenHandler}) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const leftArrow = PF+"images/left-arrow.png";
    const rightArrow = PF+"images/right-arrow.png";

    const goToPrevious = () =>{
        if(currentIndex!==0) setCurrentIndex(currentIndex-1);
    }

    const goToNext = () =>{
        if(currentIndex!==images?.length-1) setCurrentIndex(currentIndex+1);
    }

    return (
        <div className='post-img-container'>
            {images?.length>1 && <div className='post-img-count'>{currentIndex+1}/{images?.length}</div>}
            {images?.length>1 && <img src={leftArrow} alt="" className="left-arrow arrow" onClick={goToPrevious} />}
            {images?.length>1 && <img src={rightArrow} alt="" className="right-arrow arrow" onClick={goToNext} />}

            {(images?.[currentIndex].includes(".mp4") || images?.[currentIndex].includes(".MOV")) ?
                <ReactPlayer
                    url={images?.[currentIndex]}
                    muted={true}
                    playing={true}
                    controls
                    height={images?.length>1 ? "97%" : "100%"}
                    width="100%"
                    className='react-player'
                />
                :
                <div
                    className="preview-image"
                    style={{backgroundImage: `url(${images?.[currentIndex]})`, height: `${images?.length>1 ? "97%" : "100%"}`}}
                    onClick={blurrScreenHandler}
                ></div>
            }
            
            {/* code for dots */}
            {images?.length>1 && <div className='preview-image-dots-container'>
                {images.map((prev, prevIndex)=>(
                    <div
                        key={prevIndex}
                        className='preview-image-dots'
                        style={{color: `${prevIndex===currentIndex ? "#03bfbc" : "rgb(154, 147, 147)"}`}}
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
