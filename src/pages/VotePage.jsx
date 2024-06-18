import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api';
import './VotePage.css';

const VotePage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [participants, setParticipants] = useState([]);
    const [ratings, setRatings] = useState({});

    useEffect(() => {
        const fetchParticipants = async () => {
            try {
                const response = await api.get(`/mypost/${location.state.postId}`);
                setParticipants(response.data);
            } catch (error) {
                console.error('참가자 정보 가져오기 에러:', error);
            }
        };

        if (location.state && location.state.postId) {
            fetchParticipants();
        } else {
            navigate(-1); // postId가 없으면 이전 페이지로 돌아가기
        }
    }, [location.state, navigate]);

    const handleRatingChange = (participantId, rating) => {
        setRatings(prevRatings => ({
            ...prevRatings,
            [participantId]: parseInt(rating, 10)
        }));
    };

    const handleSubmit = async () => {
        const userValidationRequestList = Object.keys(ratings).map(participantId => ({
            userId: parseInt(participantId, 10),
            mannerScore: ratings[participantId]
        }));

        try {
            const response = await api.post(`/mypost/${location.state.postId}`, {
                userValidationRequestList
            });

            if (response.status === 200) {
                navigate(-1); // 이전 페이지로 돌아가기
            }
        } catch (error) {
            console.error('평가 제출 에러:', error);
        }
    };

    return (
        <div className="vote-container">
            <h1>참가자 평가</h1>
            <ul className="participant-list">
                {participants.map(participant => (
                    <li key={participant.userId} className="participant-item">
                        <span>{participant.nickname}</span>
                        <select
                            value={ratings[participant.userId] || ''}
                            onChange={(e) => handleRatingChange(participant.userId, e.target.value)}
                        >
                            <option value="">점수 선택</option>
                            {[-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5].map(score => (
                                <option key={score} value={score}>{score}</option>
                            ))}
                        </select>
                    </li>
                ))}
            </ul>
            <button onClick={handleSubmit} className="submit-button">평가 제출</button>
        </div>
    );
};

export default VotePage;
