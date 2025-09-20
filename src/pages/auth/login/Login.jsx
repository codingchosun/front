import React, {useState} from 'react';
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../../contexts/AuthContext";
import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";
import api from "../../../api/api";
import "./Login.css";

const Login = () => {
    const [loginId, setLoginId] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { updateUser } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();

        const loginRequest = {
            loginId: loginId,
            password: password
        };

        try {
            const loginResponse = await api.post("/login", loginRequest);

            if (loginResponse.status === 200 && loginResponse.data.success) {
                console.log("loginResponse:", loginResponse);
                await updateUser(loginId);

                alert(loginResponse.data.body.nickname + "님 환영합니다.");
                navigate("/main");
            }
        } catch (error) {
            alert("로그인 처리에 문제가 발생하였습니다");
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
