import Suggestion from "../components/rightbar/Suggestion";
import Topbar from "../components/Topbar"
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";

const UserProfile = () => {
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

  //console.log(followers)     // it shows followers is an array
  //console.log(followers.length)     // but it gives error i dont why

  if(coverPicture==="")
      var cover = PF+"default-cover.jpg";
  else
      var cover = PF+coverPicture;

  if(profilePicture==="")
      var profile = PF+"default-profile.png";
  else
      var profile = PF+profilePicture;

  return (
    <div className="user-profile-conatiner">
      <Topbar/>

      <div className="user-suggestion-conatiner">
        <div className="user-container">
          <div className="user-profile-cover">
              <img src={cover} alt="" className="user-cover-img" />
              <img src={profile} alt="" className="user-profile-img" />
          </div>
          <div className="user-discription">
            <h2 className="user-profile-name"> {fname +' '+ lname} </h2>
            <h4 className="user-about"> {desc} </h4>
            <p className="user-location"> {from}  &#8226; {city}  &#8226; India  &#8226; 2 friends </p>
          </div>
          <div>
            <button className="user-btns" id="user-add-frnd"><i className="fas fa-user-plus"></i> Add Friend</button>
            <button className="user-btns" id="user-visit-website"><i className="fas fa-share-square"></i> Visit Website</button>
          </div>
        </div>

        <div className="suggestion-div">
          <Suggestion/>
        </div>
      </div>
    </div>
  )
}
export default UserProfile;