import React from 'react'
import ReactPlayer from 'react-player';

const PreviewMedia = ({index, media, setPreview, file, setFile, setXYZ}) => {

    const cancelPreviewPic = (med)=>{
        setPreview((prev)=> prev.filter((item)=> item?.url !== med?.url));
        setFile((prev)=> prev.filter((item)=> item.name !== file[index].name));
        setXYZ(false);
    }

    return (
        <div className='review-pic-div'>
            {media?.isVideo ?
                <ReactPlayer
                    url={media?.url}
                    muted={true}
                    playing={false}
                    // controls
                    height="50px"
                    width="50px"
                    className='review-pic'
                />
                :
                <img className='review-pic' src={media?.url} alt="" />
            }
            <div className='review-pic-cancel-div'>
                <i class="fa-solid fa-xmark review-pic-cancel-icon" onClick={()=> cancelPreviewPic(media)}></i>
            </div>
        </div>
    )
}

export default PreviewMedia;