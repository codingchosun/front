// 모임(게시물) 페이지
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import axios from 'axios';
import './Party.css';

const Party = () => {
    const { isLogin, userId } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const [post, setPost] = useState({});
    const [images, setImages] = useState([]);
    const [participants, setParticipants] = useState([]);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [isOrganizer, setIsOrganizer] = useState(false);

    const postId = location.state ? location.state.postId : undefined;

    useEffect(() => {
        if (userId && userId.role === 'organizer') { // organizer 대신 권한이 방장인 사람 구분하기
            setIsOrganizer(true);
        }
        fetchPostDetails();
    }, [userId]);

    const fetchPostDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:8090/posts/${postId}`);
            if (response.status === 200) {
                setPost(response.data.post_response);
                setImages(response.data.paged_image_response_list.content);
                setComments(response.data.paged_comment_response_list.content);
                fetchParticipants();
            }
        } catch (error) {
            console.error('Error fetching post details:', error);
        }
    };

    const fetchParticipants = async () => {
        try {
            const response = await axios.get(`http://localhost:8090/posts/${postId}/participant`);
            if (response.status === 200) {
                setParticipants(response.data);
            }
        } catch (error) {
            console.error('Error fetching participants:', error);
        }
    };

    const fetchComments = async () => {
        try {
            const response = await axios.get(`http://localhost:8090/posts/${postId}/comments`);
            if (response.status === 200) {
                setComments(response.data.content);
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    const handleJoin = async () => {
        try {
            const response = await axios.post(`http://localhost:8090/posts/${postId}/participant`);
            if (response.status === 200) {
                fetchParticipants();
            }
        } catch (error) {
            console.error('Error joining the party:', error);
        }
    };

    const handleLeave = async () => {
        try {
            const response = await axios.post(`http://localhost:8090/posts/${postId}/leave`);
            if (response.status === 200) {
                fetchParticipants();
            }
        } catch (error) {
            console.error('Error leaving the party:', error);
        }
    };

    const handleManage = () => {
        navigate('/manage');
    };

    const handleAddComment = async () => {
        if (!newComment){
            return;
        }
        try {
            const response = await axios.post(`http://localhost:8090/posts/${postId}/comments`, {
                contents: newComment,
            });
            if (response.status === 200) {
                setNewComment('');
                fetchComments();
            }
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    return (
        <div className="party-container">
            <div className="party-details">
                <h1>{post.title}</h1>
                <div className="party-info">
                    <p><strong>일시:</strong> {post.start_time}</p>
                    <p><strong>해시태그:</strong> {Array.isArray(post.hash_list) ? post.hash_list.join(', ') : ''}</p>
                    {images.length > 0 && images.map(image => (
                        <img key={image.image_id} src={`http://localhost:8090${image.url}`} alt={post.title} className="party-thumbnail" />
                    ))}
                    <p>{post.content}</p>
                </div>
            </div>
            <div className="party-participants">
                <h2>참가자 명단</h2>
                <ul>
                    {participants.map((participant, index) => (
                        <li key={index}>{participant.nickname}</li>
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
            <div className="party-comments">
                <h2>댓글</h2>
                <ul>
                    {comments.map((comment, index) => (
                        <li key={index}>
                            <p><strong>{comment.user_dto.nickname}:</strong> {comment.content}</p>
                            <p>{comment.created_at}</p>
                        </li>
                    ))}
                </ul>
                {isLogin && (
                    <div className="comment-input">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="댓글을 입력하세요"
                        />
                        <button onClick={handleAddComment}>댓글 추가</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Party;
