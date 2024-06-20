import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Profile.css";
import api from "../api";
import { useAuth } from "./AuthContext";

const Profile = () => {
    const { isLogin } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [userId, setUserId] = useState(null);
    const [loginId, setLoginId] = useState(null);
    const participant = location.state ? location.state.participantId : null;

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
                console.log("userId: ", userId);
                console.log("loginId: ", loginId);
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
                const response = await api.get(`/profile/${participant}`, { withCredentials: true });
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

    return (
        <div className="profile-container">
            <h1>{nickname} 님의 프로필 페이지 입니다</h1>

            <div className="profile-section profile-introduction">
                <label className="profile-label">자기소개</label>
                <div className="profile-input-wrapper">
                    <input
                        type="text"
                        value={introduction}
                        readOnly
                        placeholder="자기소개를 한줄로 작성하세요"
                        className="profile-input"
                    />
                </div>
            </div>

            <div className="profile-section profile-email">
                <label className="profile-label">이메일</label>
                <div className="profile-input-wrapper">
                    <input
                        type="text"
                        value={email}
                        readOnly
                        placeholder="이메일"
                        className="profile-input"
                    />
                </div>
            </div>

            <div className="profile-section profile-score">
                <h3>매너 점수</h3>
                <div className="mypage__score-figure">
                    <div className="mypage__score-fill" style={{transform: `rotate(${(score / 100) * 360}deg)`}}></div>
                    {score > 50 && <div className="mypage__score-mask"></div>}
                    <p>{score >= 0 && score <= 100 ? score : score}</p>
                </div>
            </div>

            <div className="profile-section profile-hashtags">
                <label className="profile-label">해쉬 태그</label>
                <div className="profile-input-wrapper-hashtags">
                    {hashtags.map((tag, index) => (
                        <input
                            key={index}
                            type="text"
                            value={tag}
                            readOnly
                            placeholder="해쉬태그를 입력하세요"
                            className="profile-input"
                        />
                    ))}
                </div>
            </div>

            <div className="profile-section profile-templates">
                <label className="profile-label">템플릿</label>
                <div className="profile-input-wrapper">
                    {templates.map((template, index) => (
                        <input
                            key={index}
                            type="text"
                            value={template}
                            readOnly
                            placeholder="템플릿을 입력하세요"
                            className="profile-input"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Profile;
