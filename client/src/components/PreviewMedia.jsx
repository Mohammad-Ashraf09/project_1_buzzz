import React from 'react'

const PreviewMedia = ({idx, media, setPreview, file, setFile, setXYZ}) => {

    const cancelPreviewPic = (med)=>{
        setPreview((prev)=> prev.filter((item)=> item !== med));
        setFile((prev)=> prev.filter((item)=> item.name !== file[idx].name));
        setXYZ(false);
    }

    return (
        <div className='review-pic-div'>
            <img className='review-pic' src={media} alt="" />
            <div className='review-pic-cancel-div'>
                <i class="fa-solid fa-xmark review-pic-cancel-icon" onClick={()=> cancelPreviewPic(media)}></i>
            </div>
        </div>
    )
}

export default PreviewMedia;