import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./FindPw.css";
import api from "../api"
const FindPw = () => {
    const [loginId, setloginId] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [foundPw, setFoundPw] = useState(null);
    const navigate = useNavigate();

    const handleFindPw = async (e) => {
        e.preventDefault();
        console.log("Sending request with:", { name, email, loginId });
        try {
            const response = await api.post('/findpassword', {
                name, email, loginId
            });
            if(response.status === 200 && response.data.success) {
                const data = response.data.body;
                console.log("비밀번호찾기 데이터: ", response.data);
                setFoundPw(data);
                alert('비밀번호 찾기에 성공하였습니다');
            } else {
                alert('비밀번호를 찾을 수 없습니다');
            }
        } catch (error) {
            console.error("통신에러:", error);
        }
    };

    const handleCancel = () => {
        navigate('/');
    };

    return (
        <div className="find-pw">
            <h1 className="find-pw__title">비밀번호 찾기</h1>
            <form className="find-pw__form" onSubmit={handleFindPw}>
                <div className="find-pw__form-group">
                    <label className="find-pw__label">이름</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="이름을 입력하세요"
                        required
                        className="find-pw__input"
                    />
                </div>
                <div className="find-pw__form-group">
                    <label className="find-pw__label">이메일</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="이메일을 입력하세요"
                        required
                        className="find-pw__input"
                    />
                </div>
                <div className="find-pw__form-group">
                    <label className="find-pw__label">아이디</label>
                    <input
                        type="text"
                        value={loginId}
                        onChange={(e) => setloginId(e.target.value)}
                        placeholder="아이디를 입력하세요"
                        required
                        className="find-pw__input"
                    />
                </div>

                <div className="find-pw__buttons">
                    <button type="submit" className="find-pw__button">비밀번호 찾기</button>
                    <button type="button" className="find-pw__button" onClick={handleCancel}>취소</button>
                </div>
            </form>
            <div className="find-pw__result">
                {foundPw && (
                    <div className="find-pw__found-pw">
                        <h2 className="find-pw__found-pw-text">찾은 비밀번호: {foundPw}</h2>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FindPw;
