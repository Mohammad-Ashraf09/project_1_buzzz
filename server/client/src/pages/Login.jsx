
import Input from "../components/Input";
import Button from "../components/Button";
import { useContext, useRef, useState} from 'react'
import TopbarForLogin from "../components/TopbarForLogin";
import { Link } from "react-router-dom";
import {loginCall} from "../apiCalls"
import { AuthContext } from "../context/AuthContext";


const Login = ()=> {

  const email = useRef();
  const password = useRef();
  const {user, isFetching, error, dispatch} = useContext(AuthContext);
  
  const clickHandler = (e)=>{
    e.preventDefault();
    loginCall({email: email.current.value, password: password.current.value}, dispatch)
  }

  //console.log(user);

  return (
    <div className="login-container">
      <TopbarForLogin/>
      <div className="login-container-wrapper">
        <div className="signup-section">
          <form>
            <img className="ttn-logo" src="assets/images/ttn.jpg" alt=""/>
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
              <input type="email" className="username" name='username' placeholder='TTN Username' ref={email} required />
              <br />
              <input type="password" className="password" name='password' placeholder='Password' ref={password} required minLength='6' />
            </div>

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