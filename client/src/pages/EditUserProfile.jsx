import axios from 'axios';
import React, { createRef, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import ChangePassword from '../components/ChangePassword';
import EmojiContainer from '../components/emoji/EmojiContainer';
import Topbar from '../components/Topbar';
import { AuthContext } from '../context/AuthContext';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "../firebase";
import ProgressBar from "@ramonak/react-progress-bar";
import Compressor from 'compressorjs';
import Bottombar from '../components/Bottombar';

const EditUserProfile = () => {
  const {user:currentUser} = useContext(AuthContext);
  const [user, setUser] = useState({});
  const[formdata, setFormdata] = useState({});
  const navigate = useNavigate();
  const {username, bio, fname, lname, gender, DOB, email, phone, place, city, profilePicture, coverPicture} = user;
  const [editCover, setEditCover] = useState(false);
  const [editDP, setEditDP] = useState(false);

  const [dpFile, setDpFile] = useState(profilePicture?.includes('https://') ? profilePicture : `/assets/${profilePicture}`);
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
  const [showParticularPost, setShowParticularPost] = useState(false);

  const [dpRef, setDpRef] = useState(null);
  const [oldDpRef, setOldDpRef] = useState(null);
  const [coverRef, setCoverRef] = useState(null);
  const [oldCoverRef, setOldCoverRef] = useState(null);
  const [dpURL, setDpURL] = useState('');
  const [coverURL, setCoverURL] = useState('');
  const [percentage, setPercentage] = useState(null);
  
  const camera = "/assets/blue-cam.png";
  const cover = coverPicture ? coverPicture : "/assets/default-cover.jpg";
  const DP = profilePicture?.includes('https://') ? profilePicture : `/assets/${profilePicture}`;

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

  const dpFileHandler = (e) =>{
    if(e.target.files[0]){
      setDpFile(e.target.files[0]);
      setDpChanged(true);
    }
  }

  useEffect(()=>{
    if(dpFile && dpChanged){
      const objectUrl = URL.createObjectURL(dpFile);
      setDpPreview(objectUrl);

      new Compressor(dpFile, {
        quality: 0.4, // 0.6 can also be used, but its not recommended to go below.
        success: (compressedResult) => {
          const imgName = compressedResult?.name?.toLowerCase()?.split(' ').join('-');
          const uniqueImageName = new Date().getTime() + '-' + imgName;

          const storageRef = ref(storage, uniqueImageName);
          setOldDpRef(dpRef);
          setDpRef(storageRef);
          const uploadTask = uploadBytesResumable(storageRef, compressedResult);

          uploadTask.on('state_changed', (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setPercentage(progress);
              console.log('Upload is ' + progress + '% done');
              switch (snapshot.state) {
                case 'paused':
                  console.log('Upload is paused');
                  break;
                case 'running':
                  console.log('Upload is running');
                  break;
                default:
                  break;
              }
            }, 
            (error) => {
              console.log(error);
            }, 
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                setDpURL(downloadURL);
              });
            }
          );
        },
      });
    }
  },[dpFile]);

  useEffect(()=>{
    if(oldDpRef && dpChanged){
      deleteObject(oldDpRef).then(() => {
        console.log('dp deleted--------------', oldDpRef?._location?.path_)
      }).catch((error) => {
          console.log(error)
      });   // to delete file from firebase
    }
  },[oldDpRef]);

  const coverFileHandler = (e) =>{
    if(e.target.files[0]){
      setCoverFile(e.target.files[0]);
    }
    setCoverChanged(true);
  }

  useEffect(()=>{
    if(coverFile && coverChanged){
      const objectUrl = URL.createObjectURL(coverFile);
      setCoverPreview(objectUrl);

      new Compressor(coverFile, {
        quality: 0.4, // 0.6 can also be used, but its not recommended to go below.
        success: (compressedResult) => {
          const imgName = compressedResult?.name?.toLowerCase()?.split(' ').join('-');
          const uniqueImageName = new Date().getTime() + '-' + imgName;

          const storageRef = ref(storage, uniqueImageName);
          setOldCoverRef(coverRef)
          setCoverRef(storageRef)
          const uploadTask = uploadBytesResumable(storageRef, compressedResult);

          uploadTask.on('state_changed', (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setPercentage(progress);
              console.log('Upload is ' + progress + '% done');
              switch (snapshot.state) {
                case 'paused':
                  console.log('Upload is paused');
                  break;
                case 'running':
                  console.log('Upload is running');
                  break;
                default:
                  break;
              }
            }, 
            (error) => {
              console.log(error);
            }, 
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                setCoverURL(downloadURL);
              });
            }
          );
        },
      });
    }
  },[coverFile]);

  useEffect(()=>{
    if(oldCoverRef && coverChanged){
      deleteObject(oldCoverRef).then(() => {
        console.log('cover deleted--------------', oldCoverRef?._location?.path_)
      }).catch((error) => {
          console.log(error)
      });   // to delete file from firebase
    }
  },[oldCoverRef]);

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
    setDpFile(profilePicture);
    setCoverFile(coverFile);
    setDpURL('');
    setCoverURL('');

    if(dpRef && dpChanged){
      dpRemoveFromFirebase(dpRef);
    }
    if(coverRef && coverChanged){
      coverRemoveFromFirebase(coverRef);
    }

    setOldDpRef(null);
    setOldCoverRef(null);

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

  const cancelClickHandler = () => {
    if(dpRef && dpChanged){
      dpRemoveFromFirebase(dpRef);
    }
    if(coverRef && coverChanged){
      coverRemoveFromFirebase(coverRef);
    }

    navigate(`/user/${currentUser._id}`);
  }

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
        updatedData.profilePicture = dpURL;

        const st1 = profilePicture?.split('/o/')[1];
        const profileName = st1?.split('?alt')[0];
        const profileStorageRef = ref(storage, profileName);
        if(st1){
          dpRemoveFromFirebase(profileStorageRef);
        }
      }

      if(coverChanged){
        updatedData.coverPicture = coverURL;

        const st2 = coverPicture?.split('/o/')[1];
        const coverName = st2?.split('?alt')[0];
        const coverStorageRef = ref(storage, coverName);
        if(st2){
          coverRemoveFromFirebase(coverStorageRef);
        }
      }

      try{
        if(Object.keys(updatedData).length > 1){
          await axios.put("/users/"+currentUser._id, updatedData);
          navigate(`/user/${currentUser._id}`);
        }
      }
      catch(err){}

      if(updatedData.fname || updatedData.lname || updatedData.profilePicture){
        const data = {
          id: user._id,
          name: formdata.fname + " " + formdata.lname,
          dp: updatedData.profilePicture ? updatedData.profilePicture : formdata.profilePicture,
        };

        try{
          await axios.put("/users/"+user._id+"/following", data);
        }catch(err){
          console.log(err)
        }
      }
    }
  }

  const dpRemoveFromFirebase = (imageRef) => {
    deleteObject(imageRef).then(() => {
      console.log('dp deleted--------------', imageRef?._location?.path_)
    }).catch((error) => {
        console.log(error)
    });   // to delete file from firebase
  }

  const coverRemoveFromFirebase = (imageRef) => {
    deleteObject(imageRef).then(() => {
      console.log('cover deleted--------------', imageRef?._location?.path_)
    }).catch((error) => {
        console.log(error)
    });   // to delete file from firebase
  }

  const blurrScreenHandler = ()=>{
    setShowParticularPost(!showParticularPost);

    if(!showParticularPost){
      document.body.style.overflow = "hidden";
      document.body.scrollIntoView();
    }
    else
      document.body.style.overflow = "auto";
  }

  if(percentage === 100){
    setPercentage(null);
  }

  return (
    <>
      <Topbar user={user}/>

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

          <div className='progress-bar-container'>
            {percentage ? (
              <ProgressBar
                completed={percentage}
                maxCompleted={100}
                bgColor={'#03bfbc'}
                isLabelVisible={false}
                // labelColor={'#000'}
                height={'5px'}
                margin={'8px 0 0 0'}
                // width={'100%'}
              />
            ) : null}
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
            <div className='change-password' onClick={blurrScreenHandler}>change password</div>

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
                    pattern='^[a-zA-Z ]{1,20}$'
                    // required={true}
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

                <div className="gender-container">
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
                    // required={true}
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
                    // required={true}
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
                  <div className="bio-character-count">{formdata?.bio?.length}/100</div>
                  {noOfLineError ? <div id='no-of-line' className='no-of-lines-error-msg'>Only 4 lines allowed</div> : null}
                </div>
                <div className='btns-div'>
                  <div className='reset-btn' onClick={resetClickHandler}>Reset</div>
                  <button
                    className='cancell-btn buttons'
                    onClick={cancelClickHandler}
                    disabled={(percentage !== null && percentage !== 100) ? true : false}
                  >Cancel</button>
                  <button
                    className='save-btn buttons'
                    onClick={saveHandler}
                    disabled={(percentage !== null && percentage !== 100) ? true : false}
                  >Save</button>
                </div>
              </div>
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

      {showParticularPost &&
        <div className='blurr-div'>
            <ChangePassword setShowParticularPost={setShowParticularPost} password={currentUser.password} id={currentUser._id}/>
        </div>
      }

      <Bottombar user={user}/>
    </>
  )
}

export default EditUserProfile;