import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import axios from 'axios';
import "./UserEdit.css";

const UserEdit = () => {
    const [formData, setFormData] = useState({
        nickname: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [originalNickname, setOriginalNickname] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get('/api/user');
                setFormData(prev => ({...prev, nickname: response.data.nickname,}));
                setOriginalNickname(response.data.nickname);
            } catch (err) {
                console.error("사용자 정보 불러오기 실패:", err);
                setError("사용자 정보를 불러오는데 실패했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

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

        try {
            const updatedData = {};
            if (formData.nickname !== originalNickname) {
                updatedData.nickname = formData.nickname;
            }
            if (formData.newPassword) {
                updatedData.currentPassword = formData.currentPassword;
                updatedData.newPassword = formData.newPassword;
            }

            if (Object.keys(updatedData).length === 0) {
                alert("변경된 내용이 없습니다.");
                return;
            }

            await axios.patch('/api/user', updatedData);
            alert("정보가 성공적으로 수정되었습니다.");
            navigate('/mypage');

        } catch (err) {
            console.error("정보 수정 실패:", err);
            alert(err.response?.data?.message || "정보 수정 중 오류가 발생했습니다.");
        }
    };

    if (loading) return <div>로딩 중...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="user-edit-container">
            <h2>개인정보 수정</h2>

            <form onSubmit={handleSubmit}>
                <Input
                    label="닉네임"
                    name="nickname"
                    value={formData.nickname}
                    onChange={handleChange}
                    placeholder="새 닉네임을 입력하세요"
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
                    placeholder="새 비밀번호 (8자 이상)"
                />

                <Input
                    label="새 비밀번호 확인"
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="새 비밀번호를 다시 입력하세요"
                />

                <div className="user-edit__button-group">
                    <Button type="submit">저장하기</Button>
                    <Button type="button" onClick={() => navigate(-1)} className="cancel-button">취소</Button>
                </div>
            </form>
        </div>
    );
};

export default UserEdit;
