// 내 모임 페이지
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './Manage.css';
import Header from './Header';

const Manage = () => {
    const { isLogin, user } = useAuth();
    const navigate = useNavigate();
    const [participants, setParticipants] = useState([]);
    const [selectedParticipants, setSelectedParticipants] = useState([]);

    useEffect(() => {
        if (!isLogin || !user || user.role !== 'organizer') {
            alert('접근 권한이 없습니다.');
            navigate('/login');
        } else {
            // Fetch participants from backend
            fetchParticipants();
        }
    }, [isLogin, user]);

    const fetchParticipants = async () => {
        try {
            const response = await fetch('http://localhost:8090/api/participants');
            if (response.ok) {
                const data = await response.json();
                setParticipants(data);
            }
        } catch (error) {
            console.error('Error fetching participants:', error);
        }
    };

    const handleSelectParticipant = (id) => {
        if (selectedParticipants.includes(id)) {
            setSelectedParticipants(selectedParticipants.filter(participantId => participantId !== id));
        } else {
            setSelectedParticipants([...selectedParticipants, id]);
        }
    };

    const handleExpelParticipants = async () => {
        try {
            const response = await fetch('http://localhost:8090/api/expel', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ participantIds: selectedParticipants }),
            });
            if (response.ok) {
                alert('선택된 참가자가 퇴출되었습니다.');
                fetchParticipants();
                setSelectedParticipants([]);
            } else {
                alert('참가자 퇴출에 실패했습니다.');
            }
        } catch (error) {
            console.error('Error expelling participants:', error);
        }
    };

    return (
        <div>
            <Header />
            <div className="manage-container">
                <h1>참가자 명단 관리</h1>
                <ul className="participants-list">
                    {participants.map(participant => (
                        <li key={participant.id}>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={selectedParticipants.includes(participant.id)}
                                    onChange={() => handleSelectParticipant(participant.id)}
                                />
                                <span className="participant-name">{participant.name}</span>
                                <span className="participant-score">{participant.score}</span>
                            </label>
                        </li>
                    ))}
                </ul>
                <button className="expel-button" onClick={handleExpelParticipants}>추방</button>
            </div>
        </div>
    );
};

export default Manage;
