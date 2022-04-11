import axios from 'axios';
import React, { useEffect, useState } from 'react'
import ContactPerson from './ContactPerson';

const Cont = ({follow}) => {

    const [friend, setFriend] = useState({})

    useEffect(()=>{
        const fetchFriend = async() =>{
          const res = await axios.get(`users/${follow}`);
          setFriend(res.data);
          //console.log(res.data)
        }
        fetchFriend();
    },[]);

    
  return (
    <div>
        <ContactPerson friend={friend}/>
    </div>
  )
}

export default Cont