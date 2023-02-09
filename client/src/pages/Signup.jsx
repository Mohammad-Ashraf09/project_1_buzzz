import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FormInput from '../components/FormInput';
import TopbarForLogin from '../components/TopbarForLogin';

const Signup = () => {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const banner = PF+"default-dp.png";
    const dummy01 = PF+"sample-dp-01.jpg";
    const dummy02 = PF+"sample-dp-02.jpg";
    const dummy03 = PF+"sample-dp-03.jpg";
    const dummy04 = PF+"sample-dp-04.jpg";
    const dummy05 = PF+"sample-dp-05.jpg";
    const dummy06 = PF+"sample-dp-06.jpg";
    const dummy07 = PF+"sample-dp-07.jpg";
    const dummy08 = PF+"sample-dp-08.jpg";
    const dummy09 = PF+"sample-dp-09.jpg";
    const dummy10 = PF+"sample-dp-10.png";
    const dummy11 = PF+"sample-dp-11.jpg";
    const dummy12 = PF+"sample-dp-12.jpg";

    const [disable, setDisable] = useState(true);
    const [currentDP, setCurrentDP] = useState(banner);
    const [dpPreview, setDpPreview] = useState();
    const navigate = useNavigate();
    const [values, setValues] = useState({
        fname:"",
        lname:"",
        gender:"male",
        email:"",
        phone:"",
        password:"",
        confirmPassword:"",
        profilePicture:"",
    });


    const inputs = [
        {
            id: 1,
            name: "fname",
            type: "text",
            placeholder: "First Name",
            errorMsg: "First Name should be 3-16 characters and shouldn't include any special character!",
            pattern:"^[A-Za-z]{3,16}$",
            required: true,
        },
        {
            id: 2,
            name: "lname",
            type: "text",
            placeholder: "Last Name",
            errorMsg: "Last Name should be 3-16 characters and shouldn't include any special character!",
            pattern:"^[A-Za-z]{3,16}$",
            required: true,
        },
        {
            id: 3,
            name: "gender",
            type: "radio",
            placeholder: "",
        },
        {
            id: 4,
            name: "email",
            type: "text",
            placeholder: "Email",
            errorMsg: "It should be a valid email address!",
            pattern: "^(?=.*[.])(?=.*[@])(?=.*[a-z])[a-z0-9.@]{10,50}$",
            required: true,
        },
        {
            id: 5,
            name: "phone",
            type: "text",
            placeholder: "Phone",
            errorMsg: "Phone number should contains 10 digits!",
            pattern:"^[0-9]{10}$",
            required: true,
        },
        {
            id: 6,
            name: "password",
            type: "password",
            placeholder: "Password",
            errorMsg: "Password should be 8-20 character and include at least 1 capital letter, 1 number and 1 special character!",
            pattern:"^(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,20}$",
            required: true,
        },
        {
            id: 7,
            name: "confirmPassword",
            type: "password",
            placeholder: "Confirm Password",
            errorMsg: "Passwords don't match!",
            pattern: values.password,
            required: true,
        },
    ]

    const disableHandler = () =>{
        setDisable(!disable);
    }

    const onChange = (e)=>{
        setValues({...values, [e.target.name]: e.target.value});
    }

    const dpHandler = (dp) => {
        setCurrentDP(dp)
        setDpPreview(null);
    }

    const dpFromGalleryHandler = (e) =>{
        if(e.target.files[0]){
            const objectUrl = URL.createObjectURL(e.target.files[0]);
            setDpPreview(objectUrl);
            setCurrentDP(e.target.files[0]);
        }
    }

    const saveHandler = async(e) =>{
        e.preventDefault();

        if(typeof(currentDP)==='string'){
            const arr = currentDP.split("/")
            values.profilePicture = arr[arr.length-1]
        }
        else{
            const data = new FormData();
            const fileName = Date.now() + currentDP.name;
            data.append("name", fileName);
            data.append("file", currentDP)
            values.profilePicture = fileName;

            try{
                await axios.post("/upload", data)        // to upload photo into local storage
              }catch(err){
                console.log(err)
            }
        }
        
        try{
            await axios.post("/auth/register", values);
            navigate("/login");
        }catch(err){
            console.log(err);
        }
    }

    return (
        <>
            <TopbarForLogin/>
            <div className='signup-container'>
                <div className="signup-box">
                    <form className="left" onSubmit={saveHandler}>
                        <h1>Sign Up</h1>

                        <div className="input-section">
                            {inputs.map((item)=>(
                                <FormInput key={item.id} name={item.name} type={item.type} placeholder={item.placeholder} errorMsg={item.errorMsg} pattern={item.pattern} required={item.required} values={values[item.name]} onChange={onChange} />
                            ))}
                        </div>

                        <div className="agreement-div">
                            <input className='agreement' type="checkbox" name="agreement" onClick={disableHandler}/>
                            <label htmlFor="agreement"> I agree all statements in <a href="">Terms of Service</a></label>
                        </div>

                        <div className='bottom'>
                            <button type='submit' className="register-btn" disabled={disable}>Register</button>
                            <Link to="/login" className='existing-member'>Already a Member?</Link>
                        </div>
                    </form>

                    <div className='vertical-line'></div>
                
                    <div className="right">
                        {dpPreview ?
                            <img className="profile-picture" src={dpPreview} alt='profile'/>
                            :
                            <img className='profile-picture' src={currentDP} alt="" />
                        }
                        <div className='dummy-profile-div-male'>
                            <img className='dummy-profile-picture' src={dummy01} alt="" onClick={()=>dpHandler(dummy01)} />
                            <img className='dummy-profile-picture' src={dummy02} alt="" onClick={()=>dpHandler(dummy02)} />
                            <img className='dummy-profile-picture' src={dummy03} alt="" onClick={()=>dpHandler(dummy03)} />
                            <img className='dummy-profile-picture' src={dummy04} alt="" onClick={()=>dpHandler(dummy04)} />
                            <img className='dummy-profile-picture' src={dummy05} alt="" onClick={()=>dpHandler(dummy05)} />
                            <img className='dummy-profile-picture' src={dummy06} alt="" onClick={()=>dpHandler(dummy06)} />
                        </div>
                        <div className='dummy-profile-div-female'>
                            <img className='dummy-profile-picture' src={dummy07} alt="" onClick={()=>dpHandler(dummy07)} />
                            <img className='dummy-profile-picture' src={dummy08} alt="" onClick={()=>dpHandler(dummy08)} />
                            <img className='dummy-profile-picture' src={dummy09} alt="" onClick={()=>dpHandler(dummy09)} />
                            <img className='dummy-profile-picture' src={dummy10} alt="" onClick={()=>dpHandler(dummy10)} />
                            <img className='dummy-profile-picture' src={dummy11} alt="" onClick={()=>dpHandler(dummy11)} />
                            <img className='dummy-profile-picture' src={dummy12} alt="" onClick={()=>dpHandler(dummy12)} />
                        </div>
                        <div className='choose-dp-div'>
                            <p className='-or'>OR</p>
                            <div className='choose-remove-dp'>
                                <label htmlFor="dp">
                                    <div className='choose-from-gallery'>Choose From Gallery</div>
                                    <input style={{display:"none"}} type="file" id="dp" name="file" accept='.jpg, .png, .jpeg' onChange={dpFromGalleryHandler}/>
                                </label>
                                
                                <div className='choose-from-gallery' onClick={()=>{setCurrentDP(banner); setDpPreview(null)}}>Remove DP</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div> 
        </>
    )
}

export default Signup;