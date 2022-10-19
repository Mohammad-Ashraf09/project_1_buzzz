import React from 'react'

const Location = ({location, setShowLocations, setLocation, setShowLocationPostContainer, setQuery}) => {

  const clickHandler = ()=>{
    setLocation(location);
    setShowLocations(false);
    setShowLocationPostContainer(true);
    setQuery("");
  }

  return (
    <>
      <li className="locations-list-item" onClick={clickHandler}>
        {location}
      </li>
    </>
  )
}

export default Location;