import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "./UserEdit.css";
import axios from "axios";

const UserEdit = () => {
    const { isLogin, userId } = useAuth();
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [genderCode, setGenderCode] = useState("");
    const [nickname, setNickname] = useState("");
    const [introduction, setIntroduction] = useState("");
    const [hashList, setHashList] = useState("");

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://localhost:8090/profile/${userId}`, { withCredentials: true });
                const data = response.data;

                setEmail(data.email);
                setNickname(data.nickname);
                setIntroduction(data.introduction);
                setHashList(data.hash_names.join(" "));

                console.log("upload: ", data);

            } catch (error) {
                console.error("회원정보 가져오기 에러:", error);
            }
        };

        if (isLogin) {
            fetchUserData();
        } else {
            navigate('/login');
        }
    }, [isLogin, navigate, userId]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`http://localhost:8090/profile/${userId}`, {
                password,
                email,
                genderCode,
                nickname,
                introduction,
                hashList: hashList.split(" ").map(tag => `#${tag.trim()}`)
            }, { withCredentials: true });
            console.log("update: ", response.data);
            if (response.status === 200) {
                alert("회원정보가 성공적으로 수정되었습니다.");
                navigate("/mypage");
            } else {
                alert("회원정보 수정 실패.");
            }
        } catch (error) {
            console.error("회원정보 수정 에러: ", error);
        }
    };

    return (
        <div className="user-edit">
            <h1 className="user-edit__title">회원정보 수정</h1>
            <form className="user-edit__form" onSubmit={handleUpdate}>
                <div className="user-edit__form-group">
                    <label className="user-edit__label">비밀번호</label>
                    <input
                        className="user-edit__input"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="비밀번호를 입력하세요"
                    />
                </div>
                <div className="user-edit__form-group">
                    <label className="user-edit__label">이메일</label>
                    <input
                        className="user-edit__input"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="이메일을 입력하세요"
                    />
                </div>
                <div className="user-edit__form-group">
                    <label className="user-edit__label">성별</label>
                    <select
                        className="user-edit__input"
                        value={genderCode}
                        onChange={(e) => setGenderCode(e.target.value)}
                    >
                        <option value="">성별을 선택하세요</option>
                        <option value="MALE">남자</option>
                        <option value="FEMALE">여자</option>
                    </select>
                </div>
                <div className="user-edit__form-group">
                    <label className="user-edit__label">닉네임</label>
                    <input
                        className="user-edit__input"
                        type="text"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        placeholder="닉네임을 입력하세요"
                    />
                </div>
                <div className="user-edit__form-group">
                    <label className="user-edit__label">자기소개</label>
                    <textarea
                        className="user-edit__textarea"
                        value={introduction}
                        onChange={(e) => setIntroduction(e.target.value)}
                        placeholder="자기소개를 입력하세요"
                    ></textarea>
                </div>
                <div className="user-edit__form-group">
                    <label className="user-edit__label">해시태그</label>
                    <input
                        className="user-edit__input"
                        type="text"
                        value={hashList}
                        onChange={(e) => setHashList(e.target.value)}
                        placeholder="해시태그를 공백으로 구분하여 입력하세요"
                    />
                </div>
                <div className="user-edit__button-container">
                    <button className="user-edit__button" type="submit">수정하기</button>
                    <button className="user-edit__button" type="button" onClick={() => navigate('/mypage')}>취소</button>
                </div>
            </form>
        </div>
    );
};

export default UserEdit;
