import axios from 'axios';
import React, { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext';


const Utility = () => {
    const {user} = useContext(AuthContext);

    const deleteAccountHandler = async(e)=>{
        e.preventDefault();
        const remove = window.confirm("Are you sure, you want to delete your account!");
    
        if(remove){
            await axios.delete("/users/"+user._id);
            localStorage.clear();
            window.location.reload();
        }
    }

    return (
        <div className='utility'>
            <div className="utility-wrapper">
                <div className="utility-name">Recent</div>
                <ul className="sidebar-list">
                    <li className="sidebar-list-item">
                        <i className="fa-solid fa-hashtag"></i>
                        <span className="sidebar-list-text">#javascript</span>
                    </li>
                    <li className="sidebar-list-item">
                        <i className="fa-regular fa-calendar-check"></i>
                        <span className="sidebar-list-text">Mobile Trends conference 2022</span>
                    </li>
                    <li className="sidebar-list-item">
                        <i className="fa-solid fa-user-group"></i>
                        <span className="sidebar-list-text">Freelance Developers</span>
                    </li>
                </ul>

                <div className="show-more-link">
                    <i className="fa-solid fa-chevron-down"></i>
                    <span>Show More</span>
                </div>
                <hr className='sidebar-line'/>

                <div className="utility-name">Groups</div>
                <ul className="sidebar-list">
                    <li className="sidebar-list-item">
                        <i className="fa-solid fa-hashtag"></i>
                        <span className="sidebar-list-text">#javascript</span>
                    </li>
                    <li className="sidebar-list-item">
                        <i className="fa-regular fa-calendar-check"></i>
                        <span className="sidebar-list-text">Mobile Trends conference 2022</span>
                    </li>
                    <li className="sidebar-list-item">
                        <i className="fa-solid fa-user-group"></i>
                        <span className="sidebar-list-text">Freelance Developers</span>
                    </li>
                </ul>

                <div className="show-more-link">
                    <i className="fa-solid fa-chevron-down"></i>
                    <span>Show More</span>
                </div>
                <hr className='sidebar-line'/>

                <div className="utility-name">Subscriptions</div>
                <ul className="sidebar-list">
                    <li className="sidebar-list-item">
                        <i className="fa-solid fa-file-code"></i>
                        <span className="sidebar-list-text">Programming with Mosh</span>
                    </li>
                    <li className="sidebar-list-item">
                        <i className="fa-regular fa-hand-pointer"></i>
                        <span className="sidebar-list-text">E-learning Bridge</span>
                    </li>
                    <li className="sidebar-list-item">
                        <i className="fa-solid fa-user-secret"></i>
                        <span className="sidebar-list-text">Clever Programmer</span>
                    </li>
                </ul>

                <div className="show-more-link">
                    <i className="fa-solid fa-chevron-down"></i>
                    <span>Show More</span>
                </div>
                <hr className='sidebar-line'/>

                <div className="utility-name">Account</div>
                <ul className="sidebar-list">
                    <li className="sidebar-list-item">
                        <i class="fa-solid fa-trash-can"></i>
                        <span className="sidebar-list-text delete-account" onClick={deleteAccountHandler}>Delete Account</span>
                    </li>
                </ul>
            
            </div>
        </div>
    )
}

export default Utility