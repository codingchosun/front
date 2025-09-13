import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";
import Select from "../../../components/common/Select";
import axios from "axios";
import "./Register.css";

const Register = () => {
    const [userData, setUserData] = useState({
        name: '',
        loginId: '',
        password: '',
        emailId: '',
        emailDomain: '',
        genderCode: '',
        birth: '',
        nickname: ''
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const {name, value} = e.target;
        setUserData((prevData) => ({...prevData, [name]: value}));
    };

    const handleDomainSelect = (e) => {
        const selectedDomain = e.target.value;

        setUserData((prevData) => ({
            ...prevData,
            emailDomain: selectedDomain === "direct" ? "" : selectedDomain,
        }));
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        const fullEmail = `${userData.emailId}@${userData.emailDomain}`;
        const transmissionData = {...userData, email: fullEmail};
        delete transmissionData.emailId;
        delete transmissionData.emailDomain;

        try {
            const response = await axios.post('/register', transmissionData);

            if (response.status === 200) {
                console.log("회원가입 성공: ", response.data);
                alert("회원가입이 완료되었습니다 ");
                navigate('/login');
            }
        } catch (error) {
            console.error("회원가입 실패: ", error);
            alert("회원가입에 실패하였습니다. 다시 시도해주세요");
        }
    };

    const handleCancel = () => {
        navigate(-1);
    }

    const genders = [
        {value: "", label: "성별 선택"},
        {value: "MALE", label: "남성"},
        {value: "FEMALE", label: "여성"},
    ];

    return (
        <form className="register-form" onSubmit={handleRegister}>
            <h2>회원가입</h2>
            <Input
                label="이름"
                name="name"
                value={userData.name}
                onChange={handleChange}
                placeholder="이름"
            />

            <Input
                label="아이디"
                name="loginId"
                value={userData.loginId}
                onChange={handleChange}
                placeholder="2~14자 사이로 입력해주세요"
            />

            <Input
                label="비밀번호"
                type="password"
                name="password"
                value={userData.password}
                onChange={handleChange}
                placeholder="영문, 숫자를 포함한 6~14자로 입력해주세요"
            />

            <div className="form-group">
                <label>이메일</label>

                <div className="email-input-group">
                    <input
                        className="email-id-input"
                        name="emailId"
                        value={userData.emailId}
                        onChange={handleChange}
                        placeholder="이메일"
                    />

                    <span className="email-at">@</span>

                    <input
                        className="email-domain-input"
                        name="emailDomain"
                        value={userData.emailDomain}
                        onChange={handleChange}
                        placeholder="도메인"
                    />

                    <select className="email-domain-select" onChange={handleDomainSelect}>
                        <option value="direct">직접입력</option>
                        <option value="naver.com">naver.com</option>
                        <option value="gmail.com">gmail.com</option>
                        <option value="kakao.com">kakao.com</option>
                    </select>
                </div>
            </div>

            <div className="form-row">
                <Select
                    label="성별"
                    name="genderCode"
                    value={userData.genderCode}
                    onChange={handleChange}
                    options={genders}
                />

                <Input
                    label="생년월일"
                    type="date"
                    name="birth"
                    value={userData.birth}
                    onChange={handleChange}
                />
            </div>

            <Input
                label="닉네임"
                name="nickname"
                value={userData.nickname}
                onChange={handleChange}
            />

            <div className="register-form__button-group">
                <Button type="submit">회원가입</Button>
                <Button type="button" onClick={handleCancel}>취소</Button>
            </div>
        </form>
    );
};

export default Register;
