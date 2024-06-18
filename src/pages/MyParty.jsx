// MyParty.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import axios from 'axios';
import './MyParty.css';
import api from "../api"
const MyParty = () => {
    const { isLogin } = useAuth();
    const navigate = useNavigate();

    const [userId, setUserId] = useState(null);
    const [loginId, setLoginId]=useState(null);

    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const response = await api.get("/getloginuser", {
                    withCredentials: true
                });
                setUserId(response.data.user_id);
                setLoginId(response.data.login_id);
                console.log("userId: ", userId);
                console.log("loginId: ", loginId);
            } catch (error) {
                console.error("사용자 확인 오류:", error);
            }
        };

        if (isLogin) {
            fetchUserId();
        }
    }, [loginId]);


    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await api.get('/mypost', { withCredentials: true });
                if (response.data.success){
                    setPosts(response.data.body);
                }
            } catch (error) {
                console.error('게시물 목록 에러:', error);
            }
        };

        if (isLogin) {
            fetchPosts();
        } else {
            navigate('/login');
        }
    }, [isLogin, navigate]);

    const handlePostClick = (postId) => {
        navigate('/party', { state: { postId } });
    };

    return (
        <div className="mypartyContainer">
            <h1>내가 참가한 모임</h1>
            <div className="partyList">
                {posts.length > 0 ? (
                    posts.map((post, index) => (
                        <div key={index} className="partyItem" onClick={() => handlePostClick(post.post_id)}>
                            <h3>{post.title}</h3>
                            <p>{post.create_at}</p>
                            <p>작성자: {post.author}</p>
                        </div>
                    ))
                ) : (
                    <p>참가한 모임이 없습니다.</p>
                )}
            </div>

        </div>
    );
};

export default MyParty;
