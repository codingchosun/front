import React from "react";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../contexts/AuthContext";
import Button from '../../components/common/Button';
import api from "../../api/api";
import "./MyPage.css";

const MyInformation = () => {
    const navigate = useNavigate();
    const {user, logout} = useAuth();

    const handleLogout = async () => {
        await logout();
        alert('로그아웃 되었습니다.');
        navigate('/login');
    };

    const handleDeleteAccount = async () => {
        if (window.confirm("정말로 회원 탈퇴를 하시겠습니까?")) {
            try {
                await api.post('/delete');
                alert("회원 탈퇴가 완료되었습니다.");
                await logout();
                navigate('/');
            } catch (err) {
                console.error("회원 탈퇴 실패:", err);
                alert("회원 탈퇴 중 오류가 발생했습니다.");
            }
        }
    };

    if (!user) {
        return <div className="mypage-error">사용자 정보를 찾을 수 없습니다. 로그인이 필요합니다.</div>;
    }

    return (
        <div className="mypage-container">
            <h2>마이페이지</h2>
            <div className="mypage-info">
                <div className="info-item">
                    <span className="info-label">이름</span>
                    <span className="info-value">{user.name}</span>
                </div>

                <div className="info-item">
                    <span className="info-label">닉네임</span>
                    <span className="info-value">{user.nickname}</span>
                </div>

                <div className="info-item">
                    <span className="info-label">이메일</span>
                    <span className="info-value">{user.email}</span>
                </div>

                <div className="info-item">
                    <span className="info-label">매너 점수</span>
                    <span className="info-value">{user.score}점</span>
                </div>
            </div>

            <div className="mypage-actions">
                <Button onClick={() => navigate('/useredit')}>정보 수정</Button>
                <Button onClick={() => navigate('/myparty')}>내 모임 보기</Button>
                <Button onClick={handleLogout} className="logout-button">로그아웃</Button>
                <Button onClick={handleDeleteAccount} className="delete-button">회원 탈퇴</Button>
            </div>
        </div>
    );
};

export default MyInformation;
