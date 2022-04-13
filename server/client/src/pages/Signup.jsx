import axios from 'axios';
import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TopbarForLogin from '../components/TopbarForLogin';

const Signup = () => {

    const fname = useRef();
    const lname = useRef();
    const username = useRef();
    const email = useRef();
    const phone = useRef();
    const password = useRef();
    const passwordAgain = useRef();
    const navigate = useNavigate();

    const clickHandler = async(e) =>{
        e.preventDefault();
        if(password.current.value !== passwordAgain.current.value){
            passwordAgain.current.setCustomValidity("Passwords NOT matched")
        }
        else{
            const user = {
                fname: fname.current.value,
                lname: lname.current.value,
                username: username.current.value,
                email: email.current.value,
                phone: phone.current.value,
                password: password.current.value,
            };
            try{
                await axios.post("/auth/register", user);
                navigate("/login");
            }catch(err){
                console.log(err);
            }
        }   
    }

    
    return (
        <div className='signup-container'>
            <TopbarForLogin/>
            <div className="signup-box">
                <form className="left" onSubmit={clickHandler}>
                    <h1>Sign up</h1>
                    <input type="text" name="firstname" placeholder="First Name" required ref={fname} />
                    <input type="text" name="lastname" placeholder="Last Name" required ref={lname} />
                    <input type="text" name="username" placeholder="Username should contains numbers" required ref={username} />
                    <input type="email" name="email" placeholder="Email" required ref={email} />
                    <input type="text" name="phone" placeholder="Phone" required ref={phone} />
                    <input type="password" name="password" placeholder="Password" required ref={password} minLength='6' />
                    <input type="password" name="retypePassword" placeholder="Retype Password" required ref={passwordAgain} />
                    <div className="agreement-div">
                        <input type="checkbox" id="agreement" name="agreement"/>
                        <label for="agreement"> I agree all statements in <a href="">Terms of Service</a></label>
                    </div>
                    <button type="submit" className="register-btn" >Register</button>
                    <br />
                    <br />
                </form>
            
                <div className="right">
                    <span className="loginwith"><br /></span>
                    <Link to="/login" id='existing-member'>Already a Member?</Link>
                </div>
            </div>
        </div> 
    )
}

export default Signup