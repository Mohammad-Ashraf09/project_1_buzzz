import axios from 'axios';
import React, { useEffect, useState } from 'react'
import SuggestionPerson from './SuggestionPerson';

const Sugg = ({follow}) => {

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
        <SuggestionPerson friend={friend}/>
    </div>
  )
}

export default Sugg