import React from 'react'

const SearchBox = () => {
  return (
    <div className='timeline-search'>
      <div className="timeline-search-wrapper">
        <img className='post-user-img' src="assets/pic1.jpg" alt="" />
        <textarea type="text" className="post-input" placeholder='Start a post...'/>
        <div className="y">
          <i className="fa-solid fa-photo-film"></i>
          <span className="photo-video">Photo/Video</span>
          <div className="btn">
            <button>Post</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchBox