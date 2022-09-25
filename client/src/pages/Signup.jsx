import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FormInput from '../components/FormInput';
import TopbarForLogin from '../components/TopbarForLogin';

const Signup = () => {

    const [disable, setDisable] = useState(true);
    const navigate = useNavigate();
    const [values, setValues] = useState({
        fname:"",
        lname:"",
        gender:"male",
        email:"",
        phone:"",
        password:"",
        confirmPassword:"",
    });

    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const banner = PF+"signup_banner.jpg";

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
            type: "email",
            placeholder: "Email",
            errorMsg: "It should be a valid email address!",
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
            errorMsg: "Password should be 8-20 character and include at least 1 letter, 1 number and 1 special character!",
            pattern:"^(?=.*[0-9])(?=.*[A-Za-z])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,20}$",
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

    const clickHandler = async(e) =>{
        e.preventDefault();
        
        try{
            console.log(values)
            await axios.post("/auth/register", values);
            navigate("/login");
        }catch(err){
            console.log(err);
        } 
    }

    const disableHandler = () =>{
        setDisable(!disable);
    }

    const onChange = (e)=>{
        setValues({...values, [e.target.name]: e.target.value});
    }

    //console.log(values);

    
    return (
        <div className='signup-container'>
            <TopbarForLogin/>
            <div className="signup-box">
                <form className="left" onSubmit={clickHandler}>
                    <h1>Sign up</h1>

                    <div className="input-section">
                        {inputs.map((item)=>(
                            <FormInput key={item.id} name={item.name} type={item.type} placeholder={item.placeholder} errorMsg={item.errorMsg} pattern={item.pattern} required={item.required} values={values[item.name]} onChange={onChange} />
                        ))}
                    </div>

                    <div className="agreement-div">
                        <input type="checkbox" id="agreement" name="agreement" onClick={disableHandler}/>
                        <label htmlFor="agreement"> I agree all statements in <a href="">Terms of Service</a></label>
                    </div>
                    <button type="submit" className="register-btn" disabled={disable}>Register</button>
                    <Link to="/login" id='existing-member-hidden'>Already a Member?</Link>
                </form>
            
                <div className="right">
                    <img src={banner} alt="" className="banner-img" />
                    <Link to="/login" id='existing-member'>Already a Member?</Link>
                </div>
            </div>
        </div> 
    )
}

export default Signup