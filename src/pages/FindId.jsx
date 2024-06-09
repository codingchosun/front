//아이디 찾기 페이지
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./FindId.css";
import api from "../api"
const FindId = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [foundId, setFoundId] = useState(null);

    const navigate=useNavigate();

    const handleFindId=async(e) => {
        e.preventDefault();
        try {
            const response = await api.post(`/findId`,{
                name, email
            });
            console.log("아이디찾기 데이터:", response);  // 로그 출력
            const data = response.data.body;  // 응답 데이터에서 body 추출
            setFoundId(data);
        } catch (error) {
            console.error("통신에러:", error);
        }
    };


    const handleCancel = () => {
        navigate('/');
    };

    return(
        <div className="find-id">
            <h1 className="find-id__title">아이디 찾기 페이지</h1>
            <form className="find-id__form" onSubmit={handleFindId}>
                <div className="find-id__form-group">
                    <label className="find-id__label">이름</label>
                    <input
                        type="name"
                        value={name}
                        onChange={(e)=> setName(e.target.value)}
                        placeholder="이름을 입력하세요"
                        required
                    />
                </div>
                    <div className="find-id__form-group">
                        <label className="find-id__label">이메일</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="이메일을 입력하세요"
                            required
                        />
                    </div>
                <div className="find-id__buttons">
                    <button type="submit" className="find-id__button">아이디 찾기</button>
                    <button type="button" className="find-id__button" onClick={handleCancel}>취소</button>
                </div>
            </form>
            <div className="find-id__result">
                {foundId && (
                    <div className="find-id__found-id">
                        <h2 className="find-id__found-id-text">찾은 아이디: {foundId}</h2>
                    </div>)
                }
            </div>
        </div>

    );
};
export default FindId;