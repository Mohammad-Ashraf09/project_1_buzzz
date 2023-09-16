import React, { useEffect } from 'react'
import { useState } from 'react'
import ReactPlayer from 'react-player';
import { deleteObject } from "firebase/storage";

const PreviewImage = ({
    preview,
    setPreview,
    file, setFile,
    setXYZ,
    imgURL,
    setImgURL,
    imgRef,
    setImgRef,
    percentage
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVisibleLeftArrow, setIsVisibleLeftArrow] = useState(false);
    const [isVisibleRightArrow, setIsVisibleRightArrow] = useState(false);
    const [moveToPrevIndex, setMoveToPrevIndex] = useState(false);

    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const leftArrow = PF+"images/left-arrow.png";
    const rightArrow = PF+"images/right-arrow.png";

    useEffect(()=>{
        if(currentIndex===0)
            setIsVisibleLeftArrow(false);
        if(preview.length>1){
            setIsVisibleLeftArrow(true);
            setIsVisibleRightArrow(true);
            if(currentIndex===preview.length-2){
                setIsVisibleRightArrow(false);
            }
        }

        if(!moveToPrevIndex){
            setCurrentIndex(preview.length-1);
        }
        setMoveToPrevIndex(false)
    },[preview]);

    const cancelImageClickHandler = () =>{
        setPreview((prev)=> prev.filter((item)=> item !== preview[currentIndex]));
        setFile((prev)=> prev.filter((item)=> item.name !== file[currentIndex].name));
        setXYZ(false);
        setImgURL((prev)=> prev.filter((item)=> item !== imgURL[currentIndex]))
        setImgRef((prev)=> prev.filter((item)=> item?._location?.path_ !== imgRef[currentIndex]?._location?.path_))

        deleteObject(imgRef[currentIndex]).then(() => {
            console.log('file deleted--------------', imgRef[currentIndex]?._location?.path_)
        }).catch((error) => {
            console.log(error)
        });   // to delete file from firebase

        if(preview.length===2){
            setIsVisibleLeftArrow(false)
            setIsVisibleRightArrow(false)
        }
        if(currentIndex===preview.length-1)
            setIsVisibleRightArrow(false)
        
        if(currentIndex===0)
            setCurrentIndex(0);
        else
            setCurrentIndex(currentIndex-1);
        setMoveToPrevIndex(true)
    }

    const goToPrevious = () =>{
        if(currentIndex!==0){
            setCurrentIndex(currentIndex-1);
        }
        if(currentIndex===1){
            setIsVisibleLeftArrow(false)
        }
        setIsVisibleRightArrow(true)
    }

    const goToNext = () =>{
        if(currentIndex!==preview.length-1){
            setCurrentIndex(currentIndex+1);
        }
        if(currentIndex===preview.length-2){
            setIsVisibleRightArrow(false)
        }
        setIsVisibleLeftArrow(true)
    }

    return (
        <div className='post-media-preview-container-wrapper'>
            <div className='preview-media-count'>{preview.length>1 && currentIndex+1}</div>
            {percentage ? 
                null :
                <i class="fa-solid fa-square-xmark" onClick={cancelImageClickHandler} ></i>
            }
            <img src={leftArrow} alt="" className="left-arrow arrow" style={{display: `${!isVisibleLeftArrow ? "none" : "block"}`}} onClick={goToPrevious} />
            <img src={rightArrow} alt="" className="right-arrow arrow" style={{display: `${!isVisibleRightArrow ? "none" : "block"}`}} onClick={goToNext} />

            {(file[currentIndex].name.includes(".mp4") || file[currentIndex].name.includes(".MOV")) ?
                <ReactPlayer
                    url={preview[currentIndex]}
                    muted={true}
                    playing={true}
                    controls
                    height={preview?.length>1 ? "97%" : "100%"}
                    width="100%"
                    className='react-player'
                />
                :
                <div className="preview-image" style={{backgroundImage: `url(${preview[currentIndex]})`, height: `${preview.length>1 ? "97%" : "100%"}`}} ></div>
            }

            {/* code for dots */}
            {preview.length>1 && <div className='preview-image-dots-container'>
                {preview.map((prev, prevIndex)=>(
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

export default PreviewImage;
