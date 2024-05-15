import {useNavigate} from "react-router-dom";
import Login from "./Login";

const Button_Login=() => {
    const navigate=useNavigate();

    const gotoLogin=()=>{
        navigate("/Login");
    };

    return(
        <>
            <Login onClick={gotoLogin}>로그인</Login>
        </>

    );
};