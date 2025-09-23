import React, {useState, useEffect, useCallback} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {useAuth} from '../../contexts/AuthContext';
import api from '../../api/api';
import './EvaluationUser.css';

const EvaluationUser = () => {
    const {user} = useAuth();
    const {postId} = useParams();
    const [participants, setParticipants] = useState([]);
    const [templates, setTemplates] = useState([]);
    const [selectedTemplates, setSelectedTemplates] = useState({});

    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            if (!postId || !user) {
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                const [participantsResponse, templatesResponse] = await Promise.all([
                    api.get(`/api/posts/${postId}`),
                    api.get('/api/templates')
                ]);

                if (participantsResponse.status === 200 && participantsResponse.data.success) {
                    const allParticipants = participantsResponse.data.body.participants || [];
                    setParticipants(allParticipants.filter(p => p.loginId !== user.loginId));
                }
                if (templatesResponse.status === 200 && templatesResponse.data.success) {
                    setTemplates(templatesResponse.data.body);
                }
            } catch (err) {
                console.error('참가자 불러오는 중 오류 발생:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [postId, user]);

    const handleTemplateSelect = (loginId, templateId) => {
        setSelectedTemplates(prev => ({
            ...prev,
            [loginId]: prev[loginId] === templateId ? null : templateId
        }));
    };

    const handleSubmitEvaluations = async () => {
        const payload = Object.keys(selectedTemplates)
            .filter(loginId => selectedTemplates[loginId] !== null)
            .map(loginId => ({
                toUserLoginId: loginId,
                templateId: selectedTemplates[loginId]
            }));

        if (payload.length === 0) {
            alert("한 명 이상 평가를 완료해주세요.");
            return;
        }

        try {
            await api.post(`/api/posts/${postId}/evaluations`, payload);
            alert("평가가 성공적으로 제출되었습니다.");
            navigate(`/party/${postId}`);
        } catch (error) {
            console.error("평가 제출 실패:", error);
            alert(error.response?.data?.error?.message || "평가 제출 중 오류가 발생했습니다.");
        }
    };

    if (isLoading) return <div>불러오는 중...</div>;

    return (
        <div className="evaluation-page-container">
            <h1>참가자 평가하기</h1>
            <p className="evaluation-description">다른 참가들을 평가해주세요</p>

            <div className="evaluation-list">
                {participants.map(participant => (
                    <div key={participant.loginId} className="evaluation-item">
                        <h3 className="participant-nickname">{participant.nickname}</h3>

                        <div className="template-buttons">
                            {templates.map(template => (
                                <button
                                    key={template.templateId}
                                    className={`template-button ${selectedTemplates[participant.loginId] === template.templateId ? (template.score > 0 ? 'selected positive' : 'selected negative') : ''}`}
                                    onClick={() => handleTemplateSelect(participant.loginId, template.templateId)}
                                >
                                    {template.content}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <div className="evaluation-page-actions">
                <button onClick={handleSubmitEvaluations} className="submit-button">평가 완료</button>
                <button onClick={() => navigate(`/party/${postId}`)} className="cancel-button">취소</button>
            </div>
        </div>
    );
};

export default EvaluationUser;
