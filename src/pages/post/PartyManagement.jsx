import React, {useCallback, useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {useAuth} from '../../contexts/AuthContext';
import api from "../../api/api";
import './PartyManagement.css';

const PartyManagement = () => {
    const {postId} = useParams();
    const [participants, setParticipants] = useState([]);
    const [hostLoginId, setHostLoginId] = useState(null);
    const [selectedParticipants, setSelectedParticipants] = useState([]);
    const {user, isLoggedIn} = useAuth();
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const fetchParticipants = useCallback(async () => {
        if (!postId) {
            navigate(-1);
            return;
        }
        try {
            const response = await api.get(`/api/posts/${postId}`);
            if (response.data.success) {
                const postData = response.data.body;
                setParticipants(postData.participants || []);
                setHostLoginId(postData.loginId);
            }
        } catch (err) {
            console.error('참가자 목록 로딩 실패:', err);
            setError('참가자 정보를 불러오는 데 실패했습니다.');
        }
    }, [postId, navigate]);

    useEffect(() => {
        fetchParticipants();
    }, [fetchParticipants]);

    const handleSelectParticipant = (loginId) => {
        setSelectedParticipants(prev => prev.includes(loginId) ? prev.filter(id => id !== loginId) : [...prev, loginId]);
    };

    const handleRemoveParticipants = async () => {
        if (selectedParticipants.length === 0) {
            alert("추방할 참가자를 선택해주세요.");
            return;
        }

        if (window.confirm(`선택한 ${selectedParticipants.length}명의 참가자를 정말로 추방하시겠습니까?`)) {
            try {
                const removalPromises = selectedParticipants.map(banishUserId => api.delete(`/api/posts/${postId}/participants/${banishUserId}`));
                await Promise.all(removalPromises);

                alert('선택한 참가자가 추방되었습니다.');
                setSelectedParticipants([]);
                fetchParticipants();
            } catch (err) {
                console.error('참가자 추방 실패:', err);
                alert(err.response?.data?.error?.message || '참가자 추방 중 오류가 발생했습니다.');
            }
        }
    };

    if (error) {
        return <div className="manage-message error">{error}</div>;
    }

    const isOrganizer = user && user.loginId === hostLoginId;
    if (!isOrganizer) {
        return (
            <div className="manage-container">
                <h1>접근 권한 없음</h1>
                <p>이 페이지는 모임의 작성자만 접근할 수 있습니다.</p>
                <button onClick={() => navigate(-1)}>뒤로가기</button>
            </div>
        );
    }

    const participantsToManage = participants.filter(p => p.loginId !== hostLoginId);

    return (
        <div className="manage-container">
            <h1>참가자 관리</h1>

            <ul className="participant-list">
                {participantsToManage.length > 0 ? (participantsToManage.map(participant => (
                        <li key={participant.loginId} className="participant-item">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={selectedParticipants.includes(participant.loginId)}
                                    onChange={() => handleSelectParticipant(participant.loginId)}
                                />
                                {participant.nickname} ({participant.loginId})
                            </label>
                        </li>
                    ))
                ) : (
                    <p>작성자 외 다른 참가자가 없습니다.</p>
                )}
            </ul>

            {participantsToManage.length > 0 && (
                <button onClick={handleRemoveParticipants} className="remove-button">선택한 참가자 추방</button>
            )}

            <button onClick={() => navigate(`/party/${postId}`)} className="back-button">돌아가기</button>
        </div>
    );
};

export default PartyManagement;