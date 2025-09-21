import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import api from "../../api/api";
import "./FindPw.css";

const FindPw = () => {
    const [loginId, setLoginId] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const navigate = useNavigate();

    const handleFindPw = async (e) => {
        e.preventDefault();

        const findPasswordRequest = {
            name: name,
            loginId: loginId,
            email: email
        }

        try {
            const response = await api.post('/api/users/password', findPasswordRequest)

            if (response.status === 200 && response.data.success) {
                console.log("비밀번호 찾기 응답: ", response);
            }
        } catch (error) {
            console.error("비밀번호 찾기 실패:", error);
            alert('입력하신 정보와 일치하는 사용자가 없습니다.');
        }
    };

    const handleCancel = () => {
        navigate(-1);
    };

    return (
        <div className="find-pw-container">
            <h2>비밀번호 찾기</h2>

            <form className="find-pw-form" onSubmit={handleFindPw}>
                <Input
                    label="이름"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="이름을 입력하세요"
                    required
                />

                <Input
                    label="이메일"
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="등록한 이메일을 입력하세요"
                    required
                />

                <Input
                    label="아이디"
                    name="loginId"
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                    placeholder="아이디를 입력하세요"
                    required
                />

                <div className="find-pw__button-group">
                    <Button type="submit">비밀번호 찾기</Button>
                    <Button type="button" onClick={handleCancel} className="cancel-button">
                        취소
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default FindPw;
