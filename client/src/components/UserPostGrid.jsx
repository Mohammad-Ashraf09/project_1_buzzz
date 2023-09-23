import React from 'react';
import ReactPlayer from 'react-player';

const UserPostGrid = (post) => {
  return (
    <div className='user-post-grid'>
        {(post?.post[0]?.img[0]?.includes('.mp4') || post?.post[0]?.img[0]?.includes('.MOV')) ?
            <div className='grid-video'>
                <ReactPlayer
                    url={post?.post[0]?.img[0]}
                    muted={true}
                    playing={false}
                    height='100%'
                    width="100%"
                    className='grid-video-player'
                />
            </div>
            :
            <img className='grid-img' src={post?.post[0]?.img[0]} alt="" />
        }

        {(post?.post[1]?.img[0]?.includes('.mp4') || post?.post[1]?.img[0]?.includes('.MOV')) ?
            <div className='grid-video'>
                <ReactPlayer
                    url={post?.post[1]?.img[0]}
                    muted={true}
                    playing={false}
                    height='100%'
                    width="100%"
                    className='grid-video-player'
                />
            </div>
            :
            <img className='grid-img' src={post?.post[1]?.img[0]} alt="" />
        }

        {(post?.post[2]?.img[0]?.includes('.mp4') || post?.post[2]?.img[0]?.includes('.MOV')) ?
            <div className='grid-video'>
                <ReactPlayer
                    url={post?.post[2]?.img[0]}
                    muted={true}
                    playing={false}
                    height='100%'
                    width="100%"
                    className='grid-video-player'
                />
            </div>
            :
            <img className='grid-img' src={post?.post[2]?.img[0]} alt="" />
        }
    </div>
  )
};

export default UserPostGrid;