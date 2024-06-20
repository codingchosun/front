import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "./UserEdit.css";
import api from "../api";

const UserEdit = () => {
    const { isLogin } = useAuth();
    const navigate = useNavigate();

    const [loginId, setLoginId] = useState(null);

    // 회원정보
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [genderCode, setGenderCode] = useState("");
    const [nickname, setNickname] = useState("");
    const [introduction, setIntroduction] = useState("");
    const [hashList, setHashList] = useState("");

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const userResponse = await api.get("/getloginuser", {
                    withCredentials: true,
                });
                const userId = userResponse.data.user_id;
                const loginId = userResponse.data.login_id;
                setLoginId(loginId);
                console.log("userId: ", userId);
                console.log("loginId: ", loginId);

                const profileResponse = await api.get(`/profile/${loginId}`, {
                    withCredentials: true,
                });
                const profileData = profileResponse.data;
                console.log("profileData: ", profileData);

                setEmail(profileData.email);
                setNickname(profileData.nickname);
                setIntroduction(profileData.introduction);
                setHashList(profileData.hash_names.join(" "));
            } catch (error) {
                console.error("데이터 불러오기 오류:", error);
            }
        };

        // 로그인 값이 true 이면 새로고침
        if (isLogin) {
            fetchUserId();
        }
    }, [isLogin, navigate]);

    // 회원정보 업데이트 이벤트
    const handleUpdate = async (e) => {
        e.preventDefault();

        // 모든 필드가 입력되었는지 확인
        if (!password || !email || !genderCode || !nickname || !introduction || !hashList) {
            alert("모든 칸을 입력해주세요");
            return;
        }

        try {
            const response = await api.post(
                `/profile/${loginId}`,
                {
                    password,
                    email,
                    genderCode,
                    nickname,
                    introduction,
                    hashList: hashList.split(" ").map((tag) => `${tag.trim()}`),
                },
                { withCredentials: true }
            );

            console.log("update: ", response.data);

            if (response.status === 200) {
                alert("회원정보가 성공적으로 수정되었습니다.");
                navigate("/mypage");
            } else {
                alert("회원정보 수정 실패.");
            }
        } catch (error) {
            console.error("회원정보 수정 에러: ", error);
            alert("회원정보 수정 중 에러가 발생했습니다.");
        }
    };

    return (
        <div className="user-edit__container">
            <div className="user-edit__page">
                <h1 className="user-edit__title">회원정보 수정</h1>
                <form onSubmit={handleUpdate}>
                    <div className="user-edit__form-group">
                        <label>비밀번호</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="비밀번호를 입력하세요"
                        />
                    </div>
                    <div className="user-edit__form-group">
                        <label>이메일</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="이메일을 입력하세요"
                        />
                    </div>
                    <div className="user-edit__form-group">
                        <label>성별</label>
                        <select
                            value={genderCode}
                            onChange={(e) => setGenderCode(e.target.value)}
                        >
                            <option value="">성별을 선택하세요</option>
                            <option value="MALE">남자</option>
                            <option value="FEMALE">여자</option>
                        </select>
                    </div>
                    <div className="user-edit__form-group">
                        <label>닉네임</label>
                        <input
                            type="text"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            placeholder="닉네임을 입력하세요"
                        />
                    </div>
                    <div className="user-edit__form-group">
                        <label>자기소개</label>
                        <textarea
                            value={introduction}
                            onChange={(e) => setIntroduction(e.target.value)}
                            placeholder="자기소개를 입력하세요"
                        ></textarea>
                    </div>
                    <div className="user-edit__form-group">
                        <label>해시태그</label>
                        <input
                            type="text"
                            value={hashList}
                            onChange={(e) => setHashList(e.target.value)}
                            placeholder="해시태그를 공백으로 구분하여 입력하세요"
                        />
                    </div>
                    <div className="user-edit__button-container">
                        <button type="submit">수정하기</button>
                        <button type="button" onClick={() => navigate("/mypage")}>
                            취소
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserEdit;
