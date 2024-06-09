// 회원가입 페이지
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Register.css";
import api from "../api";
const Register = () => {
    const [userData, setUserData]=useState({
        name: '',
        loginId: '',
        password: '',
        email: '',
        genderCode: '',
        birth: '',
        nickname: ''
    });

    const navigate=useNavigate();

    const handleChange = (e) => {
        const {name, value}=e.target;
        setUserData((prevData)=> ({...prevData, [name] : value}));
    };

    const handleRegister = async (e) => {
    e.preventDefault();
    try {
        const response = await api.post('/register',userData,{
            headers: {
                'Content-Type': 'application/json',
            },
        });
        console.log("회원가입 성공: ",response.data);
        alert("회원가입이 완료되었습니다 ");
        navigate('/login');
    } catch (error) {
        console.error("회원가입 실패 에러: ",error);
        alert("회원가입에 실패되었습니다 다시 시도해주세요");
    }
    };

    const handleCancel = () => {
        navigate(-1);
    }

    return (
        <form onSubmit={handleRegister}>
            <div>
                <label>이름</label>
                <input
                    type="text"
                    name="name"
                    value={userData.name}
                    onChange={handleChange}
                    placeholder={"이름"}
                />
            </div>
            <div>
                <label>아이디</label>
                <input
                    type="text"
                    name="loginId"
                    value={userData.loginId}
                    onChange={handleChange}
                    placeholder={"아이디는 2~14이하로 만들어주세요"}
                />
                {/*<button*/}
                {/*    type="button"*/}
                {/*    onClick={handleCheckId}*/}
                {/*    disabled={isCheckId}*/}
                {/*    />*/}
                    {/* { isCheckId ? "중복 확인중" : "중복 확인 완료"}</button>*/}
                    {/*{isIdOverlap !== null && (*/}
                    {/*    <span>*/}
                    {/*    {isIdOverlap ? "사용 가능한 아이디입니다." : "이미 사용 중인 아이디입니다."}*/}
                    {/*  </span>*/}
                {/*)}*/}
            </div>
            <div>
                <label>비밀번호</label>
                <input
                    type="password"
                    name="password"
                    value={userData.password}
                    onChange={handleChange}
                    placeholder={"영문 대소문자와 숫자를 포함한 6~14 이하로 만들어주세요"}
                />
            </div>
            {/*<div>*/}
            {/*    <label>비밀번호확인</label>*/}
            {/*    <input*/}
            {/*        type="password"*/}
            {/*        // value={checkPw}*/}
            {/*        // onChange={onChangeCheckPw}*/}
            {/*        placeholder={"비밀번호와 똑같이 입력해주세요"}*/}
            {/*    />*/}
            {/*</div>*/}
            <div>
                <label>이메일</label>
                <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleChange}
                placeholder={"이메일을 입력해주세요"}
                />
            </div>
            <div>
                <label>성별</label>
                <select
                    name="genderCode"
                    value={userData.genderCode}
                    onChange={handleChange}>
                    <option value="">성별</option>
                    <option value="MALE">남성</option>
                    <option value="FEMALE">여성</option>
                    {/*<option value="others">고르지않음</option>*/}
                </select>
            </div>
            <div>
                <label>생년월일</label>
                <input
                    type="date"
                    name="birth"
                    value={userData.birth}
                    onChange={handleChange} />
            </div>
            <div>
                <label>닉네임</label>
                <input
                    type="text"
                    name="nickname"
                    value={userData.nickname}
                    onChange={handleChange} />
            </div>
            <div>
                <button type="submit">회원가입</button>
                <button type="button" onClick={handleCancel}>취소</button>
            </div>
        </form>
    );
};

export default Register;
