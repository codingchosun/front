import React, {useState} from 'react';
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../../contexts/AuthContext";
import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";
import axios from "axios";
import "./Login.css";

const Login = () => {
    const [loginId, setLoginId] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const {login} = useAuth();

    //로그인 통신
    const handleLogin = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('loginId', loginId);
        formData.append('password', password);

        try {
            const response = await axios.post("/login", formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            //로그인이 성공할 경우
            if (response.status === 200) {
                console.log("RESPONSE:", response);
                //TODO: 백엔드에 로그인된 사용자 확인 API 요청 -> response.data 예시 { loginId: '로그인아이디', nickname: '닉네임'}
                login(response.data);

                alert("로그인 성공!!");
                navigate("/main");
            }
        } catch (error) {
            alert("로그인이 실패하였습니다");
            console.error("로그인 오류:", error);
        }
    };

    return (
        <div className="login">
            <form className="login__form" onSubmit={handleLogin}>
                <Input
                    label="아이디"
                    id="loginId"
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                    required
                />

                <Input
                    label="비밀번호"
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <div className="login__button-group">
                    <Button type="submit">로그인</Button>
                    <Button to="/findid">아이디 찾기</Button>
                    <Button to="/findpw">비밀번호 찾기</Button>
                </div>
            </form>
        </div>
    );
};

export default Login;
