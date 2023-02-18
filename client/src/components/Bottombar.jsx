import {Link} from "react-router-dom";

const Bottombar = ({user}) => {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const dp = user?.profilePicture ? PF+user.profilePicture : PF+"default-dp.png";

    return (
        <div className='bottombar-container'>
            <div className="bottombar-icons">
                <div className="bottombar-icon">
                    <i class="fa-solid fa-house"></i>
                </div>
                <div className="bottombar-icon">
                    <i className="fa-solid fa-magnifying-glass"></i>
                </div>
                <Link to={`/edit/user/${user?._id}`} style={{textDecoration: 'none'}}>
                    <img src={dp} alt="" className="topbar-img" />
                </Link>
            </div>
        </div>
    )
}

export default Bottombar;