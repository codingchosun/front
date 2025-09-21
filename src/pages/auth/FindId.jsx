import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import api from "../../api/api";
import "./FindId.css";

const FindId = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [foundId, setFoundId] = useState(null);

    const navigate = useNavigate();

    const handleFindId = async (e) => {
        e.preventDefault();
        setFoundId(null);

        const findLoginIdRequest = {
            name: name,
            email: email
        }

        try {
            const findUserResponse = await api.post('/api/users/login-id', findLoginIdRequest);

            if (findUserResponse.status === 200 && findUserResponse.data.success) {
                console.log("아이디 찾기 응답:", findUserResponse);
                setFoundId(findUserResponse.data.loginId);
            } else {
                alert("일치하는 사용자를 찾을 수 없습니다. 이름과 이메일을 확인해주세요.");
            }
        } catch (error) {
            console.error("아이디 찾기 실패:", error);
            alert("아이디를 찾는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
        }
    };

    const handleCancel = () => {
        navigate(-1);
    };

    return (
        <div className="find-id-container">
            <h2>아이디 찾기</h2>
            <form className="find-id-form" onSubmit={handleFindId}>
                <Input
                    label="이름"
                    id="name"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="가입 시 등록한 이름을 입력하세요"
                    required
                />
                <Input
                    label="이메일"
                    id="email"
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="가입 시 등록한 이메일을 입력하세요"
                    required
                />
                <div className="find-id__button-group">
                    <Button type="submit">아이디 찾기</Button>
                    <Button type="button" onClick={handleCancel} className="cancel-button">취소</Button>
                </div>
            </form>

            <div className="find-id__result">
                {foundId && <p className="success-message">회원님의 아이디는 [ {foundId} ] 입니다.</p>}
            </div>
        </div>
    );
};

export default FindId;