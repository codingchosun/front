import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../contexts/AuthContext";
import Button from '../../components/common/Button';
import api from "../../api/api";
import "./MyInformation.css";

const MyInformation = () => {
    const navigate = useNavigate();
    const {user, logout} = useAuth();
    const [myInfo, setMyInfo] = useState(null);

    useEffect(() => {
        const fetchMyInfo = async () => {
            if (!user?.loginId) {
                return;
            }

            try {
                const response = await api.get(`/api/profile/${user.loginId}`);
                if (response.data.success) {
                    setMyInfo(response.data.body);
                }
            } catch (err) {
                console.error("내 정보 업데이트에 실패하였습니다", err);
            }
        }

        fetchMyInfo();
    }, [user?.loginId]);

    const handleDeleteAccount = async () => {
        if (window.confirm("정말로 회원 탈퇴를 하시겠습니까?")) {
            try {
                await api.delete('/api/user/me');
                alert("회원 탈퇴가 완료되었습니다.");
                await logout();
                navigate('/');
            } catch (err) {
                console.error("회원 탈퇴 실패:", err);
                alert("회원 탈퇴 중 오류가 발생했습니다.");
            }
        }
    };

    if (!myInfo) {
        return <div className="mypage-error">사용자 정보를 찾을 수 없습니다. 로그인이 필요합니다.</div>;
    }

    return (
        <div className="mypage-container">
            <h2>마이페이지</h2>
            <div className="mypage-info">
                <div className="info-item">
                    <span className="info-label">이름</span>
                    <span className="info-value">{myInfo.name}</span>
                </div>

                <div className="info-item">
                    <span className="info-label">닉네임</span>
                    <span className="info-value">{myInfo.nickname}</span>
                </div>

                <div className="info-item">
                    <span className="info-label">이메일</span>
                    <span className="info-value">{myInfo.email}</span>
                </div>

                <div className="info-item">
                    <span className="info-label">매너 점수</span>
                    <span className="info-value">{myInfo.score}점</span>
                </div>
            </div>

            <div className="mypage-actions">
                <Button onClick={() => navigate('/useredit')}>정보 수정</Button>
                <Button onClick={() => navigate('/my-party')}>내 모임 보기</Button>
                <Button onClick={handleDeleteAccount} className="delete-button">회원 탈퇴</Button>
            </div>
        </div>
    );
};

export default MyInformation;