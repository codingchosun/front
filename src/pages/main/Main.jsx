import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../contexts/AuthContext";
import PostCard from '../../components/common/PostCard';
import Button from '../../components/common/Button';
import SearchBar from '../../components/common/SearchBar';
import api from '../../api/api';
import "./Main.css";

const HashtagList = ({title, hashtags}) => {
    if (!hashtags || hashtags.length === 0) {
        return null;
    }
    return (
        <section className="hashtag-section">
            <h3>{title}</h3>
            <div className="hashtag-list">
                {hashtags.map(hashtag => (
                    <button key={hashtag.hashtagId} className="hashtag-button">
                        #{hashtag.hashtagName}
                    </button>
                ))}
            </div>
        </section>
    );
};

const Main = () => {
    const {isLoggedIn} = useAuth();
    const [recommendedPosts, setRecommendedPosts] = useState([]);
    const [generalPosts, setGeneralPosts] = useState([]);
    const [hashtags, setHashtags] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);

            try {
                const postResponse = await api.get('/api/posts');
                if (postResponse.status === 200 && postResponse.data.success) {
                    const responseBody = postResponse.data.body;
                    const allPosts = responseBody.posts.content || [];
                    console.log("log", allPosts)
                    if (isLoggedIn) {
                        setRecommendedPosts(allPosts.filter(post => post.recommend));
                        setGeneralPosts(allPosts);
                        setHashtags(responseBody.recommendHashtags || []);
                    } else {
                        setGeneralPosts(allPosts);
                        setHashtags(responseBody.randomHashtags || []);
                    }
                }
            } catch (err) {
                console.error('게시물을 불러오는 중 오류 발생:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [isLoggedIn]);

    if (loading) {
        return <div className="loading-message">게시물을 불러오는 중 입니다.</div>;
    }

    return (
        <div className="main-container">
            <header className="main__header">
                <h1 className="main__title">새로운 모임을 찾아보세요!!</h1>
                <SearchBar/>
            </header>

            <HashtagList
                title={isLoggedIn ? "추천 해시태그" : "추천 모임"}
                hashtags={hashtags}
            />

            {isLoggedIn && (
                <Button onClick={() => navigate('/post-registration')} className="main-new-post-button">
                    글작성
                </Button>
            )}

            <div className="main-posts-layout">
                {isLoggedIn && (
                    <section className="posts-section">
                        <h2>회원님을 위한 추천 모임</h2>
                        <div className="posts-grid">
                            {recommendedPosts.length > 0 ? (
                                recommendedPosts.map(post => <PostCard key={post.postId} post={post}/>)
                            ) : (
                                <p className="posts-empty-message">현재 추천 가능한 모임이 없습니다.</p>
                            )}
                        </div>
                    </section>
                )}
                <section className="posts-section">
                    <h2>전체 모임</h2>
                    <div className="posts-grid">
                        {generalPosts.length > 0 ? (
                            generalPosts.map(post => <PostCard key={post.postId} post={post}/>)
                        ) : (
                            <p className="posts-empty-message">아직 등록된 모임이 없습니다.</p>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Main;