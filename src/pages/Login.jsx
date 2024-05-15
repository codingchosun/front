//로그인 페이지
// 1. 아이디 입력 박스
// 2. 비밀번호 입력 박스
// 3. 버튼(로그인, 아이디찾기, 비밀번호찾기, 회원가입찾기)
// 4. 소셜로그인 아이콘(이미지 필요)
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {useAuth} from "./AuthContext";
import "./Login.css";
import logo from "../images/로고.png";

const Login = () => {
  const [inputId, setInputId] = useState("");
  const [inputPw, setInputPw] = useState("");
  const navigate = useNavigate(); //페이지 이동에 사용할 네비게이션
  const {login}=useAuth();
  // ID 입력
  const handleChangeId = (e) => {
    setInputId(e.target.value);
  };
  //PW 입력
  const handleChangePw = (e) => {
    setInputPw(e.target.value);
  };
  //로그인 처리
  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    if (!inputId || !inputPw) {
      alert("아이디 또는 비밀번호를 입력하세요");
      return;
    }
    console.log("로그인 시도", inputId, inputPw); // 콘솔창에 입력한 아이디, 비밀번호 출력 >> 나중에 삭제
    // 로그인 요청을 백엔드에 보냄
    try {
      const response = await fetch("http://localhost:8090", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: inputId, password: inputPw }),
      });
      if (response.ok) {
        login();
        navigate("/main");
      } else {
        alert("로그인에 실패했습니다. 아이디와 비밀번호를 확인하세요.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("서버와의 통신 중 오류가 발생했습니다.");
    }
  };

  //아이디 찾기 버튼 클릭 이벤트
  const onClickFindId = () => {
    console.log("아이디 찾기 버튼 클릭");
    navigate("/FindId"); //아이디 찾기 페이지 경로추가
  };

  //비밀번호 찾기 버튼 클릭 이벤트
  const onClickFindPw = () => {
    console.log("비밀번호 찾기 버튼 클릭");
    navigate("/FindPw"); //비밀번호 찾기 페이지 경로추가
  };

  //회원가입 버튼 클릭 이벤트
  const onClickSignUp = () => {
    console.log("회원가입 버튼 클릭");
    navigate("/SignUp");
  };

  return (
    <div className="SignIn">
        <Link to="/main">
          <img src={logo} className="imglogo" alt={logo}/>
        </Link>

      <form onSubmit={handleSubmitLogin}>
        <div>
          <label>ID</label>
          <input
            type="text"
            id="input_id"
            name="input_id"
            placeholder="아이디를 입력하세요"
            value={inputId}
            onChange={handleChangeId}
          />
        </div>

        <div>
          <label>PW</label>
          <input
            type="password"
            id="input_pw"
            name="input_pw"
            placeholder="비밀번호를 입력하세요"
            value={inputPw}
            onChange={handleChangePw}
          />
        </div>

        <div className="btnGroup">
          <button type="submit" className="btnLogin">
            로그인
          </button>
          <button type="button" onClick={onClickFindId}>
            아이디찾기
          </button>
          <button type="button" onClick={onClickFindPw}>
            비밀번호찾기
          </button>
          <button type="button" onClick={onClickSignUp}>
            회원가입
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
