import { useContext, useEffect, useRef, useState} from 'react'
import TopbarForLogin from "../components/TopbarForLogin";
import { Link } from "react-router-dom";
import {loginCall} from "../apiCalls"
import { AuthContext } from "../context/AuthContext";
import axios from 'axios';
import bcrypt from 'bcryptjs'


const Login = ()=> {
  const [allUsers, setAllUsers] = useState([]);
  const [invalidCredential, setInvalidCredential] = useState(false);
  const email = useRef();
  const password = useRef();
  const {dispatch} = useContext(AuthContext);
  
  const clickHandler = async(e)=>{
    e.preventDefault();
    setInvalidCredential(false);
    const item = allUsers.filter((item)=> item.email === email.current.value);

    if(item.length>0){
      const validPassword = await bcrypt.compare(password.current.value, item[0].password)
      if(validPassword)
        loginCall({email: email.current.value, password: password.current.value}, dispatch)
      else
        setInvalidCredential(true);
    }
    else
      setInvalidCredential(true);
  }

  useEffect(()=>{
    const fetchAllUsers = async() =>{
      const res = await axios.get("users");
      setAllUsers(res.data);
    }
    fetchAllUsers();
  },[])
  

  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  return (
    <div className="login-container">
      <TopbarForLogin/>
      <div className="login-container-wrapper">
        <div className="signup-section">
          <form>
            <img className="ttn-logo" src={PF+"/images/ttn.jpg"} alt=""/>
            <h2 className="signup-text"> Enter your details and Start your journey with us </h2>
            <h4>Don't Stop until you're proud.</h4>
            <button className="google-btn"> Sign In with Google </button>
            <span className="or">or</span>
            <Link to="/register">
              <button className="google-btn"> Sign Up </button>
            </Link>
          </form>
        </div>

        <div className="signin-section">
          <form onSubmit={clickHandler}>
            <h3 className="signin-text"> Login To Your Account </h3>
            <div className="input-section">
              <input type="email" className="username" name='username' placeholder='Email' ref={email} required />
              <br />
              <input type="password" className="password" name='password' placeholder='Password' ref={password} required minLength='6' />
            </div>
            {invalidCredential && <div className="invalid-credential">Invalid Credentials!</div>}

            <div className="form-group">
              <div className="checkbox">
                <input className="checkbox-input" type="checkbox"/>
                <label className="checkbox-label"> Remember Me </label>
              </div>
              <div className="forgot-pass">
                <a href="">Forgot Password?</a>
              </div>
            </div>
      
            <button className='signin-btn'>Sign In</button>
          </form>
        </div>
      </div>
    </div> 
  )
}

export default Login;