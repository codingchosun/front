//아이디 찾기 페이지
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./FindId.css";
const FindId = () => {
    const [email, setEmail]=useState("");
    const [foundId, setFoundId]=useState(null);
    const navigate=useNavigate();

    const handleFindId=async(e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`http://localhost:8090/posts/login`,{email}, {

            });
            console.log("통신정보:", response);
            if (response.status === 200) {
                const data = response.data;
                setFoundId(data.id);
            } else {
                alert('아이디 찾기에 실패했습니다.');
            }

        } catch (error) {
            console.error("통신에러:", error);
        }
    };

    const handleCancel = () => {
        navigate('/login');
    };

    return(
        <div className="findId">
            <h1>아이디 찾기 페이지</h1>
            <form onSubmit={handleFindId}>
                <div className="findIdForm">
                    <label>이메일</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                        placeholder="이메일을 입력하세요"
                        required
                    />
                    </div>
                    <button type="submit">아이디 찾기</button>
                    <button type="button" onClick={handleCancel}>취소</button>
            </form>
            <div className="successFindId">
                {foundId &&
                    (<div className="foundId">
                        <h2>찾은 아이디: {foundId}</h2>
                    </div>)
                }
            </div>
        </div>

    );
};
export default FindId;