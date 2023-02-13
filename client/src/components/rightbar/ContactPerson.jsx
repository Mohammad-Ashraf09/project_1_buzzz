import { Link } from 'react-router-dom';

const ContactPerson = ({onlineUsers, friend}) => {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const DP = friend.dp ? PF+friend.dp : PF+"default-dp.png";

  return (
    <>
      <li className="contact-list-item">
        <Link to={`/user/${friend.id}`}>
          <img src={DP} alt="" className="contact-img" />
          {onlineUsers.some(data=>data.userId === friend.id) && <span className="contact-badge"></span>}
        </Link>
        <Link to={`/user/${friend.id}`} style={{textDecoration: 'none'}}>
          <span className="contact-name">{friend.name}</span>
        </Link>
      </li>
    </>
  )
}

export default ContactPerson;