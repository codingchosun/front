import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAuth} from '../../contexts/AuthContext';
import api from "../../api/api"
import './MyParty.css';

const PostList = ({title, posts, onPostClick}) => (
    <div className="post-section">
        <h2>{title}</h2>

        <div className="party-list">
            {posts.length > 0 ? (
                posts.map(post => (
                    <div key={post.postId} className="party-item" onClick={() => onPostClick(post.postId)}>
                        <h3>{post.title}</h3>
                        <p>생성일: {new Date(post.createdAt).toLocaleDateString()}</p>
                        <p>작성자: {post.nickname}</p>
                    </div>
                ))
            ) : (
                <p>해당하는 모임이 없습니다.</p>
            )}
        </div>
    </div>
);

const MyParty = () => {
    const {user, isLoggedIn} = useAuth();
    const navigate = useNavigate();

    const [createdPosts, setCreatedPosts] = useState([]);
    const [joinedPosts, setJoinedPosts] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isLoggedIn) {
            alert("로그인이 필요합니다")
            navigate('/login');
            return;
        }

        const fetchMyPartyData = async () => {
            try {

                const [CreatedPostResponse, participatedPostResponse] = await Promise.all([
                    api.get('/api/me/posts'),
                    api.get('/api/me/posts/participates')
                ]);

                if (CreatedPostResponse.status === 200 && CreatedPostResponse.data.success) {
                    setCreatedPosts(CreatedPostResponse.data.body);
                }
                if (participatedPostResponse.status === 200 && participatedPostResponse.data.success) {
                    setJoinedPosts(participatedPostResponse.data.body);
                }
            } catch (err) {
                console.error("모임 목록을 로딩 중 오류:", err);
                setError('데이터를 불러오는 데 실패했습니다.');
            }
        };

        fetchMyPartyData();
    }, [isLoggedIn, navigate]);

    const handlePostClick = (postId) => {
        navigate(`/party/${postId}`);
    };

    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="my-party-container">
            <h1>내 모임 관리</h1>
            <PostList title="내가 만든 모임" posts={createdPosts} onPostClick={handlePostClick}/>
            <PostList title="내가 참가한 모임" posts={joinedPosts} onPostClick={handlePostClick}/>
        </div>
    );
};

export default MyParty;