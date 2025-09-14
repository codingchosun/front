import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import DisplayField from "../../components/common/DisplayField";
import Button from "../../components/common/Button";
import axios from "axios";
import "./Profile.css";

const Profile = () => {
    const {userId} = useParams();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (!userId) {
            setError("userId 문제 발생");
            setLoading(false);
            return;
        }

        const fetchUserData = async () => {
            try {
                const response = await axios.get(`/profile/${userId}`);
                setProfileData(response.data);
            } catch (err) {
                console.error("프로필 로딩 실패:", err);
                setError("프로필을 불러올 수 없습니다. 나중에 다시 시도해주세요.");
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [userId]);

    if (loading) {
        return <div className="profile-message">프로필 로딩 중...</div>;
    }

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
                    {profileData.hash_names && profileData.hash_names.length > 0 ? (
                        profileData.hash_names.map((tag, index) => (
                            <span key={index} className="hashtag">{tag}</span>
                        ))
                    ) : (
                        <p className="no-hashtags">등록된 관심사가 없습니다.</p>
                    )}
                </div>
            </div>

            <Button onClick={() => navigate(-1)} className="back-button">뒤로가기</Button>
        </div>
    );
};

export default Profile;
