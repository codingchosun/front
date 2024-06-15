import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import api from "../api";
import './Manage.css';

const Manage = () => {
    const [participants, setParticipants] = useState([]);
    const [selectedParticipants, setSelectedParticipants] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();
    const postId = location.state ? location.state.postId : undefined;

    useEffect(() => {
        if (postId) {
            fetchParticipants();
        }
    }, [postId]);

    const fetchParticipants = async () => {
        try {
            const response = await api.get(`/posts/${postId}/participant`);
            if (response.status === 200) {
                setParticipants(response.data);
            }
        } catch (error) {
            console.error('참가자 정보 에러:', error);
        }
    };

    const handleSelectParticipant = (userId) => {
        setSelectedParticipants(prevSelected =>
            prevSelected.includes(userId)
                ? prevSelected.filter(id => id !== userId)
                : [...prevSelected, userId]
        );
    };

    const handleKickParticipants = async () => {
        try {
            const response = await api.post(`/posts/${postId}/removeParticipants`, {
                user_ids: selectedParticipants
            }, { withCredentials: true });

            if (response.status === 200) {
                alert('선택한 참가자가 추방되었습니다.');
                fetchParticipants();
                setSelectedParticipants([]);
            }
        } catch (error) {
            console.error('참가자 추방 에러:', error);
            alert('참가자를 추방하는 중 오류가 발생했습니다.');
        }
    };

    const handleCancel = () => {
        navigate(-1);
    };

    return (
        <div className="manage-container">
            <h1>참가자 관리</h1>
            <div className="participant-list">
                {participants.map(participant => (
                    <div key={participant.user_id} className="participant-item">
                        <input
                            type="checkbox"
                            checked={selectedParticipants.includes(participant.user_id)}
                            onChange={() => handleSelectParticipant(participant.user_id)}
                        />
                        <span>{participant.nickname}</span>
                    </div>
                ))}
            </div>
            <div className="manage-buttons">
                <button onClick={handleKickParticipants} className="kick-button">추방</button>
                <button onClick={handleCancel} className="cancel-button">취소</button>
            </div>
        </div>
    );
};

export default Manage;
