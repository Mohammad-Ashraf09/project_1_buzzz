import Topbar from "../components/Topbar"
import { useParams } from "react-router";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import UserPost from "../components/UserPost";
import {Chart as ChartJs, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend} from "chart.js";
import {Bar} from "react-chartjs-2";
import Contact from "../components/rightbar/Contact";
import { Link } from "react-router-dom";

ChartJs.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const UserProfile = () => {
  const [user, setUser] = useState({});
  const [followed, setFollowed] = useState(false);
  const [userPosts, setUserPosts] = useState([]);
  const [chartData, setChartData] = useState({datasets: [],});
  const [chartOptions, setChartOptions] = useState({});

  const {user:currentUser} = useContext(AuthContext);
  const userId = useParams().id;

  useEffect(()=>{
    setFollowed(currentUser.followings.some(e=>e.id===user._id))
  },[currentUser, user._id]);

  useEffect(()=>{
    const fetchUser = async() =>{
      const res = await axios.get(`/users/${userId}`);
      setUser(res.data);
    }
    fetchUser();
  },[userId]);

  useEffect(()=>{
    const fetchUserPosts = async() =>{
      const userPosts = await axios.get(`/posts/user/${userId}`);
      setUserPosts(userPosts.data.sort((post1, post2)=>{
        return new Date(post2.createdAt) - new Date(post1.createdAt);
      }));
    }
    fetchUserPosts();
  },[userId]);

  const getBarData = () =>{
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth =  currentDate.getMonth()+1;
    let months;
    let years;
    
    switch(currentMonth){
      case 1:
        months = ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan"];
        years = [`${currentYear-1}-08`, `${currentYear-1}-09`, `${currentYear-1}-10`, `${currentYear-1}-11`, `${currentYear-1}-12`, `${currentYear}-01`]
        break;
      
      case 2:
        months = ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb"];
        years = [`${currentYear-1}-09`, `${currentYear-1}-10`, `${currentYear-1}-11`, `${currentYear-1}-12`, `${currentYear}-01`, `${currentYear}-02`]
        break;

      case 3:
        months = ["Oct", "Nov", "Dec", "Jan", "Feb", "March"]
        years = [`${currentYear-1}-10`, `${currentYear-1}-11`, `${currentYear-1}-12`, `${currentYear}-01`, `${currentYear}-02`, `${currentYear}-03`]
        break;

      case 4:
        months = ["Nov", "Dec", "Jan", "Feb", "March", "April"];
        years = [`${currentYear-1}-11`, `${currentYear-1}-12`, `${currentYear}-01`, `${currentYear}-02`, `${currentYear}-03`, `${currentYear}-04`]
        break;
      
      case 5:
        months = ["Dec", "Jan", "Feb", "March", "April", "May"];
        years = [`${currentYear-1}-12`, `${currentYear}-01`, `${currentYear}-02`, `${currentYear}-03`, `${currentYear}-04`, `${currentYear}-05`]
        break;

      case 6:
        months = ["Jan", "Feb", "March", "April", "May", "June"];
        years = [`${currentYear}-01`, `${currentYear}-02`, `${currentYear}-03`, `${currentYear}-04`, `${currentYear}-05`, `${currentYear}-06`]
        break;

      case 7:
        months = ["Feb", "March", "April", "May", "June", "July"];
        years = [`${currentYear}-02`, `${currentYear}-03`, `${currentYear}-04`, `${currentYear}-05`, `${currentYear}-06`, `${currentYear}-07`]
        break;
      
      case 8:
        months = ["March", "April", "May", "June", "July", "Aug"];
        years = [`${currentYear}-03`, `${currentYear}-04`, `${currentYear}-05`, `${currentYear}-06`, `${currentYear}-07`, `${currentYear}-08`]
        break;

      case 9:
        months = ["April", "May", "June", "July", "Aug", "Sep"];
        years = [`${currentYear}-04`, `${currentYear}-05`, `${currentYear}-06`, `${currentYear}-07`, `${currentYear}-08`, `${currentYear}-09`]
        break;

      case 10:
        months = ["May", "June", "July", "Aug", "Sep", "Oct"];
        years = [`${currentYear}-05`, `${currentYear}-06`, `${currentYear}-07`, `${currentYear}-08`, `${currentYear}-09`, `${currentYear}-10`]
        break;
      
      case 11:
        months = ["June", "July", "Aug", "Sep", "Oct", "Nov"];
        years = [`${currentYear}-06`, `${currentYear}-07`, `${currentYear}-08`, `${currentYear}-09`, `${currentYear}-10`, `${currentYear}-11`]
        break;

      case 12:
        months = ["July", "Aug", "Sep", "Oct", "Nov", "Dec"];
        years = [`${currentYear}-07`, `${currentYear}-08`, `${currentYear}-09`, `${currentYear}-10`, `${currentYear}-11`, `${currentYear}-12`]
        break;

      default:
        return null
    }

    const createdAt = userPosts.map((post)=>post.createdAt.substr(0,7));
    const postCount = [];
    years.map((item)=>{
      postCount.push(createdAt.filter(x => x===item).length)
    })
    return {months, postCount};
  };

  useEffect(()=>{
    const data = getBarData();

    setChartData({
      labels: data.months,
      datasets: [{
        label: "",
        data: data.postCount,
        // borderColor: "rgb(53,162,235)",
        backgroundColor: "#03bfbc",
        barThickness: 19,
      }]
    });
    setChartOptions({
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      scales: {
        x: {
          stacked: true,
          grid:{
            display: false,
            drawBorder: false,
          }
        },
        y: {
          stacked: true,
          ticks:{
            beginAtZero: true,
            steps: 5,
            maxTicksLimit: 7
          },
          grid: {
            drawBorder: false
          }
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        title:{
          display: true,
          text: "Your Last 6 Months Post Count",
        },
        tooltip:{
          enable: true
        }
      },
      
    });
  }, [userId, userPosts]);

  const {profilePicture, coverPicture, fname, lname, gender, bio, city, place} = user;
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  const name = fname+' '+lname;
  const DP = profilePicture ? PF+profilePicture : PF+"default-dp.png";
  const cover = coverPicture ? PF+coverPicture : PF+"default-cover.jpg";

  const followHandler = async () =>{
    try{
      if(followed){
        await axios.put("/users/"+ user._id + "/unfollow", {userId: currentUser._id, name: user.fname+" "+user.lname, dp:user.profilePicture})
      }
      else{
        await axios.put("/users/"+ user._id + "/follow", {userId: currentUser._id, name: user.fname+" "+user.lname, dp:user.profilePicture})
      }
    }catch(err){

    }
    setFollowed(!followed);
  }

  return (
    <>
      <Topbar />
      <div className="user">
        <div className="user-friend-conatiner">
          <div className="user-container">
            <img src={cover} alt="" className="user-cover-img" />
            <img src={DP} alt="" className="user-profile-img" />
            <div className="discription-add-remove">
              <div className="user-discription">
                <h2 className="user-profile-name">
                  {name} 
                  {gender==='male' ?
                    <span className="gender-sign"><i class="fa-solid fa-mars"></i></span>
                    :
                    <span className="gender-sign"><i class="fa-solid fa-venus"></i></span>
                  }
                </h2>
                <h4 className="user-about"> {bio} </h4>
                <p className="user-location"> {place}  &#8226; {city}  &#8226; India  &#8226; 2 friends </p>
              </div>
              <div className="buttons">
                {userId!==currentUser?._id &&
                  <button className="add-remove-friend-btn" onClick={followHandler} >
                    {followed ?
                      <i class="fa-solid fa-user-xmark user-icon"></i>
                      : 
                      <i className="fas fa-user-plus user-icon"></i>
                    }
                    {followed ? "Remove Friend" : "Add Friend"}
                  </button>
                }

                {userId===currentUser?._id ?
                  <Link to={`/admin/${currentUser._id}`} style={{textDecoration: 'none', color:'black'}}>
                    <button className="add-remove-friend-btn" > Edit Profile </button>
                  </Link>
                  :
                  <button className="add-remove-friend-btn" > Message </button>
                }
              </div>
            </div>
          </div>

          <div className="friends-div">
            <Bar options={chartOptions} data={chartData} />
          </div>
        </div>

        <div className="user-post-area">
          <div className="user-post-left"></div>
          <div className="user-post-timeline">
            {userPosts.map((post)=>(
              <UserPost
                key={post.__id}
                user={user}
                name={name}
                DP={DP}
                post={post}
                isLik={post.likes.includes(currentUser._id)}
                isDisLik={post.dislikes.includes(currentUser._id)}
              />
            ))}
          </div>
          <div className="user-post-right">
            <Contact user={user} isUserProfile={true} />
            <div className="story-area">
              
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default UserProfile;