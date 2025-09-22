import React from "react";
import {useAuth} from "../../contexts/AuthContext";
import {Link, useNavigate} from "react-router-dom";
import bridgeLogo from "../../assets/images/bridge.png";
import "./GlobalNavigationBar.css";

const GlobalNavigationBar = () => {
    const {isLoggedIn, user, logout} = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        alert("로그아웃 되었습니다")
        navigate("/main");
    };

    return (
        <header className="gnb-container">
            <div className="gnb-logo">
                <Link to="/main">
                    <img src={bridgeLogo} alt="Bridge Logo" className="gnb-logo-image"/>
                </Link>
            </div>

            <nav className="gnb-menu">
                {isLoggedIn ? (
                    <div className="gnb-user-menu">
                        <span className="gnb-welcome-message">{user?.nickname}님 환영합니다!</span>
                        <Link to="/my-information" className="gnb-button">내 정보</Link>
                        <Link to={`/profile/${user?.loginId}`} className="gnb-button">프로필</Link>
                        <button onClick={handleLogout} className="gnb-button">로그아웃</button>
                    </div>
                ) : (
                    <div className="gnb-guest-menu">
                        <Link to="/login" className="gnb-button">로그인</Link>
                        <Link to="/register" className="gnb-button">회원가입</Link>
                    </div>
                )}
            </nav>
        </header>
    );
};

export default GlobalNavigationBar;
