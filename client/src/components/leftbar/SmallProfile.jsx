import {Link} from "react-router-dom";

const SmallProfile = ({user}) => {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const profile = user.profilePicture?.includes('https://') ? user.profilePicture : PF+user.profilePicture;
    const cover = user?.coverPicture ? user.coverPicture : PF+"default-cover.jpg";
    const name = user?.fname + " " + user?.lname;

    return (
        <div className='small-profile'>
            <Link to={`/user/${user?._id}`} style={{textDecoration: 'none'}}>
                <div className="small-profile-cover">
                    <img src={cover} alt="" className="cover-img" />
                    <img src={profile} alt="" className="user-img" />
                </div>
                <div className="small-profile-info">
                    <h3 className='small-profile-username'>{name}</h3>
                    <h5 className='small-profile-desc'>{user?.bio}</h5>
                    <div className="small-profile-data">
                        <div className="small-profile-data1">
                            <div className="small-profile-number">{user?.followings?.length}</div>
                            <div className="small-profile-text">Followings</div>
                        </div>
                        <div className="small-profile-data1">
                            <div className="small-profile-number">{user?.followers?.length}</div>
                            <div className="small-profile-text">Followers</div>
                        </div>
                        <div className="small-profile-data2">
                            <div className="small-profile-number">{user?.totalPosts}</div>
                            <div className="small-profile-text">Post</div>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    )
}

export default SmallProfile