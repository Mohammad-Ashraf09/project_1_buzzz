
import Input from "../components/Input";
import Button from "../components/Button";
import { useState} from 'react'


const Login = ()=> {
  const [loginData, setLoginData] = useState({
    username:'',
    password:''
  })
  const userhandler = (name,value)=>{
    setLoginData({...loginData,[name]:value})
  }
  console.log(loginData);

  return (
    <div className="login-container">
      <div className="login-container-wrapper">
        <div className="signup-section">
          <form>
            <img className="ttn-logo" src="assets/images/ttn.jpg" alt=""/>
            <h2 className="signup-text"> Enter your details and Start your journey with us </h2>
            <h4>Don't Stop until you're proud.</h4>
            <button className="google-btn"> Sign In with Google </button>
            <span className="or">or</span>
            <button className="google-btn"> Sign Up </button>
          </form>
        </div>

        <div className="signin-section">
          <form>
            <h3 className="signin-text"> Login To Your Account </h3>
            <div className="input-section">
              <Input type="text" onChange={e =>userhandler(e.target.name,e.target.value)} className="username" name='username' placeholder='TTN Username'/>
              <br />
              <Input type="password" onChange={e =>userhandler(e.target.name,e.target.value)} className="password" name='password' placeholder='Password'/>
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
      
            <Button className='signin-btn' type='button'>Sign In</Button>
          </form>
        </div>
      </div>
    </div> 
  )
}

export default Login;