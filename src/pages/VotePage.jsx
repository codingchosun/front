import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api';
import './VotePage.css';

const VotePage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [postId, setPostId] = useState(location.state ? location.state.postId : null);
    const [participants, setParticipants] = useState([]);
    const [ratings, setRatings] = useState({});
    const [templates, setTemplates] = useState([
        { content: "약속을 잘 지켜요" },
        { content: "매너가 좋아요" },
        { content: "완벽해요" },
        { content: "약속을 잘 안지켜요" },
        { content: "성격이 안좋아요" },
        { content: "금쪽이에요" }
    ]);

    // 참가자 평가 인원
    useEffect(() => {
        const fetchParticipants = async () => {
            try {
                const response = await api.get(`/mypost/${postId}`, {
                    withCredentials: true
                });
                setParticipants(response.data);
            } catch (error) {
                console.error('참가자 정보 가져오기 에러:', error);
            }
        };

        if (postId) {
            fetchParticipants();
        }

    });

    const handleRatingChange = (participantId, templateContent) => {
        setRatings(prevRatings => ({
            ...prevRatings,
            [participantId]: templateContent
        }));
    };

    const handleSubmit = async () => {
        const userValidationRequestList = Object.keys(ratings).map(participantId => ({
            user_id: parseInt(participantId, 10),
            template_content: ratings[participantId]
        }));

        try {
            const response = await api.post(`/mypost/${postId}`, {
                userValidationRequestList
            }, {
                withCredentials: true
            });

            if (response.status === 200) {
                alert('평가가 성공적으로 제출되었습니다.');
                navigate(-1); // 이전 페이지로 돌아가기
            }
        } catch (error) {
            console.error('평가 제출 에러:', error);
            alert('평가 제출 중 오류가 발생했습니다.');
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
                            value={ratings[participant.user_id] || ''}
                            onChange={(e) => handleRatingChange(participant.user_id, e.target.value)}
                        >
                            <option value="">평가 선택</option>
                            {templates.map(template => (
                                <option key={template.content} value={template.content}>
                                    {template.content}
                                </option>
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
