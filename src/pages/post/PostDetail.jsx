import React, {useCallback, useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {useAuth} from '../../contexts/AuthContext';
import api from "../../api/api";
import './PostDetail.css';

const PostDetail = () => {
    const {user, isLoggedIn} = useAuth();

    const {postId} = useParams();
    const [post, setPost] = useState(null);

    const [newComment, setNewComment] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        title: '',
        content: '',
        startTime: '',
        hashtags: '',
    });
    const [currentImages, setCurrentImages] = useState([]);
    const [imagesToDelete, setImagesToDelete] = useState([]);
    const [newImages, setNewImages] = useState([]);

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const fetchPostDetails = useCallback(async () => {
        if (!postId) {
            setError('게시물 ID가 없습니다.');
            setIsLoading(false);
            return;
        }
        try {
            setIsLoading(true);
            const response = await api.get(`/api/posts/${postId}`);
            if (response.data.success) {
                setPost(response.data.body);
            } else {
                throw new Error('게시물 정보를 가져오지 못했습니다.');
            }
        } catch (err) {
            setError('게시물을 불러오는 중 오류가 발생했습니다.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [postId]);

    useEffect(() => {
        fetchPostDetails();
    }, [fetchPostDetails]);

    const handleParticipant = async () => {
        if (!isLoggedIn) return alert('로그인이 필요합니다.');
        try {
            await api.post(`/api/posts/${postId}/participants`);
            alert('모임에 참가했습니다.');
            fetchPostDetails();
        } catch (err) {
            alert(err.response?.data?.error?.message || '모임 참가 중 오류가 발생했습니다.');
        }
    };

    const handleExit = async () => {
        try {
            await api.delete(`/api/posts/${postId}/exit`);
            alert('모임에서 탈퇴했습니다.');
            fetchPostDetails();
        } catch (err) {
            alert(err.response?.data?.error?.message || '모임 탈퇴 중 오류가 발생했습니다.');
        }
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) return alert('댓글 내용을 입력해주세요.');
        try {
            await api.post(`/api/posts/${postId}/comments`, {contents: newComment});
            setNewComment('');
            fetchPostDetails();
        } catch (err) {
            alert('댓글 등록 중 오류가 발생했습니다.');
        }
    };

    const handleEditClick = () => {
        if (!post) {
            return;
        }
        setIsEditing(true);
        setEditForm({
            title: post.title,
            content: post.content,
            startTime: post.startTime.substring(0, 16),
            hashtags: post.hashtags.join(' '),
        });
        setCurrentImages(post.images || []);
        setImagesToDelete([]);
        setNewImages([]);
    };

    const handleDeleteImage = (imageIdToDelete) => {
        setCurrentImages(currentImages.filter(img => img?.imageId !== imageIdToDelete));
        setImagesToDelete([...imagesToDelete, imageIdToDelete]);
    };

    const handleNewImageChange = (e) => {
        setNewImages(Array.from(e.target.files));
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                title: editForm.title,
                content: editForm.content,
                startTime: new Date(editForm.startTime).toISOString(),
                hashtags: editForm.hashtags.split(' ').filter(tag => tag),
            };
            await api.patch(`/api/posts/${postId}`, payload);

            if (imagesToDelete.length > 0) {
                const deletePromises = imagesToDelete.map(imageId => api.delete(`/api/posts/${postId}/images/${imageId}`));
                await Promise.all(deletePromises);
            }

            if (newImages.length > 0) {
                const formData = new FormData();
                newImages.forEach(file => formData.append('files', file));
                await api.post(`/api/posts/${postId}/images`, formData, {
                    headers: {'Content-Type': 'multipart/form-data'}
                });
            }

            alert('게시물이 성공적으로 수정되었습니다.');
            setIsEditing(false);
            fetchPostDetails();
        } catch (err) {
            alert('게시물 수정 중 오류가 발생했습니다.');
        }
    };
    const handleDeletePost = async () => {
        if (window.confirm("정말로 이 게시물을 삭제하시겠습니까?")) {
            try {
                await api.delete(`/api/posts/${postId}`);
                alert("게시물이 삭제되었습니다.");
                navigate('/main');
            } catch (err) {
                alert("게시물 삭제 중 오류가 발생했습니다.");
            }
        }
    };
    const handleUserClick = (loginId) => navigate(`/profile/${loginId}`);
    const handleGoToVote = () => navigate('/votepage', {state: {postId, participants: post.participants}});
    const handleGoToManage = () => navigate('/manage', {state: {postId}});

    if (isLoading) return <div className="party-message">로딩 중...</div>;
    if (error) return <div className="party-message error">{error}</div>;
    if (!post) return <div className="party-message">게시물 정보를 찾을 수 없습니다.</div>;

    const isOrganizer = user && user.loginId === post.loginId;
    const isParticipant = (post.participants || []).some(p => p.loginId === user?.loginId);

    return (
        <div className="party-page-container">
            <section className="party-main-section">
                {isEditing ? (
                    <form className="party-edit-form" onSubmit={handleUpdateSubmit}>
                        <h2>게시물 수정</h2>

                        <input
                            type="text"
                            id="title"
                            name="title" value={editForm.title}
                            onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                            required/>

                        <textarea
                            name="content" value={editForm.content}
                            onChange={(e) => setEditForm({...editForm, content: e.target.value})}
                            required/>

                        <input
                            type="datetime-local"
                            id="startTime"
                            name="startTime" value={editForm.startTime}
                            onChange={(e) => setEditForm({...editForm, startTime: e.target.value})}
                            required/>

                        <input
                            type="text"
                            id="hashtags"
                            name="hashtags"
                            value={editForm.hashtags}
                            onChange={(e) => setEditForm({...editForm, hashtags: e.target.value})}
                            placeholder="해시태그 (공백으로 구분)"/>

                        <div className="form-group">
                            <label>이미지 관리</label>

                            <div className="image-edit-container">
                                {currentImages.map(image => (
                                    <div key={image.imageId} className="image-edit-item">
                                        <img src={image.url} alt="기존 이미지"/>
                                        <button type="button" onClick={() => handleDeleteImage(image.imageId)}>이미지 제거
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <input type="file" multiple onChange={handleNewImageChange}/>
                        </div>

                        <div className="party-edit-actions">
                            <button type="submit" className="button-save">수정</button>
                            <button type="button" onClick={() => setIsEditing(false)} className="button-cancel">취소
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="party-details">
                        <h1>{post.title}</h1>

                        <div className="party-meta">
                            <p><strong>작성자:</strong> <span className="clickable"
                                                           onClick={() => handleUserClick(post.loginId)}>{post.nickname}</span>
                            </p>
                            <p><strong>모임 시간:</strong>{new Date(post.startTime).toLocaleString()}</p>
                        </div>

                        <div className="party-images">
                            {post.images && post.images.map(image => (
                                <img key={image.imageId} src={image.url} alt="모임 이미지" className="party-image-item"/>
                            ))}
                        </div>

                        <div className="party-content"><p>{post.content}</p></div>

                        <div className="party-hashtags">
                            {post.hashtags.map(tag => <span key={tag} className="hashtag">#{tag}</span>)}
                        </div>

                        <div className="party-buttons-container">
                            <button onClick={() => navigate('/main')} className="button-list">목록</button>
                            <div className="party-user-actions">
                                {isLoggedIn && !isParticipant && !isOrganizer && (
                                    <button onClick={handleParticipant} className="button-join">참가</button>
                                )}
                                {isLoggedIn && isParticipant && !isOrganizer && (
                                    <button onClick={handleExit} className="button-leave">탈퇴</button>
                                )}
                                {isOrganizer && (
                                    <div className="party-organizer-actions">
                                        <button onClick={handleEditClick} className="button-edit">수정</button>
                                        <button onClick={handleDeletePost} className="button-delete">삭제</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </section>

            <aside className="party-sidebar-section">
                <div className="participants-container">
                    <h3>참가자 ({(post.participants || []).length}명)</h3>
                    <ul className="participants-list">
                        {(post.participants || []).map(p => <li key={p.loginId} className="clickable"
                                                                onClick={() => handleUserClick(p.loginId)}>{p.nickname}</li>)}
                    </ul>
                </div>

                <div className="party-action-buttons">
                    {isLoggedIn && isParticipant && !isOrganizer &&
                        <button onClick={handleGoToVote} className="button-vote">다른 유저 평가하기</button>}
                    {isOrganizer && <button onClick={handleGoToManage} className="button-manage">참가자 관리</button>}
                </div>

                <div className="comments-container">
                    <h3>댓글 ({(post.comments || []).length}개)</h3>

                    <ul className="comments-list">
                        {(post.comments || []).map(comment => (
                            <li key={comment.commentId} className="comment-item">
                                <strong className="clickable"
                                        onClick={() => handleUserClick(comment.loginId)}>{comment.nickname}:</strong>
                                <p>{comment.content}</p>
                            </li>
                        ))}
                    </ul>

                    {isLoggedIn && (
                        <div className="comment-form">
                            <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)}
                                      placeholder="댓글을 입력하세요"/>
                            <button onClick={handleAddComment}>등록</button>
                        </div>
                    )}
                </div>
            </aside>
        </div>
    );
};

export default PostDetail;