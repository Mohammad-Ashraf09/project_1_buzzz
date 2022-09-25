import { useState } from 'react';

const FormInput = (props) => {
    const [focused, setFocused] = useState(false)
    const {name, type, placeholder, errorMsg, pattern, required, onChange} = props;

    return (
        <>
            {type==="radio" ?
                <div className="gender-div">
                    <div className='gender-title'>
                        <label className='gender-text' htmlFor="">Gender : </label>
                    </div>
                    <div className="gender-radio">
                        <input type="radio" id="male" value="male" defaultChecked name='gender' onClick={onChange}/>
                        <label htmlFor="male">Male</label>
                        <input type="radio" id="female" value="female" name='gender' onClick={onChange} />
                        <label htmlFor="female">Female</label>
                    </div>
                </div>
                :
                <div>
                    <input 
                        type={type} 
                        name={name} 
                        placeholder={placeholder} 
                        pattern={pattern} 
                        required={required} 
                        onChange={onChange} 
                        onBlur={()=>setFocused(true)} 
                        onFocus={()=>name==="confirmPassword" && setFocused(true)}
                        focused={focused.toString()}
                    />
                    <div className='error-msg'>{errorMsg}</div>
                </div>
            }
        </>
    )
}

export default FormInput