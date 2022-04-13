import axios from "axios";

export const loginCall = async (userData, dispatch) =>{
    dispatch({ type: "LOGIN_START" });
    try{
        const res = await axios.post("auth/login", userData);
        dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
    }
    catch(err){
        dispatch({ type: "LOGIN_FAILURE", payload: err });
    }
};