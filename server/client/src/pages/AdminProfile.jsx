import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router';
import Suggestion from '../components/rightbar/Suggestion';
import Topbar from '../components/Topbar';

const AdminProfile = () => {

  const [user, setUser] = useState({});
  const userId = useParams().id;
  //console.log(userId);

  useEffect(()=>{
    const fetchUser = async() =>{
      const res = await axios.get(`/users/${userId}`);
      setUser(res.data);
      //console.log(res.data)
    }
    fetchUser();
  },[userId]);

  const {profilePicture, coverPicture, fname, lname, desc, followers, city, from, zip} = user;
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  
  const camera = PF + "images/blue-cam.png";
  if(coverPicture==="")
      var cover = PF+"default-cover.jpg";
  else
      var cover = PF+coverPicture;

  if(profilePicture==="")
      var profile = PF+"default-profile.png";
  else
      var profile = PF+profilePicture;
      

  // const [uploadImage, setUploadImage] = useState(profile);
  // function upload(e) {
  //   setUploadImage(URL.createObjectURL(e.target.files[0]));
  //   console.log(e)
  // }
  
  
  const[formdata,setFormdata] = useState({ firstname:'', lastname:'', designation:'', mywebsite:'', gender:'', birthday:'', city:'', state:'', zip:'' })
  const handleChange = (name,value)=>{
    setFormdata({...formdata,[name]:value})
    //console.log(formdata);
  }

  return (
    <div className="admin-profile-conatiner">
      <Topbar/>

      <div className="admin-suggestion-conatiner">
        <div className="admin-container">
          <div className="admin-profile-cover">
            <img src={cover} alt="" className="admin-cover-img" />
            <div className='admin-profile-img'>
              <img id='upload-img' src={profile} alt='profile'/>
              <div className="btn_upload">
                {/* <input type="file" id="upload_file" name="" onChange={e => upload(e)} /> */}
                <img src={camera} alt='add' />
              </div>
            </div>
          </div>

          <form className='form-details'>
            <div className="admin-profile-name">{fname + ' ' + lname}</div>
            <div className='details'>
              <label className='details-name' htmlFor="">First Name</label>
              <label className='details-name2-lname' htmlFor="">Last Name</label>
            </div>
            <div className='details-input'>
              <input className='details-value' onBlur={(e)=>handleChange(e.target.name,e.target.value)} type="text" placeholder={fname} name='firstname' />
              <input className='details-value2'onBlur={(e)=>handleChange(e.target.name,e.target.value)} type="text" placeholder={lname} name='lastname'/>
            </div>
            <br/>
            <div className='details'>
              <label className='details-name' htmlFor="">Designation</label>
              <label className='details-name2' htmlFor="">My Website</label>
            </div>
            <div className='details-input'>
              <select className='input-drpdwn' id='designation' onBlur={(e)=>handleChange(e.target.name,e.target.value)} name='designation'>
                <option value="Co-founder" selected>Co-founder</option>
                <option value="Executive">Executive</option>
                <option value="Others">Others</option>
              </select>
              <input className='details-value2' type="text" name='mywebsite' onBlur={(e)=>handleChange(e.target.name,e.target.value)}/>
            </div>
            <br />
            <div className='details'>
              <label className='details-name' htmlFor="">Gender</label>
              <label id='details-name-brth' htmlFor="">Birthday</label>
            </div>
            <div className='details-input'>
              <div className="radio-toolbar">
                <input type="radio" id="male"  value="male" defaultChecked  name='gender' onBlur={(e)=>handleChange('gender','male')}/>
                <label htmlFor="male">Male</label>
                <input type="radio" id="female"  value="female" name='gender' onBlur={(e)=>handleChange('gender','female')} />
                <label htmlFor="female">Female</label>
              <input id='details-value2-bday' type="text" placeholder='MM/DD/YYYY' name='birthday' onBlur={(e)=>handleChange(e.target.name,e.target.value)}/>
              </div>
            </div>
            <br/>
            <div className='details'>
              <label className='details-name' htmlFor="">City</label>
              <label id='details-name-state' htmlFor="">State</label>
              <label id='details-name-ZIP' htmlFor="">ZIP</label>
            </div>
            <div className='details-input'>
              <input className='details-value' type="text" placeholder={city} name='city' onBlur={(e)=>handleChange(e.target.name,e.target.value)} />
              <select className='input-drpdwn' id='state' name='state' onBlur={(e)=>handleChange(e.target.name,e.target.value)}>
                <option value="state" selected>UP</option>
                <option value="Delhi">Delhi</option>
                <option value="Kerala">Kerala</option>
                <option value="Others">Others</option>
              </select>
              <input id='zip' type="text" placeholder={zip} maxlength='6' minLength='6' style={{ width: '77px' }} name='zip' onBlur={(e)=>handleChange(e.target.name,e.target.value)}/>
            </div>
            <br/>
            <br />
            <div>
              <input className='btns' id='save-btn' onBlur={(e)=>handleChange(e.target.name,e.target.value)} type="button" value="Save" />
              <input className='btns' id= 'reset-btn' type="reset" value="Reset All" />
            </div>
            <br />
            <br />
          </form>
        </div>
        <div className="suggestion-div">
          <Suggestion/>
        </div>
      </div>
    </div>
  )
}

export default AdminProfile