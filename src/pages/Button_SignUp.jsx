import {useNavigate} from "react-router-dom";
import SignUp from "./SignUp";

const Button_SignUp=() => {
    const navigate=useNavigate();

    const gotoSignUp=()=>{
        navigate("/signup");
    };

    return(
        <>
            <SignUp onClick={gotoSignUp}>로그인</SignUp>
        </>

    );
};