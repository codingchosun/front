import React from "react";
import {useAuth} from "./AuthContext";
import {Link} from "react-router-dom";
import logo from "../images/로고.png";
import "./Main.css";
const Header = () => {
    const { isLogin, logout } = useAuth();

    return(
        <div className="header">
            <div className="logoContainer">
                <Link to="/main">
                    <img src={logo}
                         className="logo"
                         alt="logo"
                    />
                </Link>
            </div>
            <div className="headerButton">
            { isLogin ? (
                <div>
                    <button onClick={logout}>로그아웃</button>
                    <Link to="/mypage"><button>마이페이지</button></Link>
                </div>
            ): (
                <div>
                    <Link to="/login"><button>로그인</button></Link>
                    <Link to="/signup"><button>회원가입</button></Link>
                </div>
            )}
            </div>
        </div>
    );
};

export default Header;