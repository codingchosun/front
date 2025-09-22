import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../contexts/AuthContext";
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Textarea from "../../components/common/Textarea";
import api from "../../api/api";
import "./UserEdit.css";

const UserEdit = () => {
    const {user, updateUser} = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        nickname: '',
        introduction: '',
        hashtags: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [originalData, setOriginalData] = useState({});

    useEffect(() => {
        const newFormData = {
            nickname: user.nickname || '',
            introduction: user.introduction || '',
            hashtags: user.hashtags?.join(' ') || '',
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        };
        setFormData(newFormData);
        setOriginalData({
            nickname: user.nickname || '',
            introduction: user.introduction || '',
            hashtags: user.hashtags?.join(' ') || '',
        });
    }, [user]);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
            alert("새 비밀번호가 일치하지 않습니다.");
            return;
        }

        const updatedData = {};
        if (formData.nickname !== originalData.nickname) {
            updatedData.nickname = formData.nickname;
        }
        if (formData.introduction !== originalData.introduction) {
            updatedData.introduction = formData.introduction;
        }
        if (formData.hashtags !== originalData.hashtags) {
            updatedData.hashtags = formData.hashtags.split(' ').filter(tag => tag);
        }
        if (formData.newPassword) {
            updatedData.currentPassword = formData.currentPassword;
            updatedData.newPassword = formData.newPassword;
        }

        if (Object.keys(updatedData).length === 0) {
            alert("변경된 내용이 없습니다.");
            return;
        }

        try {
            await api.patch('/api/profile/me', updatedData);
            await updateUser(user.loginId);

            alert("변경사항이 적용되었습니다.");
            navigate(`/profile/${user.loginId}`);
        } catch (err) {
            console.error("정보 수정 실패:", err);
            alert(err.response?.data?.message || "정보 수정 중 오류가 발생했습니다.");
        }
    };

    return (
        <div className="user-edit-container">
            <h2>내 정보 수정</h2>
            <form onSubmit={handleSubmit}>
                <Input
                    label="닉네임"
                    id="nickname"
                    name="nickname"
                    value={formData.nickname}
                    onChange={handleChange}
                    placeholder="새 닉네임을 입력하세요"
                />
                <Textarea
                    label="자기소개"
                    id="textarea"
                    name="introduction"
                    value={formData.introduction}
                    onChange={handleChange}
                    placeholder="자기소개를 입력하세요."
                />
                <Input
                    label="해시태그"
                    name="hashtags"
                    value={formData.hashtags}
                    onChange={handleChange}
                    placeholder="해시태그를 공백으로 구분하여 입력하세요 (예: 헬스, 독서, 보드게임)"
                />
                <h3 className="password-change-title">비밀번호 변경</h3>
                <Input
                    label="현재 비밀번호"
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    placeholder="비밀번호 변경 시 필수 입력"
                />
                <Input
                    label="새 비밀번호"
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder="새 비밀번호 (숫자, 영문자 조합 필수)"
                />
                <Input
                    label="새 비밀번호 확인"
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="새 비밀번호를 다시 입력하세요"
                />
                <div className="user-edit-button-group">
                    <Button type="submit">저장하기</Button>
                    <Button type="button" onClick={() => navigate(-1)} className="cancel-button">취소</Button>
                </div>
            </form>
        </div>
    );
};

export default UserEdit;