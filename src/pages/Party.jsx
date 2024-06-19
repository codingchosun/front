import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './Party.css';
import api from "../api";

const Party = () => {
    const { isLogin } = useAuth();

    const location = useLocation();
    const navigate = useNavigate();

    const [userId, setUserId] = useState(null);
    const [loginId, setLoginId] = useState(null);

    const [post, setPost] = useState({});
    const [images, setImages] = useState([]);
    const [participants, setParticipants] = useState([]);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [isOrganizer, setIsOrganizer] = useState(false);
    const postId = location.state ? location.state.postId : undefined;

    // 수정된 정보들
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState('');
    const [editContent, setEditContent] = useState('');
    const [editDate, setEditDate] = useState('');
    const [alterTags, setAlterTags] = useState('');

    const fetchUserIdAndPostDetails = async () => {
        try {
            if (isLogin) {
                const userIdResponse = await api.get("/getloginuser", {
                    withCredentials: true
                });
                setUserId(userIdResponse.data.user_id);
                setLoginId(userIdResponse.data.login_id);
                console.log("userId: ", userIdResponse.data.user_id);
                console.log("loginId: ", userIdResponse.data.login_id);
            }
            if (postId) {
                const postDetailResponse = await api.get(`/posts/${postId}`);
                if (postDetailResponse.status === 200) {
                    setPost(postDetailResponse.data.post_response);
                    setImages(postDetailResponse.data.paged_image_response_list.content);
                    setComments(postDetailResponse.data.paged_comment_response_list.content);
                    fetchParticipants();

                    console.log("확인:", postDetailResponse.data.post_response.user_dto);

                    // 현재 사용자가 게시글 작성자인지 확인
                    if (postDetailResponse.data.post_response.user_dto.user_id === userId) {
                        setIsOrganizer(true);
                    } else {
                        setIsOrganizer(false);
                    }
                }
            }
        } catch (error) {
            console.error("사용자 확인 오류:", error);
        }
    };

    useEffect(() => {
        fetchUserIdAndPostDetails();
    }, [isLogin, postId, userId]);

    // 참가자 확인
    const fetchParticipants = async () => {
        try {
            const response = await api.get(`/posts/${postId}/participant`);
            if (response.status === 200) {
                setParticipants(response.data);
            }
        } catch (error) {
            console.error('참가 에러:', error);
        }
    };

    // 댓글
    const fetchComments = async () => {
        try {
            const response = await api.get(`/posts/${postId}/comments`);
            if (response.status === 200) {
                setComments(response.data.content);
            }
        } catch (error) {
            console.error('댓글 에러:', error);
        }
    };

    // 모임 참가
    const handleJoin = async () => {
        try {
            const response = await api.post(`/posts/${postId}/participant`, {}, {
                withCredentials: true
            });
            if (response.status === 200) {
                fetchParticipants();
            }
        } catch (error) {
            console.error('모임 참가 에러:', error);
        }
    };

    // 모임 탈퇴
    const handleLeave = async () => {
        try {
            const response = await api.post(`/posts/${postId}/leave`, {}, {
                withCredentials: true
            });
            if (response.status === 200) {
                fetchParticipants();
            }
        } catch (error) {
            console.error('모임 탈퇴 에러:', error);
        }
    };

    // 회원관리 페이지 이동(방장)
    const handleManage = () => {
        navigate('/manage', { state: { postId } });
    };

    // 댓글
    const handleAddComment = async () => {
        try {
            const response = await api.post(`/posts/${postId}/comments`, {
                contents: newComment,
            }, { withCredentials: true });
            if (response.status === 200) {
                setNewComment('');
                fetchComments();
            }
        } catch (error) {
            console.error('댓글 추가 에러:', error);
        }
    };

    // 게시물 수정 (방장)
    const handleEditPost = async () => {
        const updatedPost = {
            title: editTitle,
            content: editContent,
            start_time: new Date(editDate).toISOString(),
            alter_tags: alterTags,
        };

        try {
            const response = await api.post(`/posts/${postId}/edit`, updatedPost, { withCredentials: true });
            if (response.status === 200) {
                setIsEditing(false);
                fetchUserIdAndPostDetails();
            }
        } catch (error) {
            console.error('게시물 수정 에러:', error);
        }
    };
    const handleEditClick = () => {
        setEditTitle(post.title);
        setEditContent(post.content);
        setEditDate(post.start_time);
        setIsEditing(true);
    };

    // 유저 클릭 이벤트 ~ 프로필 페이지 이동
    const handleParticipantClick = (participantId) => {
        navigate('/profile', { state: { participantId } });
    };

    // 평가 버튼 이벤트
    const handleVoteClick = () => {
        navigate('/votepage', { state: { participants, postId } });
    }

    return (
        <div className="party">
            <div className="party__details">
                {isEditing ? (
                    <div className="party__edit-form">
                        <h1 className="party__edit-title">게시글 수정</h1>
                        <input className="party__edit-input" type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} placeholder="제목" />
                        <textarea className="party__edit-textarea" value={editContent} onChange={(e) => setEditContent(e.target.value)} placeholder="내용" />
                        <input className="party__edit-date" type="datetime-local" value={editDate} onChange={(e) => setEditDate(e.target.value)} />
                        <input className="party__edit-tags" type="text" value={alterTags} onChange={(e) => setAlterTags(e.target.value)} placeholder="#변경할 해시태그(공백으로 구분)" />
                        <button className="party__edit-submit" onClick={handleEditPost}>수정 완료</button>
                        <button className="party__edit-cancel" onClick={() => setIsEditing(false)}>취소</button>
                    </div>
                ) : (
                    <>
                        <h1 className="party__title">{post.title}</h1>
                        <div className="party__info">
                            <button className="party__vote-button" onClick={handleVoteClick}>평가</button>
                            <p className="party__datetime"><strong>일시:</strong> {new Date(post.start_time).toLocaleString()}</p>
                            <p className="party__hashtags"><strong>해시태그:</strong> {Array.isArray(post.hash_list) ? post.hash_list.join(' ') : ''}</p>
                            {images.length > 0 && images.map(image => (
                                <img key={image.url} src={`${process.env.PUBLIC_URL}/postImage/${image.url}`} alt={post.title} className="party__thumbnail" />
                            ))}
                            <p className="party__content">{post.content}</p>
                        </div>
                        {isOrganizer && <button className="party__edit-button" onClick={handleEditClick}>게시글 수정</button>}
                    </>
                )}
            </div>
            <div className="party__participants">
                <h2 className="party__participants-title">참가자 명단</h2>
                <ul className="party__participants-list">
                    {participants.map((participant, index) => (
                        <li key={index} className="party__participant" onClick={() => handleParticipantClick(participant.login_id)}>{participant.nickname}</li>
                    ))}
                </ul>
                {isLogin && (
                    <div className="party__actions">
                        <button className="party__join-button" onClick={handleJoin}>참가</button>
                        <button className="party__leave-button" onClick={handleLeave}>탈퇴</button>
                    </div>
                )}
                {isOrganizer && <button className="party__manage-button" onClick={handleManage}>관리</button>}
            </div>
            <div className="party__comments">
                <h2 className="party__comments-title">댓글</h2>
                <ul className="party__comments-list">
                    {comments.map((comment, index) => (
                        <li key={index} className="party__comment" onClick={() => handleParticipantClick(comment.user_dto.login_id)}>
                            <p className="party__comment-user"><strong>{comment.user_dto.nickname}:</strong> {comment.content}</p>
                            <p className="party__comment-date">{new Date(comment.created_at).toLocaleString()}</p>
                        </li>
                    ))}
                </ul>
                {isLogin && (
                    <div className="party__comment-input">
                        <textarea
                            className="party__comment-textarea"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="댓글을 입력하세요"
                        />
                        <button className="party__comment-submit" onClick={handleAddComment}>댓글 추가</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Party;
