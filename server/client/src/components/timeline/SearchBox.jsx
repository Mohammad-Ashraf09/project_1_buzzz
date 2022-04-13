import axios from 'axios';
import React, { useContext, useRef, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';


const SearchBox = () => {
  const {user} = useContext(AuthContext);

  const desc = useRef();
  const [file, setFile] = useState(null)

  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const profile = user.profilePicture ? PF + user.profilePicture : PF + "default-dp.png";
  const name = user.fname;

  const submitHandler = async(e) =>{
    e.preventDefault();
    const newPost = {
      userId: user._id,
      desc: desc.current.value,
    }
    if(file){
      const data = new FormData();
      const fileName = file.name;
      data.append("file", file)
      data.append("name", fileName)
      newPost.img = fileName;
      try{
        await axios.post("/upload", data)
      }catch(err){
        console.log(err)
      }
    }

    try{
      await axios.post("/posts", newPost)
      //window.location.reload();
    }
    catch(err){

    }
  }

  return (
    <form className='timeline-search' onSubmit={submitHandler}>
      <div className="timeline-search-wrapper">
        <img className='post-user-img' src={profile} alt="" />
        <textarea type="text" className="post-input" placeholder={"Hello " + name + ", Start a post..."} ref={desc} />
        <div className="y">

          <label htmlFor="file">
            <i className="fa-solid fa-photo-film"></i>
            <span className="photo-video">Photo/Video</span>
            <input style={{display:"none"}} type="file" id="file" name="file" onClick={(e)=>setFile(e.target.files[0])} />
          </label>

          <div className="btn">
            <button type="submit">Post</button>
          </div>
        </div>
      </div>
    </form>
  )
}

export default SearchBox