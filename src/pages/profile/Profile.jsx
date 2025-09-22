import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useAuth} from "../../contexts/AuthContext";
import DisplayField from "../../components/common/DisplayField";
import Button from "../../components/common/Button";
import api from "../../api/api";
import "./Profile.css";

const Profile = () => {
    const {loginId} = useParams();
    const {user} = useAuth();
    const [profileData, setProfileData] = useState(null);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const isMyProfile = user && user.loginId === loginId;

    useEffect(() => {
        console.log("현재 로그인된 회원 아이디: ", loginId);
        if (!loginId) {
            setError("사용자를 찾을 수 없습니다");
            return;
        }

        const fetchUserData = async () => {
            try {
                const profileResponse = await api.get(`/api/profile/${loginId}`);

                if (profileResponse.status === 200 && profileResponse.data.success) {
                    setProfileData(profileResponse.data.body);
                }
            } catch (err) {
                console.error("프로필 로딩 실패:", err);
                setError("프로필을 불러올 수 없습니다. 나중에 다시 시도해주세요.");
            }
        };

        fetchUserData();
    }, [loginId]);

    if (error) {
        return <div className="profile-message error">{error}</div>;
    }

    if (!profileData) {
        return <div className="profile-message">사용자를 찾을 수 없습니다.</div>;
    }

    return (
        <div className="profile-container">
            <h2>{profileData.nickname}님의 프로필</h2>

            <DisplayField
                label="자기소개"
                value={profileData.introduction || "작성된 자기소개가 없습니다."}
            />

            <DisplayField
                label="이메일"
                value={profileData.email}
            />

            <DisplayField
                label="매너 점수"
                value={`${profileData.score} / 100점`}
            />

            <div className="profile-section">
                <label className="profile-label">관심사</label>
                <div className="hashtags-container">
                    {profileData.hashtags && profileData.hashtags.length > 0 ? (
                        profileData.hashtags.map((tag, index) => (
                            <span key={index} className="hashtag">{tag}</span>
                        ))
                    ) : (
                        <p className="no-hashtags">등록된 관심사가 없습니다.</p>
                    )}
                </div>
            </div>

            <div className="profile-actions">
                <Button onClick={() => navigate(-1)} className="back-button">뒤로가기</Button>
                {isMyProfile && (
                    <Button onClick={() => navigate('/useredit')} className="edit-button">수정</Button>
                )}
            </div>
        </div>
    );
};

export default Profile;
