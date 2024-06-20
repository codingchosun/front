import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "./MyPage.css";
import api from "../api";

const MyPage = () => {
    const {isLogin, logout} = useAuth();

    const navigate = useNavigate();

    const [userId, setUserId] = useState(null);
    const [loginId, setLoginId] = useState(null);
    const [nickname, setNickname] = useState('');
    const [introduction, setIntroduction] = useState('');
    const [email, setEmail] = useState('');
    const [score, setScore] = useState(0);
    const [hashtags, setHashtags] = useState([]);
    const [templates, setTemplates] = useState([]);

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const response = await api.get("/getloginuser", {
                    withCredentials: true
                });
                setUserId(response.data.user_id);
                setLoginId(response.data.login_id);
            } catch (error) {
                console.error("사용자 확인 오류:", error);
                navigate('/login');
            }
        };

        if (isLogin) {
            fetchUserId();
        }
    }, [isLogin, navigate, loginId, userId]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await api.get(`/profile/${loginId}`, {withCredentials: true});
                const data = response.data;
                setNickname(data.nickname);
                setIntroduction(data.introduction);
                setEmail(data.email);
                setScore(data.score);
                setHashtags(data.hash_names);
                setTemplates(data.template_names);
            } catch (error) {
                console.error("정보 가져오기 에러:", error);
            }
        };

        if (userId) {
            fetchUserData();
        }
    }, [userId]);

    const handleDeleteAccount = async () => {
        try {
            const response = await api.get(`/deleteAccount`, {withCredentials: true});
            const data = response.data;
            if (data.success) {
                alert('회원탈퇴가 완료되었습니다');
                logout();
                navigate('/main');
            } else {
                alert('회원탈퇴 실패.');
            }
        } catch (error) {
            console.error("회원탈퇴 에러:", error);
            alert('회원탈퇴 에러 발생.');
        }
    };

    return (
        <div className="mypage">
            <h1>{nickname} 님의 마이페이지 입니다</h1>

            <div className="mypage__section mypage__section--introduction">
                <label className="mypage__label">자기소개</label>
                <div className="mypage__input-wrapper">
                    <input
                        type="text"
                        value={introduction}
                        readOnly
                        placeholder="자기소개를 한줄로 작성하세요"
                        className="mypage__input"
                    />
                </div>
            </div>

            <div className="mypage__section mypage__section--email">
                <label className="mypage__label">이메일</label>
                <div className="mypage__input-wrapper">
                    <input
                        type="text"
                        value={email}
                        readOnly
                        placeholder="이메일"
                        className="mypage__input"
                    />
                </div>
            </div>

            <div className="mypage__section mypage__section--score">
                <h3>매너 점수</h3>
                <div className="mypage__score-figure">
                    <div className="mypage__score-fill" style={{transform: `rotate(${(score / 100) * 360}deg)`}}></div>
                    {score > 50 && <div className="mypage__score-mask"></div>}
                    <p>{score >= 0 && score <= 100 ? score : score}</p>
                </div>
            </div>


            <div className="mypage__section mypage__section--hashtags">
                <label className="mypage__label">해쉬 태그</label>
                <div className="mypage__input-wrapper-hashtags">
                    {hashtags.map((tag, index) => (
                        <input
                            key={index}
                            type="text"
                            value={tag}
                            readOnly
                            placeholder="해쉬태그를 입력하세요"
                            className="mypage__input"
                        />
                    ))}
                </div>
            </div>

            <div className="mypage__section mypage__section--templates">
                <label className="mypage__label">템플릿</label>
                <div className="mypage__input-wrapper">
                    {templates.map((template, index) => (
                        <input
                            key={index}
                            type="text"
                            value={template}
                            readOnly
                            placeholder="템플릿을 입력하세요"
                            className="mypage__input"
                        />
                    ))}
                </div>
            </div>

            <div className="mypage__button-container">
                <Link to="/useredit" className="mypage__button-link">
                    <button className="mypage__button">회원정보 수정</button>
                </Link>
                <Link to="/myparty" className="mypage__button-link">
                    <button className="mypage__button">참여한 모임 목록</button>
                </Link>
                <button onClick={handleDeleteAccount} className="mypage__button">회원탈퇴</button>
            </div>
        </div>
    );
};

export default MyPage;
