// GNB(Global Navigation Bar) : 최상단 메뉴
import React from "react";
import { useAuth } from "./AuthContext";
import { Link, useNavigate } from "react-router-dom";
import logo from "../images/로고.png";
import "./Header.css";
import api from "../api"

const Header = () => {
    const { isLogin, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const response = await api.post("/logout", {},{
            withCredentials: false
        });
        if (response.status===200){
            logout();
            navigate("/");
        }
        console.log("response: ",response);
        } catch (error) {
            console.error("로그아웃 오류: ",error);
        }
    };

    return (
        <div className="header">
            <div className="header__logo-container">
                <Link to="/main">
                    <img src={logo} className="header__logo" alt="logo" />
                </Link>
            </div>
            <div className="header__buttons">
                {isLogin ? (
                    <div className="header__buttons-group">
                        <button className="header__button" onClick={handleLogout}>로그아웃</button>
                        <Link to="/mypage"><button className="header__button">마이페이지</button></Link>
                    </div>
                ) : (
                    <div className="header__buttons-group">
                        <Link to="/login"><button className="header__button">로그인</button></Link>
                        <Link to="/register"><button className="header__button">회원가입</button></Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Header;
