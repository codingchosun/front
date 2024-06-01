// 로그인 페이지
import React, { useState } from 'react';
import axios from 'axios';
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from './AuthContext';

const Login = () => {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8090/login", {
        loginId: loginId,
        password: password
      }, {
        withCredentials: true
      });
      console.log("로그인정보:", response);
      localStorage.setItem('isLogin: ', 'true');
      const userId = JSON.parse(response.config.data).loginId;
      console.log("응답데이터:",response.userId);

      console.log("userId:", userId);
      login(userId);

      navigate("/main");
    } catch (error) {
      console.error("로그인 오류:", error);
    }
  };

  return (
      <div className="login">
        <form className="login__form" onSubmit={handleLogin}>
          <div className="login__form-group">
            <label htmlFor="loginId">아이디</label>
            <input
                type="text"
                id="loginId"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                required
            />
          </div>
          <div className="login__form-group">
            <label htmlFor="password">비밀번호</label>
            <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
          </div>
          <div className="login__button-group">
            <button type="submit" className="login__button">로그인</button>
            <Link to="/findid" className="login__button">아이디 찾기</Link>
            <Link to="/findpw" className="login__button">비밀번호 찾기</Link>
          </div>
        </form>
      </div>
  );
};

export default Login;
