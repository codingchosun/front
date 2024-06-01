// 모임(게시물) 페이지
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './Party.css';
import Header from './Header';

const Party = () => {
    const { isLogin, user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [participants, setParticipants] = useState([]);
    const [isOrganizer, setIsOrganizer] = useState(true);
    const { title, hashtags, date, content, image } = location.state || {};

    //모임 관리자 여부 확인
    useEffect(() => {
        if (user && user.role === 'organizer') {
            setIsOrganizer(true);
        }
        // Fetch participants from backend
        fetchParticipants();
    }, [user]);
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

    const handleJoin = async () => {
        try {
            const response = await fetch('http://localhost:8090/api/join', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: user.id }),
            });
            if (response.ok) {
                fetchParticipants();
            }
        } catch (error) {
            console.error('Error joining the party:', error);
        }
    };

    const handleLeave = async () => {
        try {
            const response = await fetch('http://localhost:8090/api/leave', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: user.id }),
            });
            if (response.ok) {
                fetchParticipants();
            }
        } catch (error) {
            console.error('Error leaving the party:', error);
        }
    };

    const handleManage = () => {
        navigate('/manage');
    };

    return (
        <div>
            <Header />
            <div className="party-container">
                <div className="party-details">
                    <h1>{title}</h1>
                    <div className="party-info">
                        <p><strong>일시:</strong> {date}</p>
                        <p><strong>해시태그:</strong> {hashtags}</p>
                        {image && <img src={URL.createObjectURL(image)} alt={title} className="party-thumbnail" />}
                        <p>{content}</p>
                    </div>
                </div>
                <div className="party-participants">
                    <h2>참가자 명단</h2>
                    <ul>
                        {participants.map((participant, index) => (
                            <li key={index}>{participant.name}</li>
                        ))}
                    </ul>
                    {isLogin && (
                        <>
                            <button onClick={handleJoin}>참가</button>
                            <button onClick={handleLeave}>탈퇴</button>
                        </>
                    )}
                    {isOrganizer && <button onClick={handleManage}>관리</button>}
                </div>
            </div>
        </div>
    );
};

export default Party;
