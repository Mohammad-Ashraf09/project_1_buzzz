import axios from 'axios';
import React, { createRef, useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import EmojiContainer from '../components/emoji/EmojiContainer';
import Topbar from '../components/Topbar';
import { AuthContext } from '../context/AuthContext';

const AdminProfile = () => {
  const {user:currentUser} = useContext(AuthContext);
  const [user, setUser] = useState({});
  const[formdata, setFormdata] = useState({});
  const navigate = useNavigate();
  const {username, bio, fname, lname, gender, DOB, email, phone, place, city, profilePicture, coverPicture} = user;
  const [editCover, setEditCover] = useState(false);
  const [editDP, setEditDP] = useState(false);

  const [dpFile, setDpFile] = useState(profilePicture);
  const [dpPreview, setDpPreview] = useState();
  const [dpChanged, setDpChanged] = useState(false);
  const [coverFile, setCoverFile] = useState(coverPicture);
  const [coverPreview, setCoverPreview] = useState();
  const [coverChanged, setCoverChanged] = useState(false);

  const [usernames, setUsernames] = useState([]);
  const [uniqueUsernameError, setUniqueUsernameError] = useState(false);
  const [noOfLineError, setNoOfLineError] = useState(false)
  const [focused, setFocused] = useState(false);
  const [isShakeEffect, setIsShakeEffect] = useState(false);
  const [isShakeEffect2, setIsShakeEffect2] = useState(false);
  const [isShakeEffect3, setIsShakeEffect3] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const inputRef = createRef();
  const [cursorPosition, setCursorPosition] = useState();
  
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const camera = PF + "images/blue-cam.png";
  const cover = coverPicture ? PF+coverPicture : PF+"default-cover.jpg";
  const DP = profilePicture ? PF+profilePicture : PF+"default-dp.png";

  useEffect(()=>{
    const fetchAllUsers = async() =>{
      const res = await axios.get("/users/");
      const allUsers = res.data
      const usernameArray = allUsers.map(item => item.username)
      setUsernames(usernameArray);
    }
    fetchAllUsers();
  },[]);

  useEffect(()=>{
    const fetchLoggedInUserData = async() =>{
      const res = await axios.get(`/users/${currentUser._id}`);
      const loggedInUser = res.data;
      setUser(loggedInUser);

      setFormdata({
        username: loggedInUser.username,
        bio: loggedInUser.bio,
        fname: loggedInUser.fname,
        lname: loggedInUser.lname,
        DOB: loggedInUser.DOB,
        gender: loggedInUser.gender,
        email: loggedInUser.email,
        phone: loggedInUser.phone,
        place: loggedInUser.place,
        city: loggedInUser.city,
        profilePicture: loggedInUser.profilePicture,
        coverPicture: loggedInUser.coverPicture,
      });
    }
    fetchLoggedInUserData();
  },[]);
  
  const handleChange = (e)=>{
    setFormdata({...formdata,[e.target.name]:e.target.value});

    if(e.target.name === 'username'){
      usernames.map((item) => {
        if(item===e.target.value && e.target.value!==username){
          setUniqueUsernameError(true);
        }
      })
    }
    if(e.target.name === 'username' && uniqueUsernameError){
      setUniqueUsernameError(false);
    }

    if(e.target.name === 'bio'){
      const len = e.target.value.split("\n").length
      if(len > 4)
        setNoOfLineError(true);
    }
    if(e.target.name === 'bio' && noOfLineError){
      const len = e.target.value.split("\n").length
      if(len < 5)
      setNoOfLineError(false);
    }
  }

  const resetClickHandler = (e) => {
    e.preventDefault();
    setShowEmojis(false);
    setDpPreview(null);
    setCoverPreview(null);
    setDpChanged(false);
    setCoverChanged(false);

    setFormdata({
      username: username,
      bio: bio,
      fname: fname,
      lname: lname,
      DOB: DOB,
      gender: gender,
      email: email,
      phone: phone,
      place: place,
      city: city,
      profilePicture: profilePicture,
      coverPicture: coverPicture,
    });
  }

  const dpFileHandler = (e) =>{
    if(e.target.files[0]){
      setDpFile(e.target.files[0]);
    }
    setDpChanged(true);
  }

  useEffect(()=>{
    if(dpFile && dpChanged){
      const objectUrl = URL.createObjectURL(dpFile)
      setDpPreview(objectUrl)
    }
  },[dpFile]);

  const coverFileHandler = (e) =>{
    if(e.target.files[0]){
      setCoverFile(e.target.files[0]);
    }
    setCoverChanged(true);
  }

  useEffect(()=>{
    if(coverFile && coverChanged){
      const objectUrl = URL.createObjectURL(coverFile)
      setCoverPreview(objectUrl)
      // return () => URL.revokeObjectURL(objectUrl)   // free memory when ever this component is unmounted
    }
  },[coverFile]);

  const saveHandler = async(e) => {
    e.preventDefault();
    setShowEmojis(false);
    const collection = document.getElementsByClassName("edit-profile-error-msg");
    
    let error;
    for (let i=0; i<collection.length; i++) {
      if(getComputedStyle(collection[i]).display==='block'){
        error = true;

        const elm = document.getElementById(`${i}`);
        elm.classList.add('shake-effect')
        setIsShakeEffect(true);
      }
    }

    if(uniqueUsernameError){
      const elm = document.getElementById('username-exist');
      elm.classList.add('shake-effect')
      setIsShakeEffect2(true);
    }
    if(noOfLineError){
      const elm = document.getElementById('no-of-line');
      elm.classList.add('shake-effect')
      setIsShakeEffect3(true);
    }

    if(!error && !uniqueUsernameError && !noOfLineError){
      const updatedData = {
        userId: currentUser._id,
      }

      if(formdata.username!==username)
        updatedData.username = formdata.username
      if(formdata.bio!==bio)
        updatedData.bio = formdata.bio
      if(formdata.fname!==fname)
        updatedData.fname = formdata.fname
      if(formdata.lname!==lname)
        updatedData.lname = formdata.lname
      if(formdata.DOB!==DOB)
        updatedData.DOB = formdata.DOB
      if(formdata.gender!==gender)
        updatedData.gender = formdata.gender
      if(formdata.email!==email)
        updatedData.email = formdata.email
      if(formdata.phone!==phone)
        updatedData.phone = formdata.phone
      if(formdata.place!==place)
        updatedData.place = formdata.place
      if(formdata.city!==city)
        updatedData.city = formdata.city

      if(dpChanged){
        const data = new FormData();
        const fileName = Date.now() + dpFile.name;
        data.append("name", fileName)
        data.append("file", dpFile)
        updatedData.profilePicture = fileName;

        try{
          await axios.post("/upload", data)        // to upload photo into local storage
        }catch(err){
          console.log(err)
        }
      }

      if(coverChanged){
        const data = new FormData();
        const fileName = Date.now() + coverFile.name;
        data.append("name", fileName)
        data.append("file", coverFile)
        updatedData.coverPicture = fileName;

        try{
          await axios.post("/upload", data)        // to upload photo into local storage
        }catch(err){
          console.log(err)
        }
      }

      try{
        if(Object.keys(updatedData).length > 1){
          await axios.put("/users/"+currentUser._id, updatedData);
          navigate(`/user/${currentUser._id}`);
        }
      }
      catch(err){}
    }
  }

  useEffect(()=>{
    if(isShakeEffect){
      setTimeout(()=>{
        const collection = document.getElementsByClassName("edit-profile-error-msg");
        for (let i=0; i<collection.length; i++) {
          if(getComputedStyle(collection[i]).display==='block'){
            const elm = document.getElementById(`${i}`);
            elm.classList.remove('shake-effect')
            setIsShakeEffect(false);
          }
        }
      },500);
    }
  },[isShakeEffect]);

  useEffect(()=>{
    if(isShakeEffect2){
      setTimeout(()=>{
        if(uniqueUsernameError){
          const elm2 = document.getElementById('username-exist');
          elm2.classList.remove('shake-effect')
          setIsShakeEffect2(false);
        }
      },500);
    }
  },[isShakeEffect2]);

  useEffect(()=>{
    if(isShakeEffect3){
      setTimeout(()=>{
        if(noOfLineError){
          const elm3 = document.getElementById('no-of-line');
          elm3.classList.remove('shake-effect')
          setIsShakeEffect3(false);
        }
      },500);
    }
  },[isShakeEffect3]);

  return (
    <>
      <Topbar/>

      <form className="edit-profile" >
        <div className='edit-profile-wrapper'>

          <div className="cover-div" onMouseOver={()=>setEditCover(true)} onMouseOut={()=>setEditCover(false)}>
            {coverPreview ?
              <img src={coverPreview} alt='cover' className="edit-cover"/>
              :
              <img src={cover} alt='cover' className="edit-cover"/>
            }
            <label htmlFor="cover">
              <img src={camera} alt="" className="camera camera-cover" style={{display: editCover && 'block'}} />
              <input style={{display:"none"}} type="file" id="cover" name="file" accept='.jpg, .png, .jpeg' onChange={coverFileHandler}/>
            </label>
          </div>

          <div className='dp-div' onMouseOver={()=>setEditDP(true)} onMouseOut={()=>setEditDP(false)}>
            {dpPreview ?
              <img src={dpPreview} alt='profile' className="edit-dp"/>
              :
              <img src={DP} alt='profile' className="edit-dp"/>
            }
            <label htmlFor="dp">
              <img src={camera} alt="" className="camera camera-dp" style={{display: editDP && 'block'}} />
              <input style={{display:"none"}} type="file" id="dp" name="file" accept='.jpg, .png, .jpeg' onChange={dpFileHandler}/>
            </label>
          </div>

          <div className='details-div'>
            <div className='change-password'>change password</div>

            <div className='details-div-wrapper'>
              <div className='username-div'>
                <label className='label' htmlFor="">Username :</label>
                <input
                  className='edit-username'
                  type="text"
                  name='username'
                  value={formdata.username}
                  pattern='^(?=.*[a-z])[a-z0-9_]{6,20}$'
                  // should contain small alphabets, underscore and number
                  required={true}
                  onBlur={()=>setFocused(true)}
                  focused={focused.toString()}
                  onChange={handleChange}
                />
                {uniqueUsernameError ?
                  <div id='username-exist' className='username-exist-error-msg'>username not available</div>
                  :
                  <div id='0' className='edit-profile-error-msg'>enter a valid username (only small letters, numbers and underscore allowed)</div>
                }
              </div>

              <div className='fname-lname-div'>
                <div className='fname-div'>
                  <label className='label' htmlFor="">First Name :</label>
                  <input
                    className='edit-username'
                    type="text"
                    name='fname'
                    value={formdata.fname}
                    pattern='^[a-zA-Z]{3,16}$'
                    required={true}
                    onBlur={()=>setFocused(true)}
                    focused={focused.toString()}
                    onChange={handleChange}
                  />
                  <div id='1' className='edit-profile-error-msg'>Enter the first name only without space</div>
                </div>

                <div className='lname-div'>
                  <label className='label' htmlFor="">Last Name :</label>
                  <input
                    className='edit-username'
                    type="text"
                    name='lname'
                    value={formdata.lname}
                    pattern='^[a-zA-Z ]{3,20}$'
                    required={true}
                    onBlur={()=>setFocused(true)}
                    focused={focused.toString()}
                    onChange={handleChange}
                  />
                  <div id='2' className='edit-profile-error-msg'>Enter valid last name</div>
                </div>
              </div>

              <div className='fname-lname-div'>
                <div className='fname-div'>
                  <label className='label' htmlFor="">DOB :</label>
                  <input
                    className='edit-username'
                    type="text"
                    name='DOB'
                    value={formdata.DOB}
                    pattern='^(?=.*[0-9])(?=.*[/])[0-9/]{10,10}$'
                    // should contain small numbers and forwad slash
                    required={true}
                    onBlur={()=>setFocused(true)}
                    focused={focused.toString()}
                    onChange={handleChange}
                  />
                  <div id='3' className='edit-profile-error-msg'>Enter a valid DOB in dd/mm/yyyy format</div>
                </div>

                <div className="gender-div">
                  <div className='gender-label'>
                    <label className='label' htmlFor="">Gender :</label>
                  </div>
                  <div className="edit-gender-radio">
                    {formdata.gender==='male' ?
                      <input type="radio" id="male" defaultChecked name='gender' value={'male'} onChange={handleChange}/>
                      :
                      <input type="radio" id="male" name='gender' value={'male'} onChange={handleChange}/>
                    }
                    <label htmlFor="male">Male</label>
                    {formdata.gender==='female' ?
                      <input type="radio" id="female" defaultChecked name='gender' value={'female'} onChange={handleChange}/>
                      :
                      <input type="radio" id="female" name='gender' value={'female'} onChange={handleChange}/>
                    }
                    <label htmlFor="female">Female</label>
                  </div>
                </div>
              </div>

              <div className='fname-lname-div'>
                <div className='fname-div'>
                  <label className='label' htmlFor="">Email :</label>
                  <input
                    className='edit-username'
                    type="text"
                    name='email'
                    value={formdata.email}
                    pattern='^(?=.*[.])(?=.*[@])(?=.*[a-z])[a-z0-9.@]{10,50}$'
                    // should contain small alphabets, . and @
                    required={true}
                    onBlur={()=>setFocused(true)}
                    focused={focused.toString()}
                    onChange={handleChange}
                  />
                  <div id='4' className='edit-profile-error-msg'>Enter a valid email</div>
                </div>

                <div className='lname-div'>
                  <label className='label' htmlFor="">Mobile No. :</label>
                  <input
                    className='edit-username'
                    type="text"
                    name='phone'
                    value={formdata.phone}
                    pattern='^[0-9]{10,10}$'
                    required={true}
                    onBlur={()=>setFocused(true)}
                    focused={focused.toString()}
                    onChange={handleChange}
                  />
                  <div id='5' className='edit-profile-error-msg'>Mobile number must be 10 digits</div>
                </div>
              </div>

              <div className='fname-lname-div'>
                <div className='fname-div'>
                  <label className='label' htmlFor="">Place :</label>
                  <input
                    className='edit-username'
                    type="text"
                    name='place'
                    value={formdata.place}
                    pattern='^[a-zA-Z0-9-_/, ]{3,30}$'
                    required={true}
                    onBlur={()=>setFocused(true)}
                    focused={focused.toString()}
                    onChange={handleChange}
                  />
                  <div id='6' className='edit-profile-error-msg'>Enter a valid place name</div>
                </div>
                
                <div className='lname-div'>
                  <label className='label' htmlFor="">City/State :</label>
                  <input
                    className='edit-username'
                    type="text"
                    name='city'
                    value={formdata.city}
                    pattern='^[a-zA-Z0-9-_/ ]{3,30}$'
                    required={true}
                    onBlur={()=>setFocused(true)}
                    focused={focused.toString()}
                    onChange={handleChange}
                  />
                  <div id='7' className='edit-profile-error-msg'>Enter a valid city</div>
                </div>
              </div>

              <div className='bio-btns-div'>
                <div className='bio-div'>
                  <label className='label bio-label' htmlFor="">Bio :</label>
                  <textarea className='edit-bio' type="text" name='bio' value={formdata.bio} onChange={handleChange} maxLength={100} ref={inputRef}/>
                  <div className="bio-emoji-icon">
                    <i className="fa-regular fa-face-laugh" onClick={()=>{setShowEmojis(!showEmojis)}}></i>
                  </div>
                </div>
                <div className='btns-div'>
                  <Link to={`/user/${currentUser._id}`} style={{textDecoration: 'none', color:'black'}}>
                    <button className='edit-btns cancell-btn'>Calcel</button>
                  </Link>
                  <button className='edit-btns reset-btn' onClick={resetClickHandler}>Reset</button>
                  <button className='edit-btns save-btn' onClick={saveHandler} >Save</button>
                </div>
              </div>
              {noOfLineError && <div id='no-of-line' className='no-of-lines-error-msg'>Only 4 lines allowed</div>}
            </div>
          </div>
        </div>
      </form>
      {showEmojis &&
        <EmojiContainer
          inputRef={inputRef}
          setMessage={setFormdata}
          message={formdata}
          setCursorPosition={setCursorPosition}
          cursorPosition={cursorPosition}
          bioFrom={true}
        />
      }
    </>
  )
}

export default AdminProfile;