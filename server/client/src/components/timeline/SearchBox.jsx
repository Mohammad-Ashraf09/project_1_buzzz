import axios from 'axios';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';


const SearchBox = () => {

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState()
  const {user} = useContext(AuthContext);
  const desc = useRef();

  useEffect(()=>{              // this useEffect is for preview the file before uploading it
    if(!file){
        setPreview(undefined)
        return
    }
    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)   // free memory when ever this component is unmounted

  },[file]);

  //console.log(file)

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
      const fileName = Date.now() + file.name;
      data.append("name", fileName)
      data.append("file", file)
      newPost.img = fileName;
      try{
        await axios.post("/upload", data)        // to upload photo into local storage
      }catch(err){
        console.log(err)
      }
    }

    try{
      await axios.post("/posts", newPost)         // to post the desc and file name to database
      window.location.reload();
    }
    catch(err){}

    try{
      await axios.put("users/"+user._id, {userId: user._id, totalPosts: user.totalPosts+1});    // to update the total post count by 1
    }
    catch(err){}
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
            <input style={{display:"none"}} type="file" id="file" name="file" accept='.jpg, .png, .jpeg' onChange={(e)=>setFile(e.target.files[0])} />
          </label>

          <div className="btn">
            <button type="submit">Post</button>
          </div>
        </div>
      </div>
      <div className="share-img-container">
        {file && <img className="share-img" src={preview} alt="" />}
        {file && <i class="fa-solid fa-square-xmark" onClick={()=>setFile(null)} ></i>}
      </div>
    </form>
  )
}

export default SearchBox