// GNB(Global Navigation Bar) : 최상단 메뉴
import React from "react";
import { useAuth } from "./AuthContext";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../images/로고.png";
import "./Header.css";
import api from "../api"

const Header = () => {
    const { isLogin, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        const response = await api.post("/logout", {},{
        withCredentials: false
        });
        logout();
        localStorage.removeItem('isLogin');
        navigate("/");
        console.log("response: ",response);

    };

    return (
        <div className="header">
            <div className="logoContainer">
                <Link to="/main">
                    <img src={logo} className="logo" alt="logo" />
                </Link>
            </div>
            <div className="headerButton">
                {isLogin ? (
                    <div>
                        <button onClick={handleLogout}>로그아웃</button>
                        <Link to="/mypage"><button>마이페이지</button></Link>
                    </div>
                ) : (
                    <div>
                        <Link to="/login"><button>로그인</button></Link>
                        <Link to="/register"><button>회원가입</button></Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Header;
