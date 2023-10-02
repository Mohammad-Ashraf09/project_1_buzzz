import {Link} from "react-router-dom";

const Bottombar = ({user}) => {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const dp = user?.profilePicture?.includes('https://') ? user?.profilePicture : PF+user?.profilePicture;

    return (
        <div className='bottombar-container'>
            <div className="bottombar-icons">
                <Link to="/" style={{textDecoration: 'none', color: 'black'}}>
                    <div className="bottombar-icon"> <i class="fa-solid fa-house"></i> </div>
                </Link>
                <Link to="/search" style={{textDecoration: 'none', color: 'black'}}>
                    <div className="bottombar-icon"> <i className="fa-solid fa-magnifying-glass"></i> </div>
                </Link>
                <Link to={`/user/${user?._id}`} style={{textDecoration: 'none'}}>
                    <img src={dp} alt="" className="topbar-img" />
                </Link>
            </div>
        </div>
    )
}

export default Bottombar;