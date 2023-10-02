import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import Topbar from '../components/Topbar';
import Bottombar from '../components/Bottombar';
import UsersList from '../components/UsersList';

const Search = () => {
    const {user:currentUser} = useContext(AuthContext);
    const [user, setUser] = useState(null);
    const [allUsers, setAllUsers] = useState([]);
    const [query, setQuery] = useState('');

    useEffect(()=>{
        const fetchUser = async() =>{
          const res = await axios.get(`/users/${currentUser._id}`);
          setUser(res.data);
        }
        fetchUser();
    },[currentUser._id]);

    useEffect(()=>{
        const fetchAllUsers = async() =>{
            try{
                const res = await axios.get("users/");
                const processedData = await Promise.all(res?.data?.map((item)=>{
                    const obj = {
                        _id: item?._id,
                        username: item?.username,
                        name: item?.fname + ' ' + item?.lname,
                        profilePicture: item?.profilePicture,
                    }
                    return obj
                }));
                setAllUsers(processedData);

            }catch(err){
                console.log(err);
            }
        }
        fetchAllUsers();
    },[]);

    return (
        <>
            <Topbar user={user}/>
            <div className='search'>
                <div className='search-wrapper'>
                    <div className="conversation-search-box">
                        <input
                            type="text"
                            className="conversation-search-box-input"
                            name=""
                            placeholder='Search You Want...'
                            onChange={(e)=>setQuery(e.target.value)}
                        />
                        <div className='conversation-search-icon'> <i className="fa-solid fa-magnifying-glass"></i> </div>
                    </div>
                    <div className='search-result-container'>
                        {query && allUsers.filter((x)=>(x.name).toLowerCase().includes(query)).map((data)=>(
                            <UsersList key={data?._id} data={data}/>
                        ))}
                    </div>
                </div>
            </div>
            <Bottombar user={user}/>
        </>
    )
}

export default Search;