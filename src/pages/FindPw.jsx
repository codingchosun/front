// 비밀번호 찾기 페이지
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FindPw.css";
import Header from "./Header";
const FindPw = () => {
    const [id, setId] = useState("");
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    //비밀번호 찾기
    const handleFindPw = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8090/api/user/find-pw', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id, email }),
            });
            if (response.ok) {
                alert('비밀번호 찾기에 성공하였습니다');
                navigate('/login');
            } else {
                alert('비밀번호 찾기에 실패했습니다');
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleCancel = () => {
        navigate('/login');
    };
    return(
        <div>
            <div className="findPw">
                <h1>비밀번호 찾기</h1>
                <form onSubmit={handleFindPw}>
                    <div className="findPwForm">
                        <label>아이디</label>
                        <input
                            type="text"
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                            placeholder="아이디를 입력하세요"
                            required
                        />
                    </div>
                    <div className="findPwForm">
                        <label>이메일</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="이메일을 입력하세요"
                            required
                        />
                    </div>
                    <button type="submit">비밀번호 찾기</button>
                    <button type="button" onClick={handleCancel}>취소</button>
                </form>
            </div>
        </div>
    );
};

export default FindPw;