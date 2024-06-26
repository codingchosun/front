import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from "../api";
import './Manage.css';

const Manage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const postId = location.state ? location.state.postId : undefined;

    const [participants, setParticipants] = useState([]);
    const [selectedParticipants, setSelectedParticipants] = useState([]);

    useEffect(() => {
        if (postId) {
            fetchParticipants();
        } else {
            navigate(-1); // postId가 없는 경우 이전 페이지로 이동
        }
    }, [postId, navigate]);

    //참가자 목록
    const fetchParticipants = async () => {
        try {
            const response = await api.get(`/posts/${postId}/participant`,{
                withCredentials: true
                });

            if (response.status === 200) {
                setParticipants(response.data);
            }

            console.log("참가자목록: ",response.data);

        } catch (error) {
                console.error('참가자 목록 가져오기 에러:', error);
        }
    };

    //참가자 선택 처리 이벤트
    const handleSelectParticipant = (participantId) => {
        setSelectedParticipants(prevSelected =>
            prevSelected.includes(participantId)
                ? prevSelected.filter(id => id !== participantId)
                : [...prevSelected, participantId]
        );
    };

    //참가자 추방 처리
    const handleRemoveParticipants = async () => {
        try {
            await Promise.all(selectedParticipants.map(async (participantId) => {
                await api.post(`/posts/${postId}/admin/remove`, {
                    remove_id: participantId
                }, {
                    withCredentials: true
                });
            }));

            fetchParticipants();
            setSelectedParticipants([]);

            alert('선택한 참가자가 추방되었습니다.');
        } catch (error) {
            console.error('참가자 추방 에러:', error);
        }
    };

    return (
        <div className="manage-container">
            <h1>참가자 관리</h1>
            <ul className="participant-list">
                {participants.map(participant => (
                    <li key={participant.user_id} className="participant-item">
                        <label>
                            <input
                                type="checkbox"
                                checked={selectedParticipants.includes(participant.user_id)}
                                onChange={() => handleSelectParticipant(participant.user_id)}
                            />
                            {participant.nickname}
                        </label>
                    </li>
                ))}
            </ul>
            <button onClick={handleRemoveParticipants} className="remove-button">선택한 참가자 추방</button>
        </div>
    );
};

export default Manage;
