// 로그인 페이지
import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import api from "../api"
import axios from "axios";
import "./Login.css";
import {useAuth} from "./AuthContext";

const Login = () => {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  //로그인 통신
  const handleLogin = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('loginId', loginId);
    formData.append('password', password);

    try {
      const response = await axios.post("http://localhost:8090/login", formData,{
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if(response.status===200){
        console.log("RESPONSE:", response);
        sessionStorage.setItem('succeed', 'ok');
        login();
      }
      console.log("로그인 성공");
      navigate("/main");
    } catch (error) {
      alert("로그인 실패");
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
