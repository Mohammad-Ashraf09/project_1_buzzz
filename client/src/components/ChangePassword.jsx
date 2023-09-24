import React, { useState, useEffect } from 'react';
import bcrypt from 'bcryptjs';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ChangePassword = ({setShowParticularPost, password, id}) => {
    const [focused, setFocused] = useState(false);
    const [isFalsePassword, setIsFalsePassword] = useState(false);
    const [isPasswordNotMatched, setIsPasswordNotMatched] = useState(false);
    const [isShakeEffect, setIsShakeEffect] = useState(false);
    const [isShakeEffect2, setIsShakeEffect2] = useState(false);
    const [isShakeEffect3, setIsShakeEffect3] = useState(false);
    const [isLoader, setIsLoader] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [hideSaveBtn, setHideSaveBtn] = useState(false);

    const [oldPassword, setOldPassword] = useState(false);
    const [passwordMatched, setpasswordMatched] = useState(false);
    const navigate = useNavigate();
    const [values, setValues] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const check = PF+"images/check-mark-verified.gif";
    const loader = PF+"images/gif-loader.gif";
    const tick = PF+"images/tick.png";

    const handleChange = (e)=>{
        setValues({...values, [e.target.name]: e.target.value});
    }

    const blurHandler = async() => {
        const validPassword = await bcrypt.compare(values.oldPassword, password);
        if(validPassword){
            setIsFalsePassword(false);
            setOldPassword(true);
        }
        else{
            setIsFalsePassword(true);
            setOldPassword(false);
        }

        if(values.newPassword !== values.confirmPassword)
            setIsPasswordNotMatched(true);
        else
            setIsPasswordNotMatched(false);

        if((values.newPassword === values.confirmPassword) && values.newPassword)
            setpasswordMatched(true);
        else
            setpasswordMatched(false);
    }

    const saveHandler = async(e) => {
        e.preventDefault();
        
        const collection = document.getElementsByClassName("password-error");

        let error;
        if(getComputedStyle(collection[0]).display==='block'){
            error = true;

            const elm = document.getElementById('invalid-password');
            elm.classList.add('shake-effect')
            setIsShakeEffect(true);
        }

        if(isFalsePassword){
            const elm = document.getElementById('incorrect-password');
            elm.classList.add('shake-effect')
            setIsShakeEffect2(true);
        }
        if(isPasswordNotMatched){
            const elm = document.getElementById('password-not-matched');
            elm.classList.add('shake-effect')
            setIsShakeEffect3(true);
        }

        if(
            !error &&
            !isFalsePassword &&
            !isPasswordNotMatched &&
            values.oldPassword &&
            values.newPassword &&
            values.confirmPassword
        ){
            const updatedData = {
              userId: id,
            }

            const validPassword = await bcrypt.compare(values.newPassword, password);
            if(!validPassword)
              updatedData.password = values.newPassword;
            
            try{
              if(Object.keys(updatedData).length > 1){
                setIsLoader(true);
                setHideSaveBtn(true)
                await axios.put("/users/"+id, updatedData);

                setTimeout(()=>{
                    setIsLoader(false);
                    setHideSaveBtn(false)
                    setShowSuccess(true)
                },2000);
                setTimeout(()=>{
                    navigate(`/user/${id}`);
                },5000);
              }
            }
            catch(err){}
        }
    }

    useEffect(()=>{
        if(isShakeEffect){
            setTimeout(()=>{
                const collection = document.getElementsByClassName("password-error");
                if(getComputedStyle(collection[0]).display==='block'){
                    const elm = document.getElementById('invalid-password');
                    elm.classList.remove('shake-effect')
                    setIsShakeEffect(false);
                }
            },500);
        }
    },[isShakeEffect]);
    
    useEffect(()=>{
        if(isShakeEffect2){
            setTimeout(()=>{
                if(isFalsePassword){
                    const elm2 = document.getElementById('incorrect-password');
                    elm2.classList.remove('shake-effect')
                    setIsShakeEffect2(false);
                }
            },500);
        }
    },[isShakeEffect2]);

    useEffect(()=>{
        if(isShakeEffect3){
            setTimeout(()=>{
                if(isPasswordNotMatched){
                    const elm3 = document.getElementById('password-not-matched');
                    elm3.classList.remove('shake-effect')
                    setIsShakeEffect3(false);
                }
            },500);
        }
    },[isShakeEffect3]);

    return (
        <div className="password-change-container">
            <div className='cross-div'>
                <h3 className='change-password-heading'>Change Password</h3>
                <div className="post-top-dots" onClick={()=> {setShowParticularPost(false); document.body.style.overflow = "auto"}}>
                    <i class="fa-solid fa-xmark"></i>
                </div>
            </div>
            {showSuccess ?
                <div className='successful-message'>
                    Password changed successfully...
                    <span>
                        <img className='tick-mark' src={check} alt="" />
                    </span>
                </div>
            : null}

            <div className='password-div'>
                <form className="change-password-form">
                    <div className='input-password'>
                        <label className='label password-label' htmlFor="">Old Password :</label>
                        <input
                            type="password"
                            name='oldPassword'
                            placeholder= "Old Password"
                            required={true}
                            onChange={handleChange}
                            onBlur={blurHandler}
                        />
                        {isFalsePassword ?
                            <div id='incorrect-password' className='username-exist-error-msg password-error'>Invalid password entered!!</div>
                        : null}
                        {oldPassword ? <img className='tick' src={tick} alt="" /> : null}
                    </div>

                    <div className='input-password'>
                        <label className='label password-label' htmlFor="">New Password :</label>
                        <input
                            type="password"
                            name='newPassword'
                            placeholder= "New Password"
                            pattern= "^(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,20}$"
                            required={true}
                            onBlur={()=>setFocused(true)}
                            focused={focused.toString()}
                            onChange={handleChange}
                        />
                        <div id='invalid-password' className='edit-profile-error-msg password-error'>Password should be 8-20 character and include at least 1 capital letter, 1 number and 1 special character!</div>
                        <img className='tick tickkk' src={tick} alt="" />
                    </div>
                    
                    <div className='input-password'>
                        <label className='label password-label' htmlFor="">Confirm Password :</label>
                        <input
                            type="password"
                            name='confirmPassword'
                            placeholder= "Confirm Password"
                            required={true}
                            onChange={handleChange}
                            onBlur={blurHandler}
                        />
                        {isPasswordNotMatched ?
                            <div id='password-not-matched' className='username-exist-error-msg password-error'>Passwords didn't match!</div>
                        : null}
                        {passwordMatched ? <img className='tick' src={tick} alt="" /> : null}
                    </div>

                    <div className='change-password-btns'>
                        <div className="cancell-btn buttons" onClick={()=>{setShowParticularPost(false); document.body.style.overflow="auto"}}>Cancel</div>
                        {!hideSaveBtn ? <div className="save-btn buttons" onClick={saveHandler}>Save</div> : null}
                        {isLoader ?
                            <div className="loader-btn buttons">
                                <img className='loader' src={loader} alt="" />
                            </div>
                        : null}
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ChangePassword;