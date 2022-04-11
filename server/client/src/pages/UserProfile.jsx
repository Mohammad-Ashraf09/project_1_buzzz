const UserProfile = () => {
    
  return (
    <div className="user-container">
      
      <div className="user-cover-photo">
        <img className="user-profile" src="https://images.unsplash.com/photo-1565464027194-7957a2295fb7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80"/>
      </div>

      <div className="user-profile-name"> Jame Smith </div>

      <div className="user-about">
        <p><br/>User Interface Designer and front-end developer</p>
        <p></p>
      </div>

      <div>
        <button className="user-btns" id='add-frnd'>Add Friend</button>
        <button className="user-btns">Visit Website</button>
      </div>

    </div>
  )
}

export default UserProfile;